import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Upload,
  DollarSign,
  Phone,
  Video,
  MessageSquare,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Lock,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const CreatorStudio: React.FC = () => {
  const {
    currentCreator,
    posts,
    createPost,
    updateCreatorPricing,
    submitCreatorKYC,
    withdrawals,
    requestWithdrawal,
    setViewMode,
    addToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'content' | 'pricing' | 'earnings' | 'analytics' | 'kyc'>('content');

  // New post form state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [isPPV, setIsPPV] = useState(false);
  const [price, setPrice] = useState('15.00');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'gallery'>('image');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');

  // Pricing form state
  const [subPrice, setSubPrice] = useState(currentCreator.subscriptionPrice.toString());
  const [voiceRate, setVoiceRate] = useState(currentCreator.voiceCallRatePerMin.toString());
  const [videoRate, setVideoRate] = useState(currentCreator.videoCallRatePerMin.toString());
  const [messageRate, setMessageRate] = useState(currentCreator.paidMessageRate.toString());

  // Withdrawal form state
  const [withdrawAmt, setWithdrawAmt] = useState('250.00');
  const [withdrawDest, setWithdrawDest] = useState('Paxum e-Wallet (•••• 8412)');

  const creatorPosts = posts.filter((p) => p.creatorId === currentCreator.id);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    createPost({
      creatorId: currentCreator.id,
      creatorName: currentCreator.displayName,
      creatorUsername: currentCreator.username,
      creatorAvatar: currentCreator.avatar,
      caption,
      mediaType,
      mediaUrl,
      previewUrl: mediaUrl,
      isPPV,
      price: isPPV ? parseFloat(price) || 10 : 0,
      tags: ['Exclusive', 'PrivateSet'],
    });

    setCaption('');
    setShowUploadModal(false);
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreatorPricing(currentCreator.id, {
      subscriptionPrice: parseFloat(subPrice) || currentCreator.subscriptionPrice,
      voiceCallRatePerMin: parseFloat(voiceRate) || currentCreator.voiceCallRatePerMin,
      videoCallRatePerMin: parseFloat(videoRate) || currentCreator.videoCallRatePerMin,
      paidMessageRate: parseFloat(messageRate) || currentCreator.paidMessageRate,
    });
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmt);
    if (!amt || amt < 50) {
      addToast('error', 'Minimum Withdrawal Threshold', 'Minimum withdrawal amount is $50.00 USD.');
      return;
    }
    requestWithdrawal(currentCreator.id, amt, withdrawDest);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#17120a] via-[#121620] to-[#0e131b] border border-amber-500/30 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('main')}
            className="p-2 bg-black/40 hover:bg-white/10 text-zinc-300 rounded-xl border border-white/10 transition-colors"
            title="Return to Public Feed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <img
            src={currentCreator.avatar}
            alt={currentCreator.displayName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            referrerPolicy="no-referrer"
          />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">{currentCreator.displayName}</h2>
              <span className="text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                Verified Creator Studio
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              @{currentCreator.username} • 18+ 2257 Compliant Performer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="studio-upload-btn"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Content</span>
          </button>
        </div>
      </div>

      {/* Studio Navigation Subtabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-[#0e131b] border border-white/10 p-1.5 rounded-2xl text-xs">
        <button
          onClick={() => setActiveSubTab('content')}
          className={`px-3 py-2 rounded-xl font-medium transition-all ${
            activeSubTab === 'content' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Content Vault ({creatorPosts.length})
        </button>

        <button
          onClick={() => setActiveSubTab('pricing')}
          className={`px-3 py-2 rounded-xl font-medium transition-all ${
            activeSubTab === 'pricing' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Rates & Pricing
        </button>

        <button
          onClick={() => setActiveSubTab('earnings')}
          className={`px-3 py-2 rounded-xl font-medium transition-all ${
            activeSubTab === 'earnings' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Earnings & Payouts (90/10)
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-3 py-2 rounded-xl font-medium transition-all ${
            activeSubTab === 'analytics' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Audience & Analytics
        </button>

        <button
          onClick={() => setActiveSubTab('kyc')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            activeSubTab === 'kyc' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>KYC & 2257 Records</span>
        </button>
      </div>

      {/* SUBTAB 1: CONTENT VAULT */}
      {activeSubTab === 'content' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Published Media Sets
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Forensic watermark auto-applied</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {creatorPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#0e131b] border border-white/10 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-zinc-950">
                    <img
                      src={post.mediaUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300">
                      {post.isPPV ? `$${post.price.toFixed(2)} PPV` : 'Subscriber Only'}
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-xs text-zinc-200 line-clamp-2">{post.caption}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500 font-mono">
                      <span>{post.likesCount} Likes</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Live & Protected
                  </span>
                  <span className="text-zinc-500 font-mono">{post.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PRICING MANAGEMENT */}
      {activeSubTab === 'pricing' && (
        <form onSubmit={handleSavePricing} className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Interaction & Subscription Rates</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Set custom rates for subscriber access and 1-on-1 private real-time calls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-1.5">
              <label className="text-zinc-300 font-semibold block">Monthly Subscription Tier ($/mo)</label>
              <input
                type="number"
                step="0.01"
                value={subPrice}
                onChange={(e) => setSubPrice(e.target.value)}
                className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-zinc-500">Billed to fans monthly. Platform retains 10% commission.</p>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-1.5">
              <label className="text-zinc-300 font-semibold block">Priority Direct Message ($)</label>
              <input
                type="number"
                step="0.01"
                value={messageRate}
                onChange={(e) => setMessageRate(e.target.value)}
                className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-zinc-500">Unlocks direct paid inbox messages from non-subscribers.</p>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-1.5">
              <label className="text-zinc-300 font-semibold block flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>1-on-1 Voice Call ($/min)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={voiceRate}
                onChange={(e) => setVoiceRate(e.target.value)}
                className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-zinc-500">Billed per active minute with live running tally.</p>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-1.5">
              <label className="text-zinc-300 font-semibold block flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>1-on-1 Video Call ($/min)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={videoRate}
                onChange={(e) => setVideoRate(e.target.value)}
                className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-zinc-500">Billed per minute during encrypted live two-way session.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95"
            >
              Save New Pricing
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 3: EARNINGS & PAYOUTS */}
      {activeSubTab === 'earnings' && (
        <div className="space-y-5">
          {/* Earnings Overview */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Financial Breakdown (10% Transparent Commission)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-400 text-[10px] block">Lifetime Gross</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  ${currentCreator.lifetimeGross.toFixed(2)}
                </span>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-amber-400 text-[10px] block">Platform 10% Fee</span>
                <span className="text-lg font-bold text-amber-400 mt-0.5 block">
                  -${(currentCreator.lifetimeGross * 0.1).toFixed(2)}
                </span>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-400 text-[10px] block">Pending Escrow</span>
                <span className="text-lg font-bold text-zinc-300 mt-0.5 block">
                  ${currentCreator.pendingBalance.toFixed(2)}
                </span>
              </div>

              <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-300 text-[10px] block">Withdrawable Balance</span>
                <span className="text-lg font-extrabold text-emerald-400 mt-0.5 block">
                  ${currentCreator.availableBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Withdrawal Request Form */}
          <form
            onSubmit={handleWithdrawSubmit}
            className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4 text-xs"
          >
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Request Creator Payout
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Amount ($ USD - Min $50.00)</label>
                <input
                  type="number"
                  min="50"
                  max={currentCreator.availableBalance}
                  step="1"
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(e.target.value)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Payment Method / Destination</label>
                <select
                  value={withdrawDest}
                  onChange={(e) => setWithdrawDest(e.target.value)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white"
                >
                  <option value="Paxum e-Wallet (•••• 8412)">Paxum e-Wallet (•••• 8412)</option>
                  <option value="Direct Wire (IBAN •••• 9102)">Direct Wire (IBAN •••• 9102)</option>
                  <option value="USDC Payout Vault">USDC Stablecoin Vault</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md transition-colors"
              >
                Submit Withdrawal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 4: AUDIENCE & ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
              <span className="text-zinc-400 block font-mono">Active Subscribers</span>
              <span className="text-2xl font-bold text-white mt-1 block font-mono">
                {currentCreator.stats.subscribersCount.toLocaleString()}
              </span>
              <span className="text-emerald-400 text-[11px] font-mono mt-1 block">+12% this month</span>
            </div>

            <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
              <span className="text-zinc-400 block font-mono">Profile Views (30 Days)</span>
              <span className="text-2xl font-bold text-white mt-1 block font-mono">48,290</span>
              <span className="text-amber-400 text-[11px] font-mono mt-1 block">4.8% conversion rate</span>
            </div>

            <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
              <span className="text-zinc-400 block font-mono">Paid Call Minutes</span>
              <span className="text-2xl font-bold text-white mt-1 block font-mono">1,420 min</span>
              <span className="text-emerald-400 text-[11px] font-mono mt-1 block">Avg. rating 4.96/5.0</span>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: KYC & 2257 RECORDS */}
      {activeSubTab === 'kyc' && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white">18+ Identity Verification & 18 U.S.C. 2257 Records</h3>
              <p className="text-zinc-400 mt-0.5 text-xs">Compliance mandate for all adult content creators.</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold font-mono">
              STATUS: CERTIFIED
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1">
              <h4 className="font-semibold text-white">Government Photo Identification</h4>
              <p className="text-[11px] text-zinc-400">
                Passport / National ID card verified via encrypted Jumio trust network.
              </p>
              <span className="text-emerald-400 text-[10px] font-mono block">Archived: ID-PASS-9841 • Expiry: 2030</span>
            </div>

            <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1">
              <h4 className="font-semibold text-white">Custody of Records (18 U.S.C. § 2257)</h4>
              <p className="text-[11px] text-zinc-400">
                All records required by 18 U.S.C. 2257 are maintained by the records custodian at Aura Compliance Vaults,
                LLC.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="w-full max-w-md bg-[#0e131b] border border-white/15 rounded-2xl p-5 text-zinc-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Permitted Adult Content</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Post Caption</label>
                <textarea
                  rows={3}
                  placeholder="Describe this private set or shoot..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">Media Type</label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as any)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-white"
                >
                  <option value="image">Single 4K Photo Set</option>
                  <option value="gallery">Multi-Photo Gallery Bundle</option>
                  <option value="video">Private Video Reel</option>
                </select>
              </div>

              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPPV}
                    onChange={(e) => setIsPPV(e.target.checked)}
                    className="rounded border-white/20 bg-black/50 text-amber-500"
                  />
                  <span className="text-white font-semibold">Pay-Per-View (PPV) Content</span>
                </label>

                {isPPV && (
                  <div>
                    <label className="text-zinc-400 block text-[11px] mb-1">PPV Unlock Price ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#131924] border border-white/15 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-amber-950/30 border border-amber-500/20 rounded-lg text-[11px] text-amber-300">
                • Content will be automatically stamped with dynamic anti-piracy watermarks.
                <br />• Minors, non-consensual sharing, and extreme material are strictly forbidden.
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold shadow-md"
              >
                Publish Media
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
