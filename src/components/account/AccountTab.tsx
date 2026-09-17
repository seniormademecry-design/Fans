import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  CreditCard,
  Bell,
  EyeOff,
  KeyRound,
  Trash2,
  LogOut,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  History,
  FileCheck,
} from 'lucide-react';

export const AccountTab: React.FC = () => {
  const {
    user,
    subscribedCreatorIds,
    purchasedPostIds,
    posts,
    creators,
    setViewMode,
    setCurrentRole,
    setShowAgeGate,
    setShowLegalModal,
    setLegalDocType,
    setActiveTab,
    addToast,
  } = useApp();

  const [stealthMode, setStealthMode] = useState(user.stealthMode);
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [notifications, setNotifications] = useState(user.notificationsEnabled);

  const purchasedPosts = posts.filter((p) => purchasedPostIds.includes(p.id));
  const activeSubCreators = creators.filter((c) => subscribedCreatorIds.includes(c.id));

  const handleToggle2FA = () => {
    const next = !twoFactor;
    setTwoFactor(next);
    addToast(
      next ? 'success' : 'warning',
      next ? '2FA Enabled' : '2FA Disabled',
      next
        ? 'TOTP Authenticator app requirement enforced on login.'
        : 'Two-factor protection disabled.'
    );
  };

  const handleToggleStealth = () => {
    const next = !stealthMode;
    setStealthMode(next);
    addToast(
      'info',
      next ? 'Stealth Mode Active' : 'Stealth Mode Inactive',
      next
        ? 'Your online status and purchase activity are now masked.'
        : 'Your online status is visible to mutual contacts.'
    );
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to permanently delete your account and all private records?')) {
      addToast('error', 'Account Deletion Scheduled', 'Your data will be expunged according to GDPR/CCPA privacy standards.');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Overview Header Card */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0e131b]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">{user.name}</h2>
                <span className="text-[10px] font-mono bg-white/10 text-zinc-300 px-2 py-0.5 rounded">
                  @{user.username}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">{user.email}</p>

              {/* Age Verification Status Badge */}
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>18+ Age Verified (Jumio ID)</span>
                </div>
                <button
                  onClick={() => setShowAgeGate(true)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 underline"
                >
                  Recertify
                </button>
              </div>
            </div>
          </div>

          {/* Quick Wallet balance widget */}
          <div className="bg-black/40 border border-white/10 p-3 rounded-xl flex items-center justify-between sm:flex-col sm:items-end gap-2">
            <span className="text-[11px] text-zinc-400">Wallet Balance</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">${user.balance.toFixed(2)}</span>
            <button
              onClick={() => setActiveTab('wallet')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
            >
              Manage Wallet →
            </button>
          </div>
        </div>
      </div>

      {/* Role Navigation Portal (Creator Studio & Admin Panel Access) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => {
            setCurrentRole('creator');
            setViewMode('creator_studio');
          }}
          className="bg-gradient-to-br from-[#1a140b] to-[#0e131b] border border-amber-500/30 hover:border-amber-400 rounded-2xl p-4 cursor-pointer transition-all group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-white mt-3">Creator Studio & Management</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Upload premium media, set subscription and call rates, view analytics, and request payouts.
          </p>
        </div>

        <div
          onClick={() => {
            setCurrentRole('admin');
            setViewMode('admin_panel');
          }}
          className="bg-gradient-to-br from-[#101322] to-[#0e131b] border border-indigo-500/30 hover:border-indigo-400 rounded-2xl p-4 cursor-pointer transition-all group shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-white mt-3">Platform Owner & Admin Panel</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Review 10% platform commission, KYC approvals, content moderation, reports, and audit logs.
          </p>
        </div>
      </div>

      {/* Purchased Content Vault */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>My Purchased PPV Media ({purchasedPosts.length})</span>
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">Permanent License</span>
        </div>

        {purchasedPosts.length === 0 ? (
          <p className="text-xs text-zinc-500 py-3">You have not unlocked any individual PPV sets yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {purchasedPosts.map((post) => (
              <div
                key={post.id}
                className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center gap-3"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-white truncate">{post.caption}</h4>
                  <p className="text-[11px] text-zinc-400">By {post.creatorName}</p>
                  <span className="text-[10px] text-emerald-400 font-mono">Unlocked & DRM Watermarked</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy & Security Settings */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Privacy & Security Controls</span>
        </h3>

        <div className="space-y-3 divide-y divide-white/5 text-xs">
          {/* Stealth Mode */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                <span>Stealth Privacy Mode</span>
              </h4>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Mask your online presence and hide activity feeds from public explorer.
              </p>
            </div>
            <button
              onClick={handleToggleStealth}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                stealthMode ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  stealthMode ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* 2FA Toggle */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                <span>Two-Factor Authentication (2FA)</span>
              </h4>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Requires hardware authenticator or biometric passkey for every session.
              </p>
            </div>
            <button
              onClick={handleToggle2FA}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                twoFactor ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  twoFactor ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-zinc-400" />
                <span>Push & Email Alerts</span>
              </h4>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Receive discrete transaction confirmations and creator live notifications.
              </p>
            </div>
            <button
              onClick={() => {
                setNotifications(!notifications);
                addToast('info', 'Preferences Saved', 'Notification settings updated.');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notifications ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  notifications ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Compliance & Legal Agreements Shortcut */}
      <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Legal & Compliance Documentation
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <button
            onClick={() => {
              setLegalDocType('terms');
              setShowLegalModal(true);
            }}
            className="p-2.5 bg-black/40 hover:bg-white/5 border border-white/10 rounded-xl text-left text-zinc-300 transition-colors"
          >
            Terms of Service
          </button>
          <button
            onClick={() => {
              setLegalDocType('privacy');
              setShowLegalModal(true);
            }}
            className="p-2.5 bg-black/40 hover:bg-white/5 border border-white/10 rounded-xl text-left text-zinc-300 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => {
              setLegalDocType('guidelines');
              setShowLegalModal(true);
            }}
            className="p-2.5 bg-black/40 hover:bg-white/5 border border-white/10 rounded-xl text-left text-zinc-300 transition-colors"
          >
            2257 Safe Harbor
          </button>
          <button
            onClick={() => {
              setLegalDocType('refunds');
              setShowLegalModal(true);
            }}
            className="p-2.5 bg-black/40 hover:bg-white/5 border border-white/10 rounded-xl text-left text-zinc-300 transition-colors"
          >
            Refund Policies
          </button>
        </div>
      </div>

      {/* Account Termination & Logout */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleDeleteAccount}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Account (GDPR Right to Erasure)</span>
        </button>

        <button
          onClick={() => {
            addToast('info', 'Logged Out', 'Session cleared securely.');
          }}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
