import React, { useState } from 'react';
import { Trash2, CreditCard, Percent, IndianRupee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CartItem, Discount } from '../types';
import { formatCurrency } from '../utils/currency';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: (discount?: Discount) => Promise<void>;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const { t } = useTranslation();
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [showDiscount, setShowDiscount] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.sellingPrice || 0) * item.quantity, 0);
  const discount = discountValue ? {
    type: discountType,
    value: parseFloat(discountValue)
  } : undefined;

  const total = discount ? (
    discountType === 'percentage' 
      ? subtotal * (1 - parseFloat(discountValue) / 100)
      : subtotal - parseFloat(discountValue)
  ) : subtotal;

  const handleCheckout = async () => {
    if (window.confirm(t('cart.confirmCheckout'))) {
      await onCheckout(discount);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">{t('cart.title')}</h2>
      
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('cart.empty')}</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.sellingPrice || 0)} {t('pos.price')}
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
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t pt-4 mt-4 space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>{t('cart.subtotal')}:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div>
          <button
            onClick={() => setShowDiscount(!showDiscount)}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
          >
            {showDiscount ? t('cart.hideDiscount') : t('cart.addDiscount')}
          </button>

          {showDiscount && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setDiscountType('percentage')}
                  className={`flex items-center gap-1 px-3 py-1 rounded ${
                    discountType === 'percentage' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <Percent size={16} />
                  {t('cart.percentage')}
                </button>
                <button
                  onClick={() => setDiscountType('fixed')}
                  className={`flex items-center gap-1 px-3 py-1 rounded ${
                    discountType === 'fixed' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <IndianRupee size={16} />
                  {t('cart.fixed')}
                </button>
              </div>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'percentage' ? '0-100' : '0.00'}
                className="border rounded px-3 py-1 w-full"
                min="0"
                max={discountType === 'percentage' ? "100" : undefined}
                step={discountType === 'percentage' ? "1" : "0.01"}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between text-lg font-bold">
          <span>{t('cart.total')}:</span>
          <span>{formatCurrency(total)}</span>
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard size={20} />
          {t('cart.processCheckout')}
        </button>
      </div>
    </div>
  );
}