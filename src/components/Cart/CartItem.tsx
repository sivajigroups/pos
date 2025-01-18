import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function CartItemComponent({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-600">
          {formatCurrency(item.sellingPrice)} {t('cart.priceEach')}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            +
          </button>
        </div>
        
        <button
          onClick={() => onRemoveItem(item.id)}
          className="text-red-500 hover:text-red-700"
          title={t('cart.remove')}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}