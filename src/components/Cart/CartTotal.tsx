import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react';
import { CartItem, Discount } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface CartTotalProps {
  items: CartItem[];
  discount?: Discount;
  onCheckout: (discount?: Discount) => Promise<void>;
}

export function CartTotal({ items, discount, onCheckout }: CartTotalProps) {
  const { t } = useTranslation();

  const subtotal = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const total = discount ? (
    discount.type === 'percentage' 
      ? subtotal * (1 - discount.value / 100)
      : subtotal - discount.value
  ) : subtotal;

  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex justify-between text-gray-600">
        <span>{t('cart.subtotal')}:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {discount && (
        <div className="flex justify-between text-sm text-red-600">
          <span>{t('cart.discount')}:</span>
          <span>
            {discount.type === 'percentage'
              ? `-${discount.value}%`
              : `-${formatCurrency(discount.value)}`}
          </span>
        </div>
      )}

      <div className="flex justify-between text-lg font-bold">
        <span>{t('cart.total')}:</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <button
        onClick={() => onCheckout(discount)}
        disabled={items.length === 0}
        className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CreditCard size={20} />
        {t('cart.processCheckout')}
      </button>
    </div>
  );
}