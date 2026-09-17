import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Wallet, Sparkles, User, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    viewMode,
    setViewMode,
    user,
    setShowAgeGate,
    setShowLegalModal,
    setLegalDocType,
    setActiveTab,
  } = useApp();

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-[#0c1017]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & 18+ Badge */}
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => {
              setViewMode('main');
              setActiveTab('discover');
            }}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center font-bold text-white tracking-widest text-sm shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="font-semibold text-lg tracking-wider text-white">AURA</span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
            18+
          </span>

          <button
            onClick={() => {
              setLegalDocType('guidelines');
              setShowLegalModal(true);
            }}
            title="Safety & Compliance"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 border border-white/10 px-2 py-0.5 rounded-full hover:bg-white/5 transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>2257 Verified</span>
          </button>
        </div>

        {/* Center: Role Switcher for seamless previewing of User, Creator Studio, and Platform Admin */}
        <div className="flex items-center bg-black/40 border border-white/10 p-0.5 rounded-lg text-xs">
          <button
            id="role-btn-user"
            onClick={() => {
              setCurrentRole('user');
              setViewMode('main');
            }}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              currentRole === 'user' && viewMode === 'main'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3 h-3" />
            <span className="hidden xs:inline">User</span>
          </button>

          <button
            id="role-btn-creator"
            onClick={() => {
              setCurrentRole('creator');
              setViewMode('creator_studio');
            }}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              viewMode === 'creator_studio'
                ? 'bg-gradient-to-r from-amber-600/90 to-amber-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Creator Studio</span>
          </button>

          <button
            id="role-btn-admin"
            onClick={() => {
              setCurrentRole('admin');
              setViewMode('admin_panel');
            }}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              viewMode === 'admin_panel'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">Admin</span>
            <span className="sm:hidden">10%</span>
          </button>
        </div>

        {/* Right side: Wallet & Age Status */}
        <div className="flex items-center gap-2">
          {/* User Wallet Balance */}
          <button
            id="header-wallet-btn"
            onClick={() => {
              setViewMode('main');
              setActiveTab('wallet');
            }}
            className="flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>${user.balance.toFixed(2)}</span>
          </button>

          {/* Age status toggle for testing */}
          <button
            onClick={() => setShowAgeGate(true)}
            title="Age verification check"
            className="hidden md:flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 border border-white/10 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Age Verified</span>
          </button>
        </div>
      </div>
    </header>
  );
};
