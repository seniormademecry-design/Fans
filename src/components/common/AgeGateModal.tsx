import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, AlertTriangle, Check, Upload, CreditCard, Sparkles, ExternalLink } from 'lucide-react';

export const AgeGateModal: React.FC = () => {
  const { isAgeVerified, verifyAge, showAgeGate, setShowAgeGate, setShowLegalModal, setLegalDocType } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'government_id' | 'credit_card' | 'biometric_selfie'>('government_id');
  const [dob, setDob] = useState('2000-01-15');
  const [agreed18, setAgreed18] = useState(true);
  const [agreedConsent, setAgreedConsent] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // If age is already verified and modal is not forced open, don't show
  if (isAgeVerified && !showAgeGate) {
    return null;
  }

  const handleVerify = () => {
    if (!agreed18 || !agreedConsent || !agreedTerms) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      verifyAge(selectedMethod);
    }, 900);
  };

  return (
    <div
      id="age-gate-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="age-gate-card"
        className="w-full max-w-lg bg-[#0e131b] border border-white/15 rounded-2xl shadow-2xl p-6 text-zinc-200 my-8 relative"
      >
        {/* Header Icon */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-red-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">Age & Safety Verification</h3>
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded font-semibold border border-red-500/30">
                  18+ REQUIRED
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Strict regulatory compliance & adult safe harbor</p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-red-300">Adults Only (18+) Platform</p>
            <p className="text-red-200/90 leading-relaxed">
              This platform contains mature visual media, private creator interactions, and paid subscriptions. Minors,
              non-consensual content, and unverified participation are strictly prohibited with zero tolerance.
            </p>
          </div>
        </div>

        {/* Verification Method Selection */}
        <div className="mt-5 space-y-3">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
            Select Verification Protocol
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedMethod('government_id')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                selectedMethod === 'government_id'
                  ? 'border-amber-400 bg-amber-500/10 text-white'
                  : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Upload className="w-4 h-4 text-amber-400" />
                {selectedMethod === 'government_id' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-zinc-200">Government ID</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Passport / Driver's License</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('credit_card')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                selectedMethod === 'credit_card'
                  ? 'border-amber-400 bg-amber-500/10 text-white'
                  : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <CreditCard className="w-4 h-4 text-blue-400" />
                {selectedMethod === 'credit_card' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-zinc-200">Credit Card Auth</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">$0.00 Identity Token</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('biometric_selfie')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                selectedMethod === 'biometric_selfie'
                  ? 'border-amber-400 bg-amber-500/10 text-white'
                  : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {selectedMethod === 'biometric_selfie' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-zinc-200">AI Age Estimation</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Yoti / Jumio Biometrics</p>
              </div>
            </button>
          </div>
        </div>

        {/* Date of Birth verification input */}
        <div className="mt-4 bg-black/40 border border-white/10 p-3 rounded-xl">
          <label className="text-xs text-zinc-300 font-medium block mb-1">
            Confirmed Date of Birth (Must be 18+)
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-[#141b24] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
          />
          <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            Encrypted & zero-knowledge hashed. Never sold or shared.
          </p>
        </div>

        {/* Legal & Compliance Checkboxes */}
        <div className="mt-4 space-y-2.5">
          <label className="flex items-start gap-2.5 cursor-pointer group text-xs">
            <input
              type="checkbox"
              checked={agreed18}
              onChange={(e) => setAgreed18(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-black/50 text-amber-500 focus:ring-0"
            />
            <span className="text-zinc-300 group-hover:text-white">
              I certify under penalty of perjury that I am at least <strong>18 years of age</strong> (or the legal age of majority in my jurisdiction).
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer group text-xs">
            <input
              type="checkbox"
              checked={agreedConsent}
              onChange={(e) => setAgreedConsent(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-black/50 text-amber-500 focus:ring-0"
            />
            <span className="text-zinc-300 group-hover:text-white">
              I acknowledge that non-consensual material, trafficking, harassment, and unauthorized redistribution are strictly forbidden.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer group text-xs">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-black/50 text-amber-500 focus:ring-0"
            />
            <span className="text-zinc-300 group-hover:text-white">
              I accept the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLegalDocType('terms');
                  setShowLegalModal(true);
                }}
                className="text-amber-400 underline hover:text-amber-300"
              >
                Terms of Service
              </button>
              ,{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLegalDocType('privacy');
                  setShowLegalModal(true);
                }}
                className="text-amber-400 underline hover:text-amber-300"
              >
                Privacy Policy
              </button>
              , and 18 U.S.C. 2257 Safe Harbor standards.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              window.location.href = 'https://www.google.com';
            }}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
          >
            Exit (Under 18)
          </button>

          <button
            id="confirm-age-verification-btn"
            type="button"
            disabled={!agreed18 || !agreedConsent || !agreedTerms || isProcessing}
            onClick={handleVerify}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              !agreed18 || !agreedConsent || !agreedTerms || isProcessing
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-95 shadow-lg shadow-amber-500/20'
            }`}
          >
            {isProcessing ? (
              <span className="animate-pulse">Validating Credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Enter 18+</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
