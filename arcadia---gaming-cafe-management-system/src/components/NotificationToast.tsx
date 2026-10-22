import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useArcadia } from '../context/ArcadiaContext';

export const NotificationToast: React.FC = () => {
  const { notification, notify } = useArcadia();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-bounce-in">
      <div
        className={`p-4 rounded-lg cyber-card border shadow-lg flex items-start gap-3 ${
          isSuccess
            ? 'border-emerald-400/80 shadow-[0_0_20px_rgba(16,249,165,0.3)] text-emerald-300'
            : isError
            ? 'border-pink-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-pink-300'
            : 'border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-cyan-300'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
        {isError && <AlertCircle className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}

        <div className="flex-1 text-xs font-mono">
          <p className="font-gaming text-[11px] font-bold uppercase tracking-wider mb-0.5">
            {isSuccess ? 'System Success' : isError ? 'Integrity Alert' : 'System Notice'}
          </p>
          <p className="text-white leading-relaxed">{notification.message}</p>
        </div>

        <button
          onClick={() => notify('', 'info')}
          className="text-slate-400 hover:text-white shrink-0 ml-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
