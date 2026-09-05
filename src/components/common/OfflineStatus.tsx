import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OfflineStatusProps {
  compact?: boolean;
}

export const OfflineStatus: React.FC<OfflineStatusProps> = ({ compact = false }) => {
  const { isOffline, toggleOffline, offlineQueueCount, language } = useApp();

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleOffline}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
          isOffline
            ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse'
            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
        }`}
        title="Click to toggle offline simulation"
      >
        {isOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span>Offline ({offlineQueueCount} queued)</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Connected</span>
          </>
        )}
      </button>
    );
  }

  if (isOffline) {
    return (
      <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-3.5 text-left flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-amber-950 flex items-center gap-2">
              <span>🟠 Offline Mode Active</span>
              <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {offlineQueueCount} records waiting to sync
              </span>
            </div>
            <p className="text-amber-900/80 text-[11px] mt-0.5">
              Essential field workflows (registration, triage, follow-up) remain available offline.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleOffline}
          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors shadow-2xs"
        >
          Restore Online
        </button>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-2.5 text-left flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
        <span className="font-bold text-emerald-950">🟢 Connected</span>
        <span className="text-slate-400">•</span>
        <span className="text-emerald-800 text-[11px]">District Cloud Live Sync Active</span>
      </div>

      <button
        type="button"
        onClick={toggleOffline}
        className="text-[11px] font-bold text-emerald-900 hover:underline"
      >
        Simulate Offline
      </button>
    </div>
  );
};
