import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  CreatorProfile,
  ContentItem,
  Conversation,
  Transaction,
  SupportTicket,
  SafetyReport,
  WithdrawalRequest,
  AuditLogEntry,
  UserRole,
  CallSession,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_CREATORS,
  INITIAL_POSTS,
  INITIAL_CONVERSATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_TICKETS,
  INITIAL_REPORTS,
  INITIAL_WITHDRAWALS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

interface CheckoutDetails {
  title: string;
  type: 'subscription' | 'ppv_content' | 'paid_message';
  price: number;
  creatorId: string;
  creatorName: string;
  contentId?: string;
  onSuccess?: () => void;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: 'discover' | 'messages' | 'wallet' | 'support' | 'account';
  setActiveTab: (tab: 'discover' | 'messages' | 'wallet' | 'support' | 'account') => void;
  viewMode: 'main' | 'creator_studio' | 'admin_panel';
  setViewMode: (mode: 'main' | 'creator_studio' | 'admin_panel') => void;
  selectedCreatorId: string | null;
  setSelectedCreatorId: (id: string | null) => void;

  // Age & KYC Gating
  isAgeVerified: boolean;
  verifyAge: (method: 'government_id' | 'credit_card' | 'biometric_selfie') => void;
  showAgeGate: boolean;
  setShowAgeGate: (show: boolean) => void;

  // Legal modal
  showLegalModal: boolean;
  setShowLegalModal: (show: boolean) => void;
  legalDocType: 'terms' | 'privacy' | 'guidelines' | 'creator_agreement' | 'refunds';
  setLegalDocType: (type: 'terms' | 'privacy' | 'guidelines' | 'creator_agreement' | 'refunds') => void;

  // User & Creator State
  user: UserProfile;
  creators: CreatorProfile[];
  currentCreator: CreatorProfile; // Active creator when in creator role
  posts: ContentItem[];
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  transactions: Transaction[];
  tickets: SupportTicket[];
  reports: SafetyReport[];
  withdrawals: WithdrawalRequest[];
  auditLogs: AuditLogEntry[];
  subscribedCreatorIds: string[];
  purchasedPostIds: string[];

  // Actions
  subscribeToCreator: (creatorId: string) => boolean;
  unsubscribeFromCreator: (creatorId: string) => void;
  purchaseContent: (contentId: string) => boolean;
  toggleLikePost: (postId: string) => void;
  sendMessage: (convId: string, text: string, isPaid?: boolean, paidAmount?: number) => void;
  topUpWallet: (amount: number, method: string) => void;
  requestWithdrawal: (creatorId: string, amount: number, destination: string) => boolean;
  createSupportTicket: (category: SupportTicket['category'], subject: string, initialMessage: string, priority?: SupportTicket['priority']) => void;
  replyToTicket: (ticketId: string, message: string) => void;
  submitReport: (targetId: string, targetType: SafetyReport['targetType'], targetName: string, reason: SafetyReport['reason'], description: string) => void;

  // Creator Actions
  createPost: (post: Omit<ContentItem, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'status' | 'watermarkText'>) => void;
  updateCreatorPricing: (creatorId: string, pricing: { subscriptionPrice?: number; ppvStartingPrice?: number; voiceCallRatePerMin?: number; videoCallRatePerMin?: number; paidMessageRate?: number }) => void;
  submitCreatorKYC: (creatorId: string, documents: string[]) => void;

