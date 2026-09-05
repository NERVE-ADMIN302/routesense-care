import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
  };

  const bgMap = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    warning: 'bg-amber-50 border-amber-200 text-amber-950',
    info: 'bg-sky-50 border-sky-200 text-sky-950',
    error: 'bg-rose-50 border-rose-200 text-rose-950',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-bounce-short">
      <div
        className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 transition-all ${
          bgMap[toast.type]
        }`}
      >
        {iconMap[toast.type]}
        <div className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
