import React from 'react';
import { Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PrintButtonProps {
  onClick: () => void;
  className?: string;
}

export function PrintButton({ onClick, className = '' }: PrintButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ${className}`}
      title={t('orders.actions.print')}
    >
      <Printer size={20} />
      <span>{t('orders.actions.print')}</span>
    </button>
  );
}