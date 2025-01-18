import React from 'react';
import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'cancelled';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation();

  const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
  const statusClasses = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]} ${className}`}>
      {t(`status.${status}`)}
    </span>
  );
}