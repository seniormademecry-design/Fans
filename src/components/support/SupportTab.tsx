import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import {
  HelpCircle,
  ShieldAlert,
  MessageSquare,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Plus,
  Send,
  LifeBuoy,
  Clock,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Scale,
} from 'lucide-react';

export const SupportTab: React.FC = () => {
  const { tickets, createSupportTicket, replyToTicket, submitReport, setShowLegalModal, setLegalDocType } = useApp();

  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('payment');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('medium');

  // FAQ Accordion states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does age verification work on Aura?',
      a: 'Aura uses compliant, zero-knowledge tokenized age gating (Jumio & Yoti identity networks). All members and creators must verify they are 18 years of age or older before viewing any content or initiating transactions.',
    },
    {
      q: 'How is the platform 10% commission calculated?',
      a: 'The platform transparently retains 10% of gross eligible creator earnings (subscriptions, PPV unlocks, paid calls, and tips). The remaining 90% is allocated directly to the creator’s available or pending balance.',
    },
    {
      q: 'How are private voice and video calls billed?',
      a: 'Calls are billed strictly per minute at the creator’s published rate. You are shown the exact rate, your remaining balance, and a live duration counter. Upon hanging up, an itemized receipt is instantly displayed and settled.',
    },
    {
      q: 'What are the rules regarding screenshotting or downloading content?',
      a: 'Aura enforces digital DRM and cryptographic user watermarking. Screen capture, downloading, or redistributing private creator sets is strictly prohibited under DMCA and our Terms of Service, leading to permanent account bans and legal referral.',
    },
    {
      q: 'How do creators withdraw their earnings?',
      a: 'Creators can withdraw cleared balances at any time once they reach the $50.00 minimum threshold. Withdrawals are processed via Paxum, SEPA, ACH direct wire, or crypto USDC within 24–48 hours after fraud screening.',
    },
  ];

  const activeTicket = tickets.find((t) => t.id === activeTicketId);

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !activeTicket) return;
    replyToTicket(activeTicket.id, ticketReplyText);
    setTicketReplyText('');
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    createSupportTicket(newCategory, newSubject, newMessage, newPriority);
    setNewSubject('');
    setNewMessage('');
    setShowNewTicketModal(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Emergency Safety Escalation Banner */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e131b] border border-white/10 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Customer Care & Safety Center</h2>
              <p className="text-xs text-zinc-400">24/7 Human Trust & Safety Support</p>
            </div>
          </div>

          <button
            id="open-new-ticket-btn"
            onClick={() => setShowNewTicketModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-semibold hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Open Support Ticket</span>
          </button>
        </div>

        {/* Emergency Escalation Alert Box (Prompt Mandate) */}
        <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-300 uppercase tracking-wide">
                Zero Tolerance & Urgent Safety Escalation
              </h4>
              <p className="text-xs text-red-200/90 mt-0.5 leading-relaxed">
                If you suspect non-consensual content, suspected minors, coercion, or severe harassment, our emergency team
                freezes accounts immediately and notifies law enforcement / NCMEC.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setNewCategory('illegal_content' as any);
              setNewPriority('urgent');
              setNewSubject('URGENT: Emergency Safety Escalation');
              setShowNewTicketModal(true);
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl whitespace-nowrap self-start sm:self-auto shadow-md"
          >
            Emergency Report
          </button>
        </div>
      </div>

      {/* Main Ticket & Support Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Ticket List (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-[#0e131b] border border-white/10 rounded-2xl p-4 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Internal Tickets ({tickets.length})
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Live Agent Queue</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5 pr-1 mt-2">
            {tickets.map((t) => {
              const isSelected = activeTicketId === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`w-full p-3 text-left rounded-xl my-1 transition-all ${
                    isSelected ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">{t.ticketNumber}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        t.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : t.status === 'investigating'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-white mt-1 line-clamp-1">{t.subject}</h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                    <span className="capitalize">{t.category.replace('_', ' ')}</span>
                    <span>{t.updatedAt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Ticket Conversation Thread (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-[#0e131b] border border-white/10 rounded-2xl flex flex-col h-[520px] overflow-hidden">
          {activeTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="p-4 border-b border-white/10 bg-[#121824] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{activeTicket.ticketNumber}</span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs font-semibold text-white">{activeTicket.subject}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    Priority: <span className="uppercase text-amber-300">{activeTicket.priority}</span> • Category:{' '}
                    {activeTicket.category}
                  </p>
                </div>

                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold ${
                    activeTicket.status === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {activeTicket.status.toUpperCase()}
                </span>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeTicket.messages.map((m) => {
                  const isAgent = m.sender === 'agent' || m.sender === 'system';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-1 px-1 font-mono">
                        <span className="font-semibold text-zinc-300">{m.senderName}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isAgent
                            ? 'bg-[#151c27] text-zinc-200 border border-white/10'
                            : 'bg-amber-500 text-zinc-950 font-medium'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendTicketReply} className="p-3 bg-[#0c1017] border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type reply to Trust & Safety officer..."
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                  className="flex-1 bg-[#151c27] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!ticketReplyText.trim()}
                  className={`p-2 rounded-xl transition-all ${
                    !ticketReplyText.trim()
                      ? 'bg-zinc-800 text-zinc-600'
                      : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-zinc-500 text-xs">
              <MessageSquare className="w-8 h-8 mb-2 text-zinc-600" />
              <span>Select or create a support ticket</span>
            </div>
          )}
        </div>
      </div>

      {/* Safety Resources & External Helpline Links */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Compliance Standards & External Safety Resources</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <h4 className="font-semibold text-white">NCMEC Partnership</h4>
            <p className="text-[11px] text-zinc-400">
              Automated hash sharing with National Center for Missing & Exploited Children.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <h4 className="font-semibold text-white">18 U.S.C. 2257 Custodian</h4>
            <p className="text-[11px] text-zinc-400">
              Identity logs and age verification certificates archived securely off-site.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <h4 className="font-semibold text-white">Chargeback & Fraud Shield</h4>
            <p className="text-[11px] text-zinc-400">
              Escrow mechanisms and behavioral bot filtering protect creator balances.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-white/5">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-2.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold text-zinc-200 hover:text-white py-1 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>

                {isOpen && (
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed pl-1 pr-4">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTicketSubmit}
            className="w-full max-w-md bg-[#0e131b] border border-white/15 rounded-2xl p-5 text-zinc-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-amber-400" />
                <span>Open New Support Case</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Select Issue Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white"
                >
                  <option value="payment">Payment & Wallet Billing</option>
                  <option value="account">Account & Age Verification</option>
                  <option value="report_creator">Report Creator / Content</option>
                  <option value="harassment">Harassment or Abuse</option>
                  <option value="fraud">Fraud / Unauthorized Charge</option>
                  <option value="copyright">Copyright / DMCA Infringement</option>
                  <option value="refund">Refund Request</option>
                  <option value="appeal">Account Suspension Appeal</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white"
                >
                  <option value="low">Low (Standard response within 24h)</option>
                  <option value="medium">Medium (Priority response within 6h)</option>
                  <option value="high">High (Urgent billing or security issue)</option>
                  <option value="urgent">Urgent (Immediate Safety Intervention)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Subject</label>
                <input
                  type="text"
                  placeholder="Summary of issue..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide complete details, transaction IDs, or usernames..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold shadow-md"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
