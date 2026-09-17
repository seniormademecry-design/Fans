import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Wallet, CreditCard, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { checkoutDetails, closeCheckout, processCheckout, user } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<string>('Aura Wallet Balance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!checkoutDetails) return null;

  const { title, type, price, creatorName } = checkoutDetails;

  // Breakdown calculations
  const platformCommission = Number((price * 0.10).toFixed(2)); // Exactly 10% platform commission
  const processingFee = Number((price * 0.029 + 0.30).toFixed(2)); // Standard card processor fee
  const netCreatorEarnings = Number((price - platformCommission - processingFee).toFixed(2));

  const hasSufficientWallet = user.balance >= price;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      processCheckout(selectedMethod);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0e131b] border border-white/15 rounded-2xl shadow-2xl p-6 text-zinc-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Confirm Payment</h3>
              <p className="text-[11px] text-zinc-400">Compliant 18+ Transaction</p>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary */}
        <div className="mt-4 p-3 bg-black/40 border border-white/10 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                {type === 'subscription' ? 'Monthly Tier' : type === 'ppv_content' ? 'PPV Unlock' : 'Direct Interaction'}
              </span>
              <h4 className="text-sm font-semibold text-white mt-0.5">{title}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Creator: {creatorName}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Total Due</span>
              <span className="text-lg font-bold text-white font-mono">${price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Transparent Earnings Breakdown (Prompt Requirement) */}
        <div className="mt-4 p-3.5 bg-zinc-900/60 border border-white/10 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Transparent 10% Commission Split
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-medium">Compliance Model</span>
          </div>

          {/* Step flow diagram */}
          <div className="bg-black/50 p-2.5 rounded-lg border border-white/5 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-zinc-200">
              <span>1. Customer Payment:</span>
              <span className="font-semibold text-white">${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span className="flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Platform Commission (10%):
              </span>
              <span>-${platformCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Processor Fee (2.9% + $0.30):
              </span>
              <span>-${processingFee.toFixed(2)}</span>
            </div>
            <div className="pt-1.5 border-t border-white/10 flex justify-between text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Creator Net Earnings:
              </span>
              <span>+${netCreatorEarnings.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 italic">
            90% of platform net proceeds are credited directly to {creatorName}'s available balance.
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
            Select Payment Method
          </label>

          <button
            type="button"
            onClick={() => setSelectedMethod('Aura Wallet Balance')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              selectedMethod === 'Aura Wallet Balance'
                ? 'border-amber-400 bg-amber-500/10 text-white'
                : 'border-white/10 bg-black/30 text-zinc-300 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Aura Wallet Balance</p>
                <p className="text-[11px] text-zinc-400">Current Balance: ${user.balance.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              {hasSufficientWallet ? (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  Ready
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                  Low Balance
                </span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('Compliant Card (•••• 4242)')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              selectedMethod === 'Compliant Card (•••• 4242)'
                ? 'border-amber-400 bg-amber-500/10 text-white'
                : 'border-white/10 bg-black/30 text-zinc-300 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Compliant Card (•••• 4242)</p>
                <p className="text-[11px] text-zinc-400">Tokenized PCI-DSS Tier 1 Vault</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-medium text-zinc-400">Instant</span>
            </div>
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Encrypted with 256-bit TLS. Billed discretely as "AURAVLT-PAY".</span>
        </div>

        {/* Confirm Button */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={closeCheckout}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            id="modal-confirm-pay-btn"
            type="button"
            disabled={isSubmitting || (selectedMethod === 'Aura Wallet Balance' && !hasSufficientWallet)}
            onClick={handleConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isSubmitting || (selectedMethod === 'Aura Wallet Balance' && !hasSufficientWallet)
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-95 shadow-lg shadow-amber-500/20'
            }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Authorizing Token...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Pay ${price.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