  // Admin Actions
  approveCreatorKYC: (creatorId: string) => void;
  rejectCreatorKYC: (creatorId: string) => void;
  moderatePost: (postId: string, action: 'approve' | 'remove') => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'action') => void;
  approveWithdrawal: (withdrawalId: string) => void;
  rejectWithdrawal: (withdrawalId: string) => void;

  // Checkout Modal
  checkoutDetails: CheckoutDetails | null;
  openCheckout: (details: CheckoutDetails) => void;
  closeCheckout: () => void;
  processCheckout: (paymentMethod: string) => boolean;

  // Interactive Live Call
  activeCall: CallSession | null;
  startCall: (creatorId: string, type: 'voice' | 'video') => void;
  endCall: () => void;
  callReceipt: CallSession | null;
  setCallReceipt: (session: CallSession | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & Nav
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [activeTab, setActiveTab] = useState<'discover' | 'messages' | 'wallet' | 'support' | 'account'>('discover');
  const [viewMode, setViewMode] = useState<'main' | 'creator_studio' | 'admin_panel'>('main');
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  // Age & Legal
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    const saved = localStorage.getItem('aura_age_verified');
    return saved ? JSON.parse(saved) : true; // Default true for frictionless testing, with option to re-test
  });
  const [showAgeGate, setShowAgeGate] = useState<boolean>(false);
  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [legalDocType, setLegalDocType] = useState<'terms' | 'privacy' | 'guidelines' | 'creator_agreement' | 'refunds'>('terms');

  // Core Data
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [creators, setCreators] = useState<CreatorProfile[]>(() => {
    const saved = localStorage.getItem('aura_creators');
    return saved ? JSON.parse(saved) : INITIAL_CREATORS;
  });

  const [posts, setPosts] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('aura_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('aura_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('aura_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('aura_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [reports, setReports] = useState<SafetyReport[]>(() => {
    const saved = localStorage.getItem('aura_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('aura_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('aura_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [subscribedCreatorIds, setSubscribedCreatorIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_subscriptions');
    return saved ? JSON.parse(saved) : ['cr_elena_01'];
  });

  const [purchasedPostIds, setPurchasedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_purchases');
    return saved ? JSON.parse(saved) : ['post_chloe_01'];
  });

  // Modals & Calls
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [callReceipt, setCallReceipt] = useState<CallSession | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aura_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aura_creators', JSON.stringify(creators));
  }, [creators]);

  useEffect(() => {
    localStorage.setItem('aura_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('aura_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('aura_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('aura_subscriptions', JSON.stringify(subscribedCreatorIds));
  }, [subscribedCreatorIds]);

  useEffect(() => {
    localStorage.setItem('aura_purchases', JSON.stringify(purchasedPostIds));
  }, [purchasedPostIds]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, target: string, details: string) => {
    const entry: AuditLogEntry = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentRole === 'admin' ? 'platform_admin_session' : user.username,
      action,
      target,
      details,
      ipAddress: '203.0.113.42 (Encrypted Proxy)',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const verifyAge = (method: 'government_id' | 'credit_card' | 'biometric_selfie') => {
    setIsAgeVerified(true);
    localStorage.setItem('aura_age_verified', 'true');
    setUser((prev) => ({
      ...prev,
      ageVerified: true,
      ageVerificationMethod: method,
      ageVerificationDate: new Date().toISOString().split('T')[0],
    }));
    setShowAgeGate(false);
    addToast('success', '18+ Age Verified', 'Full marketplace access has been unlocked.');
    addAuditLog('18+_AGE_VERIFIED', user.id, `Verified using ${method} (Compliance Pass)`);
  };

  // Checkout helpers
  const openCheckout = (details: CheckoutDetails) => {
    setCheckoutDetails(details);
  };

  const closeCheckout = () => {
    setCheckoutDetails(null);
  };

  const processCheckout = (paymentMethod: string): boolean => {
    if (!checkoutDetails) return false;
    const { title, type, price, creatorId, creatorName, contentId, onSuccess } = checkoutDetails;

    // Check if user has sufficient funds if wallet chosen
    if (paymentMethod === 'Aura Wallet Balance' && user.balance < price) {
      addToast('error', 'Insufficient Wallet Balance', `Please top up $${(price - user.balance).toFixed(2)} to complete this payment.`);
      return false;
    }

    // Deduct user wallet if selected
    if (paymentMethod === 'Aura Wallet Balance') {
      setUser((prev) => ({ ...prev, balance: Number((prev.balance - price).toFixed(2)) }));
    }

    // 10% platform commission calculation
    const platformCommission = Number((price * 0.10).toFixed(2));
    const processingFee = Number((price * 0.029 + 0.30).toFixed(2));
    const netCreatorEarnings = Number((price - platformCommission - processingFee).toFixed(2));

    // Update creator balances
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id === creatorId) {
          return {
            ...c,
            totalEarnings: Number((c.totalEarnings + price).toFixed(2)),
            availableBalance: Number((c.availableBalance + netCreatorEarnings).toFixed(2)),
            lifetimeGross: Number((c.lifetimeGross + price).toFixed(2)),
          };
        }
        return c;
      })
    );

    // Record transaction
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type,
      title,
      creatorId,
      creatorName,
      amount: price,
      platformCommission,
      processingFee,
      netCreatorEarnings,
      status: 'completed',
      paymentMethod,
      receiptId: 'REC-2026-' + Math.floor(10000 + Math.random() * 90000),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Handle subscription / purchase unlock
    if (type === 'subscription') {
      setSubscribedCreatorIds((prev) => Array.from(new Set([...prev, creatorId])));
      setCreators((prev) =>
        prev.map((c) => (c.id === creatorId ? { ...c, stats: { ...c.stats, subscribersCount: c.stats.subscribersCount + 1 } } : c))
      );
    } else if (type === 'ppv_content' && contentId) {
      setPurchasedPostIds((prev) => Array.from(new Set([...prev, contentId])));
    }

    addToast('success', 'Transaction Successful', `Unlocked "${title}". 10% platform fee transparently processed.`);
    addAuditLog('TRANSACTION_COMPLETED', newTx.id, `Amount: $${price} | 10% Commission: $${platformCommission} | Creator: ${creatorName}`);

    if (onSuccess) onSuccess();
    closeCheckout();
    return true;
  };

  const subscribeToCreator = (creatorId: string): boolean => {
    const creator = creators.find((c) => c.id === creatorId);
    if (!creator) return false;

    if (subscribedCreatorIds.includes(creatorId)) {
      addToast('info', 'Already Subscribed', `You have active access to ${creator.displayName}'s exclusive tier.`);
      return true;
    }

    openCheckout({
      title: `1-Month Tier Access to ${creator.displayName}`,
      type: 'subscription',
      price: creator.subscriptionPrice,
      creatorId: creator.id,
      creatorName: creator.displayName,
    });
    return true;
  };

  const unsubscribeFromCreator = (creatorId: string) => {
    setSubscribedCreatorIds((prev) => prev.filter((id) => id !== creatorId));
    addToast('info', 'Subscription Canceled', 'Auto-renew has been disabled at cycle end.');
  };

  const purchaseContent = (contentId: string): boolean => {
    const post = posts.find((p) => p.id === contentId);
    if (!post) return false;

    if (purchasedPostIds.includes(contentId)) {
      addToast('info', 'Already Purchased', 'You own permanent access to this private media set.');
      return true;
    }

    openCheckout({
      title: `Private Media: ${post.caption.slice(0, 30)}...`,
      type: 'ppv_content',
      price: post.price,
      creatorId: post.creatorId,
      creatorName: post.creatorName,
      contentId: post.id,
    });
    return true;
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const sendMessage = (convId: string, text: string, isPaid = false, paidAmount = 0) => {
    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId: currentRole === 'creator' ? 'cr_elena_01' : user.id,
      receiverId: convId,
      text,
      isPaid,
      paidAmount,
      isUnlocked: !isPaid,
      createdAt: 'Just now',
      status: 'sent' as const,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === convId) {
          return {
            ...conv,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
  };

  const topUpWallet = (amount: number, method: string) => {
    const processingFee = Number((amount * 0.029 + 0.30).toFixed(2));
    setUser((prev) => ({ ...prev, balance: Number((prev.balance + amount).toFixed(2)) }));

    const newTx: Transaction = {
      id: 'tx_dep_' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'wallet_deposit',
      title: `Wallet Deposit (+$${amount.toFixed(2)})`,
      amount,
      platformCommission: 0,
      processingFee,
      netCreatorEarnings: 0,
      status: 'completed',
      paymentMethod: method,
      receiptId: 'REC-DEP-' + Math.floor(10000 + Math.random() * 90000),
    };
    setTransactions((prev) => [newTx, ...prev]);
    addToast('success', 'Deposit Confirmed', `$${amount.toFixed(2)} added to your private wallet.`);
    addAuditLog('WALLET_DEPOSIT', user.id, `Amount: $${amount} via ${method}`);
  };

  const requestWithdrawal = (creatorId: string, amount: number, destination: string): boolean => {
    const creator = creators.find((c) => c.id === creatorId);
    if (!creator) return false;

    if (amount < 50) {
      addToast('error', 'Minimum Withdrawal Threshold', 'The minimum withdrawal limit is $50.00 USD.');
      return false;
    }

    if (amount > creator.availableBalance) {
      addToast('error', 'Insufficient Available Balance', `Available to withdraw: $${creator.availableBalance.toFixed(2)}`);
      return false;
    }

    // Deduct from available balance
    setCreators((prev) =>
      prev.map((c) => (c.id === creatorId ? { ...c, availableBalance: Number((c.availableBalance - amount).toFixed(2)) } : c))
    );

    const wdr: WithdrawalRequest = {
      id: 'wdr_' + Date.now(),
      creatorId,
      creatorName: creator.displayName,
      amount,
      platformFeeDeducted: 0, // Commission was already collected at time of sale
      netPayout: amount,
      destination,
      status: 'pending_approval',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setWithdrawals((prev) => [wdr, ...prev]);
    addToast('success', 'Payout Request Submitted', `Withdrawal of $${amount.toFixed(2)} is pending 24h compliance audit.`);
    addAuditLog('WITHDRAWAL_REQUESTED', creatorId, `Amount: $${amount} to ${destination}`);
    return true;
  };

  const createSupportTicket = (
    category: SupportTicket['category'],
    subject: string,
    initialMessage: string,
    priority: SupportTicket['priority'] = 'medium'
  ) => {
    const ticketNum = 'AUR-' + Math.floor(10000 + Math.random() * 90000);
    const newTicket: SupportTicket = {
      id: 'tkt_' + Date.now(),
      ticketNumber: ticketNum,
      userId: user.id,
      userName: user.name,
      category,
      priority,
      status: 'open',
      subject,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      messages: [
        {
          id: 'tm_' + Date.now(),
          sender: 'user',
          senderName: user.name,
          text: initialMessage,
          timestamp: 'Just now',
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    addToast('success', 'Ticket Dispatched', `Case #${ticketNum} assigned to Trust & Safety team.`);
    addAuditLog('SUPPORT_TICKET_CREATED', ticketNum, `Category: ${category} | Subject: ${subject}`);
  };

  const replyToTicket = (ticketId: string, message: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: 'Just now',
            messages: [
              ...t.messages,
              {
                id: 'tm_' + Date.now(),
                sender: currentRole === 'admin' ? 'agent' : 'user',
                senderName: currentRole === 'admin' ? 'Aura Safety Supervisor' : user.name,
                text: message,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const submitReport = (
    targetId: string,
    targetType: SafetyReport['targetType'],
    targetName: string,
    reason: SafetyReport['reason'],
    description: string
  ) => {
    const rep: SafetyReport = {
      id: 'rep_' + Date.now(),
      reporterId: user.id,
      targetId,
      targetType,
      targetName,
      reason,
      description,
      status: reason === 'underage_suspected' || reason === 'non_consensual' ? 'escalated' : 'pending_review',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setReports((prev) => [rep, ...prev]);
    addToast('warning', 'Report Logged', 'Our 24/7 Human Safety team is investigating this issue immediately.');
    addAuditLog('SAFETY_REPORT_SUBMITTED', targetId, `Reason: ${reason} on ${targetType} "${targetName}"`);
  };

  // Creator Actions
  const createPost = (newPostData: Omit<ContentItem, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'status' | 'watermarkText'>) => {
    const post: ContentItem = {
      ...newPostData,
      id: 'post_' + Date.now(),
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      status: 'published',
      watermarkText: `AURA • PROTECTED • USER#${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setPosts((prev) => [post, ...prev]);
    setCreators((prev) =>
      prev.map((c) => (c.id === post.creatorId ? { ...c, stats: { ...c.stats, postsCount: c.stats.postsCount + 1 } } : c))
    );
    addToast('success', 'Content Published', 'Post is live in subscriber and PPV feeds.');
    addAuditLog('CONTENT_PUBLISHED', post.id, `Type: ${post.mediaType} | Price: $${post.price}`);
  };

  const updateCreatorPricing = (
    creatorId: string,
    pricing: { subscriptionPrice?: number; ppvStartingPrice?: number; voiceCallRatePerMin?: number; videoCallRatePerMin?: number; paidMessageRate?: number }
  ) => {
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id === creatorId) {
          return { ...c, ...pricing };
        }
        return c;
      })
    );
    addToast('success', 'Rates Updated', 'Your interaction and subscription fees have been updated.');
  };

  const submitCreatorKYC = (creatorId: string, documents: string[]) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === creatorId ? { ...c, kycStatus: 'pending', kycSubmittedAt: new Date().toISOString().split('T')[0] } : c))
    );
    addToast('info', 'KYC Under Review', 'ID & 2257 documentation transmitted securely to compliance.');
    addAuditLog('CREATOR_KYC_SUBMITTED', creatorId, `Docs: ${documents.join(', ')}`);
  };

  // Admin Actions
  const approveCreatorKYC = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === creatorId ? { ...c, isVerified: true, kycStatus: 'verified' } : c))
    );
    addToast('success', 'Creator Approved', 'Creator is now verified with full payout and publishing rights.');
    addAuditLog('ADMIN_KYC_APPROVED', creatorId, 'Official identity & 2257 verified.');
  };

  const rejectCreatorKYC = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === creatorId ? { ...c, isVerified: false, kycStatus: 'rejected' } : c))
    );
    addToast('error', 'KYC Rejected', 'Creator has been notified to provide clearer government documentation.');
    addAuditLog('ADMIN_KYC_REJECTED', creatorId, 'Document verification failed.');
  };

  const moderatePost = (postId: string, action: 'approve' | 'remove') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, status: action === 'approve' ? 'published' : 'removed' };
        }
        return p;
      })
    );
    addToast(action === 'approve' ? 'success' : 'warning', 'Content Moderated', `Post status set to ${action}.`);
    addAuditLog('ADMIN_CONTENT_MODERATION', postId, `Action: ${action}`);
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'action') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'actioned' } : r))
    );
    addToast('info', 'Report Updated', `Report set to ${action}.`);
    addAuditLog('ADMIN_REPORT_RESOLVED', reportId, `Outcome: ${action}`);
  };

  const approveWithdrawal = (withdrawalId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'completed', processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : w))
    );
    addToast('success', 'Withdrawal Approved', 'Payout sent to external payment partner.');
    addAuditLog('ADMIN_WITHDRAWAL_APPROVED', withdrawalId, 'Cleared compliance audit.');
  };

  const rejectWithdrawal = (withdrawalId: string) => {
    const wdr = withdrawals.find((w) => w.id === withdrawalId);
    if (wdr) {
      // Refund available balance to creator
      setCreators((prev) =>
        prev.map((c) => (c.id === wdr.creatorId ? { ...c, availableBalance: Number((c.availableBalance + wdr.amount).toFixed(2)) } : c))
      );
    }
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'rejected' } : w))
    );
    addToast('error', 'Withdrawal Rejected', 'Funds returned to creator available balance.');
    addAuditLog('ADMIN_WITHDRAWAL_REJECTED', withdrawalId, 'Flagged for billing review.');
  };

  // Call simulation
  const startCall = (creatorId: string, type: 'voice' | 'video') => {
    const creator = creators.find((c) => c.id === creatorId);
    if (!creator) return;

    const rate = type === 'voice' ? creator.voiceCallRatePerMin : creator.videoCallRatePerMin;
    if (user.balance < rate) {
      addToast('error', 'Low Balance', `You need at least $${rate.toFixed(2)} in your wallet to start this call.`);
      return;
    }

    const session: CallSession = {
      id: 'call_' + Date.now(),
      creatorId,
      creatorName: creator.displayName,
      creatorAvatar: creator.avatar,
      userId: user.id,
      userName: user.name,
      type,
      ratePerMin: rate,
      startTime: Date.now(),
      durationSeconds: 0,
      status: 'active',
      totalCharge: 0,
      platformFee: 0,
      creatorEarnings: 0,
    };
    setActiveCall(session);
  };

  const endCall = () => {
    if (!activeCall) return;
    const durationMins = Math.max(1, Math.ceil(activeCall.durationSeconds / 60));
    const totalCharge = Number((durationMins * activeCall.ratePerMin).toFixed(2));
    const platformFee = Number((totalCharge * 0.10).toFixed(2));
    const processingFee = Number((totalCharge * 0.029 + 0.30).toFixed(2));
    const creatorEarnings = Number((totalCharge - platformFee - processingFee).toFixed(2));

    const completedSession: CallSession = {
      ...activeCall,
      status: 'ended',
      totalCharge,
      platformFee,
      creatorEarnings,
    };

    // Deduct user wallet
    setUser((prev) => ({ ...prev, balance: Number((Math.max(0, prev.balance - totalCharge)).toFixed(2)) }));

    // Credit creator
    setCreators((prev) =>
      prev.map((c) =>
        c.id === activeCall.creatorId
          ? {
              ...c,
              totalEarnings: Number((c.totalEarnings + totalCharge).toFixed(2)),
              availableBalance: Number((c.availableBalance + creatorEarnings).toFixed(2)),
              lifetimeGross: Number((c.lifetimeGross + totalCharge).toFixed(2)),
            }
          : c
      )
    );

    // Record transaction
    const newTx: Transaction = {
      id: 'tx_call_' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: activeCall.type === 'voice' ? 'voice_call' : 'video_call',
      title: `${activeCall.type === 'voice' ? 'Voice' : 'Video'} Call (${durationMins}m) with ${activeCall.creatorName}`,
      creatorId: activeCall.creatorId,
      creatorName: activeCall.creatorName,
      amount: totalCharge,
      platformCommission: platformFee,
      processingFee,
      netCreatorEarnings: creatorEarnings,
      status: 'completed',
      paymentMethod: 'Aura Wallet Balance',
      receiptId: 'REC-CALL-' + Math.floor(10000 + Math.random() * 90000),
    };
    setTransactions((prev) => [newTx, ...prev]);

    setCallReceipt(completedSession);
    setActiveCall(null);
    addAuditLog('PAID_CALL_COMPLETED', activeCall.id, `Duration: ${durationMins} min | Charge: $${totalCharge} | 10% Fee: $${platformFee}`);
  };

  const currentCreator = creators[0]; // Active creator persona (Elena Rostova) for testing creator dashboard

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        selectedCreatorId,
        setSelectedCreatorId,
        isAgeVerified,
        verifyAge,
        showAgeGate,
        setShowAgeGate,
        showLegalModal,
        setShowLegalModal,
        legalDocType,
        setLegalDocType,
        user,
        creators,
        currentCreator,
        posts,
        conversations,
        activeConversationId,
        setActiveConversationId,
        transactions,
        tickets,
        reports,
        withdrawals,
        auditLogs,
        subscribedCreatorIds,
        purchasedPostIds,
        subscribeToCreator,
        unsubscribeFromCreator,
        purchaseContent,
        toggleLikePost,
        sendMessage,
        topUpWallet,
        requestWithdrawal,
        createSupportTicket,
        replyToTicket,
        submitReport,
        createPost,
        updateCreatorPricing,
        submitCreatorKYC,
        approveCreatorKYC,
        rejectCreatorKYC,
        moderatePost,
        resolveReport,
        approveWithdrawal,
        rejectWithdrawal,
        checkoutDetails,
        openCheckout,
        closeCheckout,
        processCheckout,
        activeCall,
        startCall,
        endCall,
        callReceipt,
        setCallReceipt,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
