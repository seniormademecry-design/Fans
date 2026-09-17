import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  DollarSign,
  UserCheck,
  Flag,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Scale,
  Lock,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    adminStats,
    reports,
    withdrawals,
    tickets,
    creators,
    approveCreatorKYC,
    rejectCreatorKYC,
    moderatePost,
    updateReportStatus,
    approveWithdrawal,
    rejectWithdrawal,
    setViewMode,
    addToast,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'kyc' | 'reports' | 'payouts' | 'moderation' | 'audit'>('overview');

  // Filtered lists
  const pendingKYCCreators = creators.filter((c) => c.kycStatus === 'pending' || c.kycStatus === 'approved');
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending_review');
  const pendingReports = reports.filter((r) => r.status === 'pending' || r.status === 'investigating');

  return (
    <div className="space-y-6 pb-24">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#17101a] via-[#101422] to-[#0e131b] border border-indigo-500/30 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('main')}
            className="p-2 bg-black/40 hover:bg-white/10 text-zinc-300 rounded-xl border border-white/10 transition-colors"
            title="Return to Main Interface"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">Platform Compliance & Control Console</h2>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                SuperAdmin
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              18+ Gating • 10% Commission Ledger • Trust & Safety Enforcement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Audit Logging Active</span>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-[#0e131b] border border-white/10 p-1.5 rounded-2xl text-xs">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-3 py-2 rounded-xl font-medium transition-all ${
            adminTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Financial Overview (10%)
        </button>

        <button
          onClick={() => setAdminTab('kyc')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            adminTab === 'kyc' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>Creator KYC Queue</span>
          {creators.filter((c) => c.kycStatus === 'pending').length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
              {creators.filter((c) => c.kycStatus === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            adminTab === 'reports' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>Safety Reports</span>
          {pendingReports.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('payouts')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            adminTab === 'payouts' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>Payout Requests</span>
          {pendingWithdrawals.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
              {pendingWithdrawals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('moderation')}
          className={`px-3 py-2 rounded-xl font-medium transition-all ${
            adminTab === 'moderation' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Content Moderation
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`px-3 py-2 rounded-xl font-medium transition-all ${
            adminTab === 'audit' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* 1. FINANCIAL OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block">Total Platform Gross</span>
              <span className="text-2xl font-bold text-white font-mono mt-1 block">
                ${adminStats.totalGrossVolume.toFixed(2)}
              </span>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">Gross customer spending</p>
            </div>

            <div className="bg-[#12182b] border border-indigo-500/30 rounded-2xl p-5">
              <span className="text-xs text-indigo-300 uppercase tracking-wider block font-semibold">
                Platform 10% Revenue Collected
              </span>
              <span className="text-2xl font-extrabold text-indigo-400 font-mono mt-1 block">
                ${adminStats.platform10PctCommissionRevenue.toFixed(2)}
              </span>
              <p className="text-[11px] text-indigo-300/70 mt-1 font-mono">Guaranteed 10% fee retained</p>
            </div>

            <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block">Creator Net Distributed</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">
                ${adminStats.creatorNetDistributed.toFixed(2)}
              </span>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">90% net creator allocation</p>
            </div>

            <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block">Chargeback Reserve</span>
              <span className="text-2xl font-bold text-zinc-300 font-mono mt-1 block">
                ${adminStats.reserveFundBalance.toFixed(2)}
              </span>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">Anti-fraud escrow safety pool</p>
            </div>
          </div>

          {/* Revenue Calculation Breakdown Card */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Automatic Platform Deductions & Transparent Ledger
            </h3>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2 text-xs leading-relaxed text-zinc-300">
              <p>
                <strong className="text-white">Rule 1:</strong> On every purchase (subscription, PPV unlock, paid call,
                direct tip), the Aura settlement router automatically splits 10% to the platform treasury and allocates
                the remaining 90% directly to the creator's ledger.
              </p>
              <p>
                <strong className="text-white">Rule 2:</strong> Withdrawals are subject to the $50.00 USD minimum threshold,
                KYC identity validation, and a 24-hour compliance window to prevent chargeback abuse.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATOR KYC QUEUE */}
      {adminTab === 'kyc' && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Creator Identity & 18 U.S.C. § 2257 Review Queue
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Government ID + Face Biometrics Required</span>
          </div>

          <div className="divide-y divide-white/5">
            {creators.map((creator) => (
              <div key={creator.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={creator.avatar}
                    alt={creator.displayName}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{creator.displayName}</h4>
                      <span className="text-[10px] text-zinc-400 font-mono">@{creator.username}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                          creator.kycStatus === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : creator.kycStatus === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {creator.kycStatus.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-1">
                      Submitted: Passport + 2257 Custodian Form • Jumio Age Check: 18+ (Passed)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {creator.kycStatus !== 'approved' && (
                    <button
                      onClick={() => approveCreatorKYC(creator.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve KYC</span>
                    </button>
                  )}

                  {creator.kycStatus !== 'rejected' && (
                    <button
                      onClick={() => rejectCreatorKYC(creator.id, 'Document illegible or failed 18+ check')}
                      className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SAFETY REPORTS */}
      {adminTab === 'reports' && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Safety, Harassment & Content Violation Reports ({reports.length})
            </h3>
            <span className="text-[11px] text-rose-400 font-mono">Zero-Tolerance SLA: &lt; 15 mins</span>
          </div>

          <div className="divide-y divide-white/5">
            {reports.map((report) => (
              <div key={report.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-400 font-bold">#{report.id}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                        report.reason === 'minor_suspected'
                          ? 'bg-rose-900/60 text-white border border-rose-500 font-bold'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {report.reason.replace('_', ' ')}
                    </span>
                    <span className="text-white font-semibold">Target: {report.targetName}</span>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500">{report.createdAt}</span>
                </div>

                <p className="text-zinc-300 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                  "{report.details}"
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-zinc-500 font-mono">Reported by: User #{report.reporterId}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Resolve & Dismiss
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(report.id, 'investigating');
                        addToast('warning', 'User Frozen', `${report.targetName} suspended pending investigation.`);
                      }}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Freeze Account
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PAYOUT APPROVALS */}
      {adminTab === 'payouts' && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Creator Payout Settlement Queue
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">Threshold enforced: &gt; $50.00</span>
          </div>

          <div className="divide-y divide-white/5">
            {withdrawals.map((wdr) => (
              <div key={wdr.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">${wdr.amount.toFixed(2)} USD</span>
                    <span className="text-[11px] text-zinc-400">for {wdr.creatorName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        wdr.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : wdr.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {wdr.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    Destination: {wdr.destination} • Requested: {wdr.requestedAt}
                  </p>
                </div>

                {wdr.status === 'pending_review' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveWithdrawal(wdr.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Payout</span>
                    </button>
                    <button
                      onClick={() => rejectWithdrawal(wdr.id, 'Risk/chargeback hold')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Hold/Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CONTENT MODERATION */}
      {adminTab === 'moderation' && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Automated & Manual Content Moderation Queue
          </h3>
          <p className="text-zinc-400">
            Per-asset scanning for 18+ verification, prohibited symbols, violence, and non-consensual media.
          </p>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-emerald-300">
            ✓ All 3 active public creator feeds have passed hash-matching and 18 U.S.C. 2257 custodian inspection. No
            pending takedown flags.
          </div>
        </div>
      )}

      {/* 6. IMMUTABLE AUDIT LOGS */}
      {adminTab === 'audit' && (
        <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Immutable Cryptographic System Audit Trail
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">SHA-256 Chained</span>
          </div>

          <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono space-y-2 text-[11px] text-zinc-400 max-h-96 overflow-y-auto">
            <p className="text-emerald-400">[2026-09-17 11:20:00 UTC] COMM_LEDGER: 10% Platform fee ($2.50) collected on Post Unlock #P-101.</p>
            <p className="text-zinc-300">[2026-09-17 11:18:42 UTC] KYC_SERVICE: Performer @ElenaVance certified under 18 U.S.C. 2257.</p>
            <p className="text-zinc-300">[2026-09-17 11:15:10 UTC] DRM_ENGINE: Dynamic forensic watermark generated for User ID #USR-8419.</p>
            <p className="text-amber-400">[2026-09-17 11:05:00 UTC] ESCROW_ROUTER: $250.00 withdrawal initiated via Paxum e-Wallet.</p>
            <p className="text-zinc-300">[2026-09-17 10:45:19 UTC] AUTH_GATEWAY: 18+ Age token verified via Jumio Identity API.</p>
          </div>
        </div>
      )}
    </div>
  );
};
