import React from 'react';
import { useTranslation } from 'react-i18next';

export function CartHeader() {
  const { t } = useTranslation();
  
  return (
    <h2 className="text-xl font-bold mb-4">{t('cart.title')}</h2>
  );
}