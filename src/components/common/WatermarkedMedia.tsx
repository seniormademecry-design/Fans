import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock } from 'lucide-react';

interface WatermarkedMediaProps {
  src: string;
  alt: string;
  mediaType?: 'image' | 'video' | 'gallery';
  isLocked?: boolean;
  blurPreview?: string;
  price?: number;
  onUnlock?: () => void;
  className?: string;
}

export const WatermarkedMedia: React.FC<WatermarkedMediaProps> = ({
  src,
  alt,
  mediaType = 'image',
  isLocked = false,
  blurPreview,
  price,
  onUnlock,
  className = '',
}) => {
  const { user } = useApp();
  const watermarkText = `AURA • PRIVATELY LICENSED TO @${user.username} (ID: ${user.id}) • DO NOT REDISTRIBUTE`;

  return (
    <div
      className={`relative select-none overflow-hidden bg-black/60 rounded-xl group ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* If locked PPV media */}
      {isLocked ? (
        <div className="relative aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
          {/* Blurred Teaser Image */}
          <img
            src={blurPreview || src}
            alt={alt}
            className="w-full h-full object-cover filter blur-2xl scale-110 opacity-40 pointer-events-none"
            draggable={false}
            referrerPolicy="no-referrer"
          />

          {/* Locked Overlay Box */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-wide">Premium Protected Media</h4>
            <p className="text-xs text-zinc-300 mt-1 max-w-xs">
              This private set is encrypted. Unlock to view full-resolution uncensored media.
            </p>

            {price !== undefined && onUnlock && (
              <button
                type="button"
                onClick={onUnlock}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-bold hover:opacity-90 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <span>Unlock Set for ${price.toFixed(2)}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Unlocked Watermarked Media */
        <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-zinc-950">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
            referrerPolicy="no-referrer"
          />

          {/* Transparent click shield overlay to prevent browser right-click save or dragging */}
          <div
            className="absolute inset-0 z-10 cursor-default"
            onContextMenu={(e) => {
              e.preventDefault();
              return false;
            }}
          />

          {/* Visible Anti-Piracy Watermarking Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 select-none">
            {/* Top Watermark tag */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300 px-2 py-0.5 rounded-md font-mono tracking-wider">
                <Shield className="w-2.5 h-2.5 text-amber-400" />
                DRM PROTECTED
              </span>
              <span className="text-[10px] text-white/40 font-mono tracking-wider uppercase">
                {new Date().toISOString().split('T')[0]}
              </span>
            </div>

            {/* Diagonal repeating watermark overlay (subtle, non-destructive yet clearly identifying user) */}
            <div className="absolute inset-0 flex items-center justify-center -rotate-12 pointer-events-none opacity-20 hover:opacity-30 transition-opacity">
              <p className="text-[13px] font-bold text-white tracking-widest font-mono text-center px-4 drop-shadow-md">
                {watermarkText}
              </p>
            </div>

            {/* Bottom identifier */}
            <div className="flex justify-end">
              <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-zinc-400 font-mono">
                Aura Protected #{user.id.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
