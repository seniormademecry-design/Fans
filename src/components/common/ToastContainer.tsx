import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'warning'
            ? AlertTriangle
            : toast.type === 'error'
            ? AlertCircle
            : Info;

        const borderClass =
          toast.type === 'success'
            ? 'border-emerald-500/40 bg-[#0d1c16]/95 text-emerald-100'
            : toast.type === 'warning'
            ? 'border-amber-500/40 bg-[#1c180e]/95 text-amber-100'
            : toast.type === 'error'
            ? 'border-rose-500/40 bg-[#210e12]/95 text-rose-100'
            : 'border-blue-500/40 bg-[#0d1624]/95 text-blue-100';

        const iconColor =
          toast.type === 'success'
            ? 'text-emerald-400'
            : toast.type === 'warning'
            ? 'text-amber-400'
            : toast.type === 'error'
            ? 'text-rose-400'
            : 'text-blue-400';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-xl p-3.5 shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all transform translate-y-0 animate-in fade-in slide-in-from-top-2 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold tracking-wide uppercase">{toast.title}</h4>
              <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
