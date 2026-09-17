import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  CreditCard,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
  ArrowRight,
  Percent,
  RefreshCw,
} from 'lucide-react';

export const WalletTab: React.FC = () => {
  const {
    user,
    transactions,
    withdrawals,
    currentCreator,
    topUpWallet,
    requestWithdrawal,
    subscribedCreatorIds,
    creators,
    unsubscribeFromCreator,
    addToast,
    setActiveTab,
    createSupportTicket,
  } = useApp();

  const [walletView, setWalletView] = useState<'user' | 'creator'>('user');
  const [topUpAmount, setTopUpAmount] = useState('50.00');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedTopUpMethod, setSelectedTopUpMethod] = useState('Instant ACH / Card (•••• 4242)');

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('200.00');
  const [withdrawDestination, setWithdrawDestination] = useState('Paxum e-Wallet (•••• 8412)');

  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  const activeSubscribedCreators = creators.filter((c) => subscribedCreatorIds.includes(c.id));

  // Platform calculations for Creator view
  const creatorGross = currentCreator.lifetimeGross;
  const platform10PctCommission = Number((creatorGross * 0.10).toFixed(2));
  const processorFeesEstimate = Number((creatorGross * 0.029).toFixed(2));
  const creatorNetLifetime = Number((creatorGross - platform10PctCommission - processorFeesEstimate).toFixed(2));

  const handleTopUp = () => {
    const amt = parseFloat(topUpAmount);
    if (!amt || amt <= 0) return;
    topUpWallet(amt, selectedTopUpMethod);
    setShowTopUpModal(false);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt < 50) {
      addToast('error', 'Minimum Payout Threshold', 'Minimum withdrawal amount is $50.00 USD.');
      return;
    }
    const success = requestWithdrawal(currentCreator.id, amt, withdrawDestination);
    if (success) {
      setShowWithdrawModal(false);
    }
  };

  const handleOpenRefund = (tx: Transaction) => {
    createSupportTicket(
      'refund',
      `Refund Dispute for Transaction #${tx.id}`,
      `I am requesting a formal compliance review/refund for ${tx.title} (Amount: $${tx.amount.toFixed(2)}, Receipt: ${tx.receiptId}).`,
      'high'
    );
    setActiveTab('support');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Wallet Role Toggle Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e131b] border border-white/10 p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Payments & Wallet Hub</h2>
            <p className="text-xs text-zinc-400">PCI-DSS Tokenized Settlement Engine</p>
          </div>
        </div>

        {/* View Switcher: User Wallet vs Creator Payout Ledger */}
        <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl text-xs">
          <button
            onClick={() => setWalletView('user')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              walletView === 'user' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            User Wallet
          </button>
          <button
            onClick={() => setWalletView('creator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              walletView === 'creator'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Creator Earnings (90/10)</span>
          </button>
        </div>
      </div>

      {walletView === 'user' ? (
        /* USER WALLET VIEW */
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#121926] to-[#0b0f17] border border-white/15 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Available Spending Balance
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    ${user.balance.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">USD</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Instant, discrete checkout for creator tiers, PPV media, and live calls.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="wallet-topup-btn"
                  onClick={() => setShowTopUpModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Top-Up Balance</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Subscriptions Shelf */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Active Creator Subscriptions ({activeSubscribedCreators.length})
              </h3>
              <span className="text-xs text-zinc-400 font-mono">Auto-renews monthly</span>
            </div>

            {activeSubscribedCreators.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center">No active creator subscriptions currently.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeSubscribedCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatar}
                        alt={creator.displayName}
                        className="w-10 h-10 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{creator.displayName}</h4>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          ${creator.subscriptionPrice.toFixed(2)}/mo
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => unsubscribeFromCreator(creator.id)}
                      className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 rounded-lg transition-colors"
                    >
                      Cancel Sub
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transaction Ledger & Receipts */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Purchases & Transaction History
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">All transactions 100% discrete</span>
            </div>

            <div className="divide-y divide-white/5 overflow-x-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        tx.type === 'wallet_deposit'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {tx.type === 'wallet_deposit' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{tx.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {tx.date} • {tx.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        tx.type === 'wallet_deposit' ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {tx.type === 'wallet_deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-zinc-500 font-mono">{tx.receiptId}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedReceiptTx(tx)}
                      className="p-1.5 text-zinc-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5"
                      title="View Official Receipt"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenRefund(tx)}
                      className="text-[10px] text-zinc-500 hover:text-amber-400 px-2 py-1 rounded hover:bg-white/5"
                    >
                      Dispute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* CREATOR EARNINGS VIEW (Transparent 10% Platform Model) */
        <div className="space-y-6">
          {/* Transparent Model Flow Banner (Prompt Mandate) */}
          <div className="bg-[#121722] border border-amber-500/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Transparent Platform Revenue Split
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                10% Fixed Fee Guarantee
              </span>
            </div>

            {/* Visual Formula Step:
                Customer Payment → Platform Commission (10%) → Applicable Fees/Adjustments → Creator Balance → Withdrawable Balance */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-zinc-400 block uppercase">1. Gross Customer</span>
                <span className="text-sm font-bold text-white mt-1 block">${creatorGross.toFixed(2)}</span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/20">
                <span className="text-[10px] text-amber-400 block uppercase">2. Platform 10%</span>
                <span className="text-sm font-bold text-amber-400 mt-1 block">-${platform10PctCommission.toFixed(2)}</span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-zinc-400 block uppercase">3. Processing</span>
                <span className="text-sm font-bold text-zinc-400 mt-1 block">-${processorFeesEstimate.toFixed(2)}</span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-zinc-400 block uppercase">4. Net Earned</span>
                <span className="text-sm font-bold text-zinc-200 mt-1 block">${creatorNetLifetime.toFixed(2)}</span>
              </div>

              <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-emerald-300 block uppercase">5. Available Now</span>
                <span className="text-sm font-extrabold text-emerald-400 mt-1 block font-mono">
                  ${currentCreator.availableBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block">Available to Withdraw</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-white font-mono">
                  ${currentCreator.availableBalance.toFixed(2)}
                </span>
                <button
                  id="creator-withdraw-btn"
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                >
                  Withdraw
                </button>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">Min. threshold: $50.00 USD</p>
            </div>

            <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block">Pending Settlement (24h)</span>
              <span className="text-2xl font-bold text-amber-400 font-mono mt-1 block">
                ${currentCreator.pendingBalance.toFixed(2)}
              </span>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">Anti-fraud escrow window</p>
            </div>

            <div className="bg-[#0e131b] border border-white/10 rounded-xl p-4">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block">Total Platform 10% Paid</span>
              <span className="text-2xl font-bold text-zinc-300 font-mono mt-1 block">
                ${platform10PctCommission.toFixed(2)}
              </span>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">Includes infrastructure & DRM</p>
            </div>
          </div>

          {/* Creator Payout History (Prompt Mandate) */}
          <div className="bg-[#0e131b] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Payout & Withdrawal Requests
              </h3>
              <span className="text-[11px] text-zinc-400 font-mono">Settles via Paxum / SEPA / ACH</span>
            </div>

            <div className="divide-y divide-white/5">
              {withdrawals.map((wdr) => (
                <div key={wdr.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">${wdr.amount.toFixed(2)} USD</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold font-mono ${
                          wdr.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : wdr.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {wdr.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                      Destination: {wdr.destination} • Req: {wdr.requestedAt}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {wdr.processedAt ? `Cleared ${wdr.processedAt}` : 'In Compliance Review'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e131b] border border-white/15 rounded-2xl p-5 text-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Top-Up Aura Wallet Balance</span>
              </h3>
              <button onClick={() => setShowTopUpModal(false)} className="text-xs text-zinc-400 hover:text-white">
                Cancel
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-zinc-300 block mb-1">Select Amount (USD)</label>
                <div className="grid grid-cols-4 gap-2">
                  {['25.00', '50.00', '100.00', '250.00'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTopUpAmount(val)}
                      className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                        topUpAmount === val
                          ? 'border-amber-400 bg-amber-500/20 text-white'
                          : 'border-white/10 bg-black/30 text-zinc-400 hover:text-white'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">Payment Method</label>
                <select
                  value={selectedTopUpMethod}
                  onChange={(e) => setSelectedTopUpMethod(e.target.value)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="Instant ACH / Card (•••• 4242)">Compliant Card (•••• 4242 - Tokenized)</option>
                  <option value="Direct Wire / SEPA Instant">Direct Bank Transfer / SEPA</option>
                  <option value="USDC / USDT Stablecoin">USDC / Crypto Discreet Payment</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold shadow-md"
              >
                Confirm Deposit +${topUpAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleWithdrawSubmit}
            className="w-full max-w-md bg-[#0e131b] border border-white/15 rounded-2xl p-5 text-zinc-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Request Payout (Available: ${currentCreator.availableBalance.toFixed(2)})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-zinc-300 block mb-1">
                  Withdrawal Amount (Min. $50.00 USD)
                </label>
                <input
                  type="number"
                  min="50"
                  max={currentCreator.availableBalance}
                  step="1"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">Verified Payout Destination</label>
                <select
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  className="w-full bg-[#131924] border border-white/15 rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="Paxum e-Wallet (•••• 8412)">Paxum e-Wallet (•••• 8412)</option>
                  <option value="Direct Wire (IBAN •••• 9102)">Direct Wire (IBAN •••• 9102)</option>
                  <option value="USDC Payout Address (0x74...b3a)">USDC (ERC-20 Compliant Vault)</option>
                </select>
              </div>

              <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/5 text-[11px] text-zinc-400 space-y-1">
                <p>• Platform 10% commission was already retained at checkout.</p>
                <p>• Net payout equals full requested amount.</p>
                <p>• Payouts undergo 24h compliance screening against chargebacks.</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
              >
                Submit Payout Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Itemized Official Receipt Modal */}
      {selectedReceiptTx && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e131b] border border-white/15 rounded-2xl p-6 text-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Aura Official Invoice Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedReceiptTx(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-4 p-4 bg-black/50 rounded-xl border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Receipt Number:</span>
                <span className="text-white font-bold">{selectedReceiptTx.receiptId}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Date/Time:</span>
                <span className="text-zinc-200">{selectedReceiptTx.date} UTC</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Method:</span>
                <span className="text-zinc-200">{selectedReceiptTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Description:</span>
                <span className="text-white font-semibold">{selectedReceiptTx.title}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span>${selectedReceiptTx.amount.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-zinc-500 text-center font-mono">
              Compliant digital goods invoice • Tax included where applicable
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => {
                  addToast('info', 'Receipt Exported', 'A copy has been saved to your local storage.');
                  setSelectedReceiptTx(null);
                }}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold"
              >
                Download PDF / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
