import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
  };

  const bgMap = {
    success: 'bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-emerald-900/10',
    warning: 'bg-amber-50/95 border-amber-200 text-amber-950 shadow-amber-900/10',
    info: 'bg-blue-50/95 border-blue-200 text-blue-950 shadow-blue-900/10',
    error: 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-rose-900/10',
  };

  return (
    <div role="status" className="mobile-toast fixed z-50 animate-scale-up">
      <div
        className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md transition-all ${
          bgMap[toast.type]
        }`}
      >
        {iconMap[toast.type]}
        <div className="flex-1 text-xs sm:text-sm font-bold leading-snug text-left">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
