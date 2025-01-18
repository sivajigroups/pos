import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem, Discount } from '../../types';
import { CartHeader } from './CartHeader';
import { CartItemComponent } from './CartItem';
import { CartTotal } from './CartTotal';
import { DiscountSection } from './DiscountSection';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: (discount?: Discount) => Promise<void>;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const { t } = useTranslation();
  const [showDiscount, setShowDiscount] = useState(false);
  const [discount, setDiscount] = useState<Discount>();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <CartHeader />
      
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('cart.empty')}</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        )}
      </div>

      <DiscountSection
        show={showDiscount}
        discount={discount}
        onToggle={() => setShowDiscount(!showDiscount)}
        onChange={setDiscount}
      />
      
      <CartTotal
        items={items}
        discount={discount}
        onCheckout={onCheckout}
      />
    </div>
  );
}