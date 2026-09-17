export type UserRole = 'user' | 'creator' | 'admin';

export type AgeVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type CreatorKYCStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: UserRole;
  ageVerified: boolean;
  ageVerificationMethod?: 'government_id' | 'credit_card' | 'biometric_selfie';
  ageVerificationDate?: string;
  balance: number; // in USD
  email: string;
  twoFactorEnabled: boolean;
  stealthMode: boolean;
  notificationsEnabled: boolean;
  blockedUsers: string[];
}

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  categories: string[];
  isVerified: boolean;
  kycStatus: CreatorKYCStatus;
  kycSubmittedAt?: string;
  subscriptionPrice: number; // Monthly price
  ppvStartingPrice: number;
  voiceCallRatePerMin: number; // e.g. $3.50/min
  videoCallRatePerMin: number; // e.g. $6.00/min
  paidMessageRate: number; // e.g. $5.00
  isOnline: boolean;
  lastActive: string;
  stats: {
    subscribersCount: number;
    postsCount: number;
    likesCount: number;
    rating: number;
    ratingCount: number;
  };
  totalEarnings: number;
  pendingBalance: number;
  availableBalance: number;
  lifetimeGross: number;
}

export interface ContentItem {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  caption: string;
  mediaType: 'image' | 'video' | 'gallery';
  mediaUrl: string;
  previewUrl?: string; // Blurred or teaser
  isPPV: boolean;
  price: number; // $0 if subscriber-accessible
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  status: 'published' | 'flagged' | 'removed';
  watermarkText: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video';
  isPaid?: boolean;
  paidAmount?: number;
  isUnlocked?: boolean;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantUsername: string;
  participantAvatar: string;
  isVerified: boolean;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
  voiceCallRate: number;
  videoCallRate: number;
}

export interface CallSession {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  userId: string;
  userName: string;
  type: 'voice' | 'video';
  ratePerMin: number;
  startTime: number;
  durationSeconds: number;
  status: 'connecting' | 'active' | 'ended';
  totalCharge: number;
  platformFee: number;
  creatorEarnings: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'subscription' | 'ppv_content' | 'voice_call' | 'video_call' | 'paid_message' | 'wallet_deposit' | 'creator_withdrawal' | 'refund';
  title: string;
  creatorId?: string;
  creatorName?: string;
  amount: number; // Gross amount paid by user or requested by creator
  platformCommission: number; // 10%
  processingFee: number; // e.g. 2.9% + $0.30
  netCreatorEarnings: number; // Amount added to creator balance
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  receiptId: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  category: 'payment' | 'account' | 'report_creator' | 'harassment' | 'fraud' | 'copyright' | 'refund' | 'appeal' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  subject: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'user' | 'agent' | 'system';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'creator' | 'user' | 'content' | 'message';
  targetName: string;
  reason: 'harassment' | 'fraud' | 'prohibited_material' | 'underage_suspected' | 'non_consensual' | 'copyright' | 'other';
  description: string;
  evidenceUrl?: string;
  status: 'pending_review' | 'escalated' | 'dismissed' | 'actioned';
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  amount: number;
  platformFeeDeducted: number;
  netPayout: number;
  destination: string; // e.g. "Paxum •••• 4892" or "Direct Wire •••• 9102"
  status: 'pending_approval' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
}
