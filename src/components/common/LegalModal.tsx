import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, FileText, Scale, HeartHandshake, RefreshCw } from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { showLegalModal, setShowLegalModal, legalDocType, setLegalDocType } = useApp();

  if (!showLegalModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0d1219] border border-white/15 rounded-2xl shadow-2xl p-6 text-zinc-200 my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-wide">Platform Compliance & Legal Documents</h3>
          </div>
          <button
            onClick={() => setShowLegalModal(false)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-white/10 text-xs scrollbar-none">
          <button
            onClick={() => setLegalDocType('terms')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              legalDocType === 'terms' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setLegalDocType('privacy')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              legalDocType === 'privacy' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setLegalDocType('guidelines')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              legalDocType === 'guidelines' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Community Safety & 2257
          </button>
          <button
            onClick={() => setLegalDocType('creator_agreement')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              legalDocType === 'creator_agreement' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Creator Agreement (90/10 Split)
          </button>
          <button
            onClick={() => setLegalDocType('refunds')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              legalDocType === 'refunds' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Refund Policy
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto py-4 text-xs text-zinc-300 space-y-4 pr-1 leading-relaxed">
          {legalDocType === 'terms' && (
            <>
              <h4 className="text-sm font-bold text-white">Terms of Service (18+ Platform)</h4>
              <p>
                By registering, visiting, or purchasing services on Aura, you represent and warrant that you are at least 18
                years old (or the applicable age of majority in your jurisdiction). Access to any creator content without
                mandatory age verification is strictly denied.
              </p>
              <h5 className="font-semibold text-zinc-200">1. Prohibited Conduct & Zero-Tolerance Safeguards</h5>
              <p>
                Aura maintains strict zero tolerance for any content or interactions involving minors, sexual abuse material
                (CSAM), non-consensual sharing (revenge media), sexual violence, stalking, unauthorized recording of calls, or
                doxing. Immediate account termination, forfeiture of balances, and reporting to law enforcement / NCMEC will
                occur for any breach.
              </p>
              <h5 className="font-semibold text-zinc-200">2. Platform Transactions & Fees</h5>
              <p>
                All purchases, including subscriptions, PPV media unlocks, tips, and live 1-on-1 audio/video interactions, are
                facilitated via PCI-compliant tokenized payment processors. The platform automatically assesses a transparent
                10% commission on eligible creator transactions.
              </p>
            </>
          )}

          {legalDocType === 'privacy' && (
            <>
              <h4 className="text-sm font-bold text-white">Privacy by Design Architecture</h4>
              <p>
                We do not store plain-text credit card numbers or raw biometric templates on our servers. All identity
                verification (KYC) documents are processed via end-to-end encrypted third-party trust partners (e.g., Jumio,
                Yoti) under strict zero-knowledge protocols.
              </p>
              <h5 className="font-semibold text-zinc-200">Anti-Doxing & Creator Pseudonymity</h5>
              <p>
                Creators and fans interact using protected public usernames. Real legal identities, payout routing details, and
                physical addresses are strictly isolated in segregated compliance vaults and never visible to other users.
              </p>
            </>
          )}

          {legalDocType === 'guidelines' && (
            <>
              <h4 className="text-sm font-bold text-white">Community Safety Guidelines & 18 U.S.C. 2257 Record-Keeping</h4>
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>2257 Compliance Statement</span>
                </div>
                <p className="text-emerald-200/90 text-[11px]">
                  All depiction of mature or sexually explicit material produced on Aura is compliant with Title 18 U.S.C. § 2257
                  and 28 C.F.R. Part 75. All performers and creators depicted are 18 years of age or older at the time of
                  production, with government-issued photo identification verified and archived by the designated records
                  custodian.
                </p>
              </div>
              <h5 className="font-semibold text-zinc-200">Content Protection & Anti-Piracy Notice</h5>
              <p>
                All images, videos, audio notes, and live streams on Aura are protected by cryptographic forensic watermarking.
                Downloading, screen-recording, rebroadcasting, or leaking protected media is a violation of international
                copyright laws and the DMCA. Violators will face immediate legal action and statutory damages.
              </p>
            </>
          )}

          {legalDocType === 'creator_agreement' && (
            <>
              <h4 className="text-sm font-bold text-white">Creator Agreement & Transparent 90/10 Earnings Split</h4>
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2">
                <p className="font-semibold text-amber-300">Core Financial Terms:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-black/40 p-2 rounded border border-white/5">
                    <span className="text-zinc-400 block">Creator Share:</span>
                    <span className="text-amber-400 font-bold text-sm">90% of Gross</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded border border-white/5">
                    <span className="text-zinc-400 block">Platform Commission:</span>
                    <span className="text-white font-bold text-sm">10% Platform Fee</span>
                  </div>
                </div>
              </div>
              <h5 className="font-semibold text-zinc-200">Withdrawal Rules & Minimums</h5>
              <p>
                Creators may withdraw cleared funds once their balance reaches the <strong>$50.00 minimum threshold</strong>.
                Withdrawals are subject to 24-48 hour compliance screening against chargebacks, fraud checks, and KYC recertification.
              </p>
              <h5 className="font-semibold text-zinc-200">Pricing Autonomy</h5>
              <p>
                Creators retain full autonomy to set subscription tiers, PPV pricing, per-minute voice & video call rates, and
                paid direct message unlock fees, within platform minimums and maximums.
              </p>
            </>
          )}

          {legalDocType === 'refunds' && (
            <>
              <h4 className="text-sm font-bold text-white">Refund Policy & Dispute Resolution</h4>
              <p>
                Due to the immediate digital nature of digital unlocks and real-time private call interactions, all purchases
                are considered final upon delivery.
              </p>
              <h5 className="font-semibold text-zinc-200">Eligible Refund Scenarios</h5>
              <ul className="list-disc pl-5 space-y-1">
                <li>Demonstrated technical failure of audio/video call where creator did not connect.</li>
                <li>Accidental duplicate transaction caused by payment gateway timeout.</li>
                <li>Content found to be in violation of Aura community standards and removed by moderation.</li>
              </ul>
              <p className="mt-2">
                Users may open an internal refund dispute ticket directly in the Customer Care / Safety tab.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setShowLegalModal(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
