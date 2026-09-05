import React from 'react';

export type StatusType =
  | 'URGENT'
  | 'HIGH'
  | 'HIGH RISK'
  | 'MODERATE'
  | 'NORMAL'
  | 'Checked In'
  | 'In Progress'
  | 'Scheduled'
  | 'Pending'
  | 'Completed'
  | 'Consulted'
  | 'Follow-up Due'
  | 'Waiting'
  | 'Available'
  | 'Limited'
  | 'Unavailable'
  | 'Active'
  | 'Due Today'
  | 'Overdue';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const norm = status.toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (norm === 'URGENT' || norm === 'OVERDUE' || norm === 'UNAVAILABLE' || norm.includes('HIGH')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
  } else if (norm === 'WAITING' || norm === 'PENDING' || norm === 'LIMITED' || norm === 'MODERATE' || norm === 'DUE TODAY') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
  } else if (norm === 'SCHEDULED' || norm === 'IN PROGRESS') {
    colorClasses = 'bg-sky-50 text-sky-700 border-sky-200 font-medium';
  } else if (norm === 'COMPLETED' || norm === 'CONSULTED' || norm === 'CHECKED IN' || norm === 'AVAILABLE' || norm === 'ACTIVE' || norm === 'NORMAL') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium';
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5'
      : size === 'lg'
      ? 'text-xs px-3.5 py-1.5 font-bold tracking-wide'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${colorClasses} ${sizeClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          norm.includes('URGENT') || norm.includes('HIGH') || norm === 'OVERDUE'
            ? 'bg-rose-600 animate-pulse'
            : norm.includes('WAITING') || norm.includes('PENDING') || norm.includes('LIMITED')
            ? 'bg-amber-500'
            : norm.includes('SCHEDULED') || norm.includes('IN PROGRESS')
            ? 'bg-sky-500'
            : 'bg-emerald-600'
        }`}
      />
      {status}
    </span>
  );
};
