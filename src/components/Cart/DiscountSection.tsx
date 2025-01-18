import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Percent, IndianRupee } from 'lucide-react';
import { Discount } from '../../types';

interface DiscountSectionProps {
  show: boolean;
  discount?: Discount;
  onToggle: () => void;
  onChange: (discount?: Discount) => void;
}

export function DiscountSection({ show, discount, onToggle, onChange }: DiscountSectionProps) {
  const { t } = useTranslation();
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');

  const handleTypeChange = (type: 'percentage' | 'fixed') => {
    setDiscountType(type);
    if (discountValue) {
      onChange({ type, value: parseFloat(discountValue) });
    }
  };

  const handleValueChange = (value: string) => {
    setDiscountValue(value);
    if (value) {
      onChange({ type: discountType, value: parseFloat(value) });
    } else {
      onChange(undefined);
    }
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
      >
        {show ? t('cart.hideDiscount') : t('cart.addDiscount')}
      </button>

      {show && (
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleTypeChange('percentage')}
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
              onClick={() => handleTypeChange('fixed')}
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
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={discountType === 'percentage' ? '0-100' : '0.00'}
            className="border rounded px-3 py-1 w-full"
            min="0"
            max={discountType === 'percentage' ? "100" : undefined}
            step={discountType === 'percentage' ? "1" : "0.01"}
          />
        </div>
      )}
    </div>
  );
}