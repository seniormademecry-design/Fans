import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatorProfile, ContentItem } from '../../types';
import { WatermarkedMedia } from '../common/WatermarkedMedia';
import {
  Search,
  CheckCircle,
  Phone,
  Video,
  MessageSquare,
  Sparkles,
  Heart,
  Lock,
  Eye,
  Star,
  Flag,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
  UserCheck,
} from 'lucide-react';

export const DiscoverTab: React.FC = () => {
  const {
    creators,
    posts,
    selectedCreatorId,
    setSelectedCreatorId,
    subscribedCreatorIds,
    purchasedPostIds,
    subscribeToCreator,
    purchaseContent,
    toggleLikePost,
    startCall,
    setActiveConversationId,
    setActiveTab,
    submitReport,
    user,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterOnlineOnly, setFilterOnlineOnly] = useState(false);
  const [reportModalCreator, setReportModalCreator] = useState<CreatorProfile | null>(null);
  const [reportReason, setReportReason] = useState<'harassment' | 'fraud' | 'prohibited_material' | 'underage_suspected' | 'copyright'>('harassment');
  const [reportText, setReportText] = useState('');

  const categories = ['All', 'Glamour', 'Art & Boudoir', 'Fitness', 'Cosplay', 'ASMR & Audio', '1-on-1 Calls'];

  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      const matchesSearch =
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.bio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || c.categories.some((cat) => cat.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchesOnline = !filterOnlineOnly || c.isOnline;
      return matchesSearch && matchesCategory && matchesOnline;
    });
  }, [creators, searchQuery, selectedCategory, filterOnlineOnly]);

  const activeCreator = creators.find((c) => c.id === selectedCreatorId);
  const activeCreatorPosts = activeCreator ? posts.filter((p) => p.creatorId === activeCreator.id) : [];

  const handleStartMessage = (creator: CreatorProfile) => {
    setActiveConversationId(`conv_${creator.username.split('_')[0]}`);
    setActiveTab('messages');
  };

  const handleSendReport = () => {
    if (!reportModalCreator) return;
    submitReport(reportModalCreator.id, 'creator', reportModalCreator.displayName, reportReason, reportText || 'User report submitted from profile.');
    setReportModalCreator(null);
    setReportText('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Search & Category Header */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="creator-search-input"
            type="text"
            placeholder="Search verified creators, categories, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111622] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'bg-[#111622] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setFilterOnlineOnly(!filterOnlineOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
              filterOnlineOnly
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#111622] text-zinc-400 border border-white/5 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Online Only</span>
          </button>
        </div>
      </div>

      {/* Featured Creator Spotlight Banner (if in main list) */}
      {!selectedCreatorId && filteredCreators.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-r from-zinc-950 via-[#121824] to-zinc-950 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={filteredCreators[0].avatar}
                  alt={filteredCreators[0].displayName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121824]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Featured Creator
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">18+ 2257 Verified</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 flex items-center gap-1.5">
                  {filteredCreators[0].displayName}
                  <CheckCircle className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                </h3>
                <p className="text-xs text-zinc-300 max-w-md line-clamp-1 mt-0.5">
                  {filteredCreators[0].bio}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
              <button
                onClick={() => setSelectedCreatorId(filteredCreators[0].id)}
                className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10"
              >
                <span>View Private Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Detail Profile View */}
      {activeCreator ? (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedCreatorId(null)}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to all creators</span>
          </button>

          {/* Profile Hero Card */}
          <div className="bg-[#0f141e] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            {/* Banner */}
            <div className="h-36 sm:h-48 w-full relative">
              <img
                src={activeCreator.banner}
                alt="Banner"
                className="w-full h-full object-cover filter brightness-75"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f141e] via-transparent to-transparent" />
            </div>

            {/* Profile Info Container */}
            <div className="px-5 pb-5 -mt-12 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-end gap-3.5">
                  <div className="relative">
                    <img
                      src={activeCreator.avatar}
                      alt={activeCreator.displayName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/20 shadow-2xl bg-black"
                      referrerPolicy="no-referrer"
                    />
                    {activeCreator.isOnline && (
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" />
                    )}
                  </div>

                  <div className="mb-1">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-lg font-bold text-white tracking-tight">{activeCreator.displayName}</h2>
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">@{activeCreator.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {activeCreator.stats.rating} ({activeCreator.stats.ratingCount} reviews)
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {activeCreator.stats.subscribersCount.toLocaleString()} Subscribers
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Interaction Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartMessage(activeCreator)}
                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors border border-white/10"
                    title="Send Private Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => startCall(activeCreator.id, 'voice')}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-semibold"
                    title={`Voice Call ($${activeCreator.voiceCallRatePerMin.toFixed(2)}/min)`}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>${activeCreator.voiceCallRatePerMin.toFixed(2)}/m</span>
                  </button>

                  <button
                    onClick={() => startCall(activeCreator.id, 'video')}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-semibold"
                    title={`Video Call ($${activeCreator.videoCallRatePerMin.toFixed(2)}/min)`}
                  >
                    <Video className="w-3.5 h-3.5 text-rose-400" />
                    <span>${activeCreator.videoCallRatePerMin.toFixed(2)}/m</span>
                  </button>

                  <button
                    onClick={() => setReportModalCreator(activeCreator)}
                    className="p-2.5 text-zinc-500 hover:text-zinc-300 rounded-xl hover:bg-white/5 transition-colors"
                    title="Report or Block"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bio & Categories */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">{activeCreator.bio}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeCreator.categories.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-zinc-300 rounded-md text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subscription Tier Banner */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Full Access Subscription Tier
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Unlock All Subscriber Posts & Feeds
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Includes direct messaging priority, daily feed drops, and discounted live interaction rates.
                  </p>
                </div>

                {subscribedCreatorIds.includes(activeCreator.id) ? (
                  <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-semibold">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Subscribed & Active</span>
                  </div>
                ) : (
                  <button
                    id={`subscribe-creator-btn-${activeCreator.id}`}
                    onClick={() => subscribeToCreator(activeCreator.id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Subscribe for ${activeCreator.subscriptionPrice.toFixed(2)} / month</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Private Content Feed / Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Private Content Vault ({activeCreatorPosts.length})
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">Protected by Aura DRM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeCreatorPosts.map((post) => {
                const isSubscribed = subscribedCreatorIds.includes(post.creatorId);
                const isPurchased = purchasedPostIds.includes(post.id);
                const isAccessible = !post.isPPV ? isSubscribed : isPurchased;

                return (
                  <div
                    key={post.id}
                    className="bg-[#0f141e] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      {/* Watermarked Media Viewer */}
                      <WatermarkedMedia
                        src={post.mediaUrl}
                        alt={post.caption}
                        mediaType={post.mediaType}
                        isLocked={!isAccessible}
                        blurPreview={post.previewUrl}
                        price={post.price}
                        onUnlock={() => {
                          if (post.isPPV) {
                            purchaseContent(post.id);
                          } else {
                            subscribeToCreator(post.creatorId);
                          }
                        }}
                      />

                      {/* Post Caption & Tags */}
                      <div className="p-3.5 space-y-2">
                        <p className="text-xs text-zinc-200 leading-relaxed">{post.caption}</p>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((t) => (
                            <span key={t} className="text-[10px] text-zinc-400 font-mono">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action strip */}
                    <div className="px-3.5 pb-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLikePost(post.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            post.isLiked ? 'text-rose-500' : 'hover:text-zinc-200'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                          <span className="text-[11px]">{post.likesCount}</span>
                        </button>
                        <span className="text-[11px] text-zinc-500">{post.createdAt}</span>
                      </div>

                      <div>
                        {post.isPPV ? (
                          isPurchased ? (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Unlocked PPV
                            </span>
                          ) : (
                            <button
                              onClick={() => purchaseContent(post.id)}
                              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Unlock ${post.price.toFixed(2)}</span>
                            </button>
                          )
                        ) : isSubscribed ? (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Subscriber Set
                          </span>
                        ) : (
                          <button
                            onClick={() => subscribeToCreator(post.creatorId)}
                            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Subscribe to view</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Creators Marketplace Directory Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Verified 18+ Creators ({filteredCreators.length})
            </h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              100% Identity Verified (2257)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCreators.map((creator) => {
              const isSubscribed = subscribedCreatorIds.includes(creator.id);

              return (
                <div
                  key={creator.id}
                  id={`creator-card-${creator.id}`}
                  className="bg-[#0e131b] border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/30 transition-all flex flex-col justify-between group"
                >
                  {/* Top banner / cover */}
                  <div className="h-28 w-full relative">
                    <img
                      src={creator.banner}
                      alt="Banner"
                      className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e131b] via-black/30 to-transparent" />

                    {/* Online status indicator badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-300 border border-white/10">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          creator.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                        }`}
                      />
                      <span>{creator.isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="px-4 pb-4 -mt-10 relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Avatar & Identifiers */}
                      <div className="flex items-end justify-between">
                        <div className="relative">
                          <img
                            src={creator.avatar}
                            alt={creator.displayName}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-white/15 shadow-xl bg-black"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block font-mono">Monthly Tier</span>
                          <span className="text-sm font-bold text-white font-mono">
                            ${creator.subscriptionPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Name & Bio */}
                      <div className="mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white tracking-wide">{creator.displayName}</h4>
                          <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <p className="text-[11px] text-zinc-400 font-mono">@{creator.username}</p>

                        <p className="text-xs text-zinc-300 mt-2 line-clamp-2 leading-relaxed">
                          {creator.bio}
                        </p>
                      </div>

                      {/* Categories Chips */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {creator.categories.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-400 rounded text-[10px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Matrix & Actions */}
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                      {/* Interaction Rates Pill */}
                      <div className="grid grid-cols-3 gap-1 bg-black/40 p-1.5 rounded-lg text-center text-[10px] font-mono border border-white/5">
                        <div>
                          <span className="text-zinc-500 block">Voice Call</span>
                          <span className="text-emerald-400 font-semibold">${creator.voiceCallRatePerMin.toFixed(2)}/m</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Video Call</span>
                          <span className="text-rose-400 font-semibold">${creator.videoCallRatePerMin.toFixed(2)}/m</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">PPV From</span>
                          <span className="text-amber-400 font-semibold">${creator.ppvStartingPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCreatorId(creator.id)}
                          className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10"
                        >
                          View Profile
                        </button>

                        {isSubscribed ? (
                          <button
                            onClick={() => setSelectedCreatorId(creator.id)}
                            className="flex-1 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Subscribed</span>
                          </button>
                        ) : (
                          <button
                            id={`quick-subscribe-btn-${creator.id}`}
                            onClick={() => subscribeToCreator(creator.id)}
                            className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-semibold hover:opacity-95 shadow-md shadow-amber-500/10 transition-opacity"
                          >
                            Subscribe
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Creator Report Modal */}
      {reportModalCreator && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e131b] border border-white/15 rounded-2xl p-5 text-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Report Creator @{reportModalCreator.username}</span>
              </h3>
              <button
                onClick={() => setReportModalCreator(null)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Select Violation Category</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as any)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="harassment">Harassment / Abusive Behavior</option>
                  <option value="fraud">Fraud / Financial Scam</option>
                  <option value="prohibited_material">Prohibited Content (Emergency Escalation)</option>
                  <option value="underage_suspected">Suspected Underage (Immediate Lockdown)</option>
                  <option value="copyright">Copyright Infringement / Piracy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Details & Evidence</label>
                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Provide context for our 24/7 Trust & Safety team..."
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-lg text-[11px] text-red-300">
                Safety reports involving minors or non-consensual material bypass queue and trigger emergency isolation.
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setReportModalCreator(null)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400"
              >
                Dismiss
              </button>
              <button
                onClick={handleSendReport}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Submit Incident Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
