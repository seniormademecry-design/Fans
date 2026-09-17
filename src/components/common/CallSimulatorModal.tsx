import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Shield, Wallet, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CallSimulatorModal: React.FC = () => {
  const { activeCall, endCall, callReceipt, setCallReceipt, user } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live timer tick
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'active') return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        activeCall.durationSeconds = next;
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall]);

  // Reset elapsed on new call
  useEffect(() => {
    if (activeCall) {
      setElapsedSeconds(0);
    }
  }, [activeCall?.id]);

  // Completed Call Receipt Modal
  if (callReceipt) {
    const durationMins = Math.max(1, Math.ceil(callReceipt.durationSeconds / 60));
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0e131b] border border-white/15 rounded-2xl shadow-2xl p-6 text-zinc-200">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Call Completed & Settled</h3>
              <p className="text-xs text-zinc-400">Transparent billing receipt generated</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Creator:</span>
              <span className="font-semibold text-white">{callReceipt.creatorName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Interaction Type:</span>
              <span className="capitalize font-semibold text-amber-400">{callReceipt.type} Call</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Rate:</span>
              <span className="font-mono text-zinc-200">${callReceipt.ratePerMin.toFixed(2)} / min</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Duration:</span>
              <span className="font-mono text-zinc-200">
                {Math.floor(callReceipt.durationSeconds / 60)}m {callReceipt.durationSeconds % 60}s ({durationMins} billed min)
              </span>
            </div>
          </div>

          {/* Breakdown with 10% platform commission */}
          <div className="mt-4 p-3.5 bg-zinc-900/70 border border-white/10 rounded-xl space-y-2 text-xs font-mono">
            <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-sans">
              Financial Breakdown
            </p>
            <div className="flex justify-between text-zinc-200">
              <span>Customer Payment Billed:</span>
              <span className="font-bold text-white">${callReceipt.totalCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span className="flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Platform Commission (10%):
              </span>
              <span>-${callReceipt.platformFee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between text-emerald-400 font-bold text-sm">
              <span>Creator Earnings (Net):</span>
              <span>+${callReceipt.creatorEarnings.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => setCallReceipt(null)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-semibold rounded-xl text-xs transition-opacity"
            >
              Done & Close Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeCall) return null;

  const currentMinutesBilled = Math.max(1, Math.ceil(elapsedSeconds / 60));
  const runningCost = Number((currentMinutesBilled * activeCall.ratePerMin).toFixed(2));
  const remainingEstimatedBalance = Math.max(0, user.balance - runningCost);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 select-none">
      {/* Top Bar: Creator Info & Live Stats */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <img
            src={activeCall.creatorAvatar}
            alt={activeCall.creatorName}
            className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              {activeCall.creatorName}
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h4>
            <p className="text-[11px] text-zinc-400 capitalize">{activeCall.type} Session • Encrypted P2P</p>
          </div>
        </div>

        {/* Live Call Duration */}
        <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-mono text-amber-400 shadow-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col items-center justify-center my-4 relative">
        {activeCall.type === 'video' ? (
          <div className="w-full h-full max-h-[440px] rounded-2xl overflow-hidden border border-white/15 relative bg-zinc-950 flex items-center justify-center">
            {/* Simulated Live Video Feed */}
            {!isVideoOff ? (
              <img
                src={activeCall.creatorAvatar}
                alt="Creator Feed"
                className="w-full h-full object-cover scale-105 filter contrast-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center text-zinc-500">
                <VideoOff className="w-12 h-12 mb-2" />
                <p className="text-xs">Camera is paused</p>
              </div>
            )}

            {/* Self User Video Pip */}
            <div className="absolute top-3 right-3 w-24 h-32 rounded-xl overflow-hidden border border-white/20 shadow-xl bg-zinc-900 flex items-center justify-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 px-1 rounded text-zinc-300">You</span>
            </div>

            {/* Floating Live Watermark to deter screen recording */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-zinc-300 font-mono border border-white/10 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>RECORDING PREVENTED • AURA GUARD</span>
            </div>
          </div>
        ) : (
          /* Voice Call Stage with soundwave pulses */
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-400 shadow-2xl relative z-10">
                <img
                  src={activeCall.creatorAvatar}
                  alt={activeCall.creatorName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full border border-amber-400/40 animate-ping" />
              <div className="absolute -inset-4 rounded-full border border-rose-500/20 animate-pulse" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{activeCall.creatorName}</h3>
              <p className="text-xs text-amber-400 font-medium mt-1">High-Fidelity Audio Connected</p>
            </div>

            {/* Waveform visualization simulation */}
            <div className="flex items-center gap-1 h-8">
              {[40, 75, 50, 90, 60, 100, 45, 80, 55, 70, 95, 30].map((height, i) => (
                <span
                  key={i}
                  style={{ height: `${height}%` }}
                  className="w-1 bg-gradient-to-t from-amber-500 to-rose-500 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Live Billing Ticker (Required by prompt) */}
        <div className="w-full mt-3 bg-zinc-900/80 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Rate:</span>
            <span className="font-semibold text-white font-mono">${activeCall.ratePerMin.toFixed(2)}/min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Current Cost:</span>
            <span className="font-bold text-amber-400 font-mono">${runningCost.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Wallet className="w-3.5 h-3.5" />
            <span className="font-mono font-medium">${remainingEstimatedBalance.toFixed(2)} left</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="max-w-md w-full mx-auto flex items-center justify-center gap-5 pb-6">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isMuted ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {activeCall.type === 'video' && (
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        )}

        <button
          id="hangup-call-btn"
          onClick={endCall}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
