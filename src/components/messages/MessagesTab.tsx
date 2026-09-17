import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Phone,
  Video,
  DollarSign,
  Shield,
  AlertTriangle,
  MoreVertical,
  CheckCircle,
  Paperclip,
  Lock,
  Flag,
  UserX,
  Sparkles,
} from 'lucide-react';

export const MessagesTab: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    startCall,
    submitReport,
    user,
    creators,
    addToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isPaidMessage, setIsPaidMessage] = useState(false);
  const [paidMessageAmount, setPaidMessageAmount] = useState('5.00');
  const [showOptions, setShowOptions] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isScanningMedia, setIsScanningMedia] = useState(false);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const matchedCreator = activeConv
    ? creators.find((c) => c.id === activeConv.participantId)
    : null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !mediaPreview) return;
    if (!activeConv) return;

    const amount = isPaidMessage ? parseFloat(paidMessageAmount) || 5.0 : 0;
    sendMessage(activeConv.id, inputMessage, isPaidMessage, amount);

    setInputMessage('');
    setIsPaidMessage(false);
    setMediaPreview(null);
  };

  const handleSimulateMediaUpload = () => {
    // Simulate attaching an image with real-time automated safety scanning
    setIsScanningMedia(true);
    setTimeout(() => {
      setIsScanningMedia(false);
      setMediaPreview(
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      );
      addToast('success', 'Media Cleared', 'Automated moderation scan passed (No prohibited content detected).');
    }, 800);
  };

  const handleReportUser = () => {
    if (!activeConv) return;
    submitReport(
      activeConv.participantId,
      'user',
      activeConv.participantName,
      'harassment',
      'Reported from private messages context.'
    );
    setShowOptions(false);
  };

  const handleBlockUser = () => {
    if (!activeConv) return;
    addToast('warning', 'User Blocked', `Direct communication with @${activeConv.participantUsername} is suspended.`);
    setShowOptions(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)] max-h-[750px] pb-16">
      {/* Left List of Conversations */}
      <div
        className={`w-full md:w-80 flex-shrink-0 bg-[#0e131b] border border-white/10 rounded-2xl flex flex-col overflow-hidden ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide">Direct Messages</h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            E2E Encrypted
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {conversations.map((conv) => {
            const isSelected = activeConv?.id === conv.id;

            return (
              <button
                key={conv.id}
                id={`conversation-item-${conv.id}`}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                  isSelected ? 'bg-amber-500/10 border-l-2 border-amber-400' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-11 h-11 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {conv.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0e131b]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white truncate flex items-center gap-1">
                      {conv.participantName}
                      {conv.isVerified && <CheckCircle className="w-3 h-3 text-amber-400" />}
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono">{conv.lastMessageTime}</span>
                  </div>

                  <p className="text-xs text-zinc-400 truncate mt-1">{conv.lastMessage}</p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Call: ${conv.voiceCallRate.toFixed(2)}/m
                    </span>

                    {conv.unreadCount > 0 && (
                      <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Thread Window */}
      {activeConv ? (
        <div
          className={`flex-1 bg-[#0e131b] border border-white/10 rounded-2xl flex flex-col overflow-hidden ${
            !activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Chat Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#111622]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConversationId(null)}
                className="md:hidden text-zinc-400 hover:text-white text-sm"
              >
                ←
              </button>

              <div className="relative">
                <img
                  src={activeConv.participantAvatar}
                  alt={activeConv.participantName}
                  className="w-10 h-10 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                {activeConv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#111622]" />
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  {activeConv.participantName}
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono">
                  @{activeConv.participantUsername} • {activeConv.isOnline ? 'Online now' : 'Away'}
                </p>
              </div>
            </div>

            {/* Top Action Buttons (Paid Voice/Video Calls & Options) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => startCall(activeConv.participantId, 'voice')}
                title={`Start Voice Call ($${activeConv.voiceCallRate.toFixed(2)}/min)`}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 rounded-lg transition-colors border border-white/10 flex items-center gap-1 text-xs font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono">${activeConv.voiceCallRate.toFixed(2)}/m</span>
              </button>

              <button
                onClick={() => startCall(activeConv.participantId, 'video')}
                title={`Start Video Call ($${activeConv.videoCallRate.toFixed(2)}/min)`}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-rose-400 rounded-lg transition-colors border border-white/10 flex items-center gap-1 text-xs font-medium"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono">${activeConv.videoCallRate.toFixed(2)}/m</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showOptions && (
                  <div className="absolute right-0 mt-1 w-44 bg-[#141b26] border border-white/15 rounded-xl shadow-xl py-1 z-30 text-xs">
                    <button
                      onClick={handleReportUser}
                      className="w-full px-3 py-2 text-left text-zinc-300 hover:bg-white/5 flex items-center gap-2"
                    >
                      <Flag className="w-3.5 h-3.5 text-rose-400" />
                      <span>Report Participant</span>
                    </button>
                    <button
                      onClick={handleBlockUser}
                      className="w-full px-3 py-2 text-left text-rose-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/5"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Block Contact</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Safety & Compliance Reminder */}
          <div className="px-4 py-1.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Anti-Harassment & Automated Content Filter Active</span>
            </span>
            <span className="font-mono text-[10px]">P2P ID: #MS-{activeConv.id.slice(-4)}</span>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConv.messages.map((msg) => {
              const isMine = msg.senderId === user.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 shadow-md ${
                      isMine
                        ? 'bg-amber-500 text-zinc-950 font-medium'
                        : 'bg-[#151c27] text-zinc-200 border border-white/10'
                    }`}
                  >
                    {msg.isPaid && (
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1 text-amber-300 bg-black/30 px-2 py-0.5 rounded w-fit">
                        <Sparkles className="w-3 h-3" />
                        <span>Paid Direct Message (${msg.paidAmount?.toFixed(2)})</span>
                      </div>
                    )}

                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>

                  <span className="text-[10px] text-zinc-500 mt-1 px-1 font-mono">{msg.createdAt}</span>
                </div>
              );
            })}
          </div>

          {/* Media preview tag if selected */}
          {mediaPreview && (
            <div className="p-2 bg-black/60 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={mediaPreview} alt="Upload" className="w-8 h-8 rounded object-cover" />
                <span className="text-[11px] text-zinc-300 font-mono">Attachment scanned & verified (18+)</span>
              </div>
              <button
                onClick={() => setMediaPreview(null)}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Remove
              </button>
            </div>
          )}

          {/* Paid Message Toggle Bar */}
          <div className="px-3 pt-2 bg-[#0c1017] border-t border-white/10 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPaidMessage}
                onChange={(e) => setIsPaidMessage(e.target.checked)}
                className="rounded border-white/20 bg-black/50 text-amber-500"
              />
              <span className="text-zinc-300 text-[11px] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Send as Priority Tip / Paid Message
              </span>
            </label>

            {isPaidMessage && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-400 font-mono">Tip Amount:</span>
                <select
                  value={paidMessageAmount}
                  onChange={(e) => setPaidMessageAmount(e.target.value)}
                  className="bg-black/50 border border-white/15 rounded px-2 py-0.5 text-xs text-amber-400 font-mono"
                >
                  <option value="5.00">$5.00 (10% platform fee included)</option>
                  <option value="10.00">$10.00</option>
                  <option value="25.00">$25.00</option>
                  <option value="50.00">$50.00</option>
                </select>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-[#0c1017] flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateMediaUpload}
              disabled={isScanningMedia}
              title="Attach media (Automated moderation scan)"
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={
                isPaidMessage
                  ? `Type your priority paid message ($${paidMessageAmount})...`
                  : 'Write encrypted message...'
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#151c27] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() && !mediaPreview}
              className={`p-2 rounded-xl transition-all ${
                !inputMessage.trim() && !mediaPreview
                  ? 'bg-zinc-800 text-zinc-600'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/20'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 bg-[#0e131b] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-zinc-400">
          <MessageSquare className="w-12 h-12 text-zinc-600 mb-2" />
          <p className="text-sm font-semibold text-zinc-300">Select a Conversation</p>
          <p className="text-xs max-w-xs mt-1">
            Connect directly with verified creators via encrypted messages and 1-on-1 calls.
          </p>
        </div>
      )}
    </div>
  );
};
