import React from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

interface InvoicePrintProps {
  transaction: Transaction;
  businessInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    gst?: string;
  };
}

export function InvoicePrint({ 
  transaction,
  businessInfo = {
    name: 'Sivaji Groups',
    address: 'Sayakara St, Anna Nagar, Ramanathapuram, Tamil Nadu 623504',
    phone: '093453 46187',
    email: 'sivaji@gmail.com',
    gst: '33AABCS1429B1Z1'
  }
}: InvoicePrintProps) {
  const { t } = useTranslation();

  return (
    <div className="w-[4in] min-h-[6in] bg-white p-4 text-sm" style={{ fontFamily: 'monospace' }}>
      {/* Header */}
      <div className="text-center mb-4 border-b pb-4">
        <h1 className="text-xl font-bold">{businessInfo.name}</h1>
        <p className="text-xs">{businessInfo.address}</p>
        <p className="text-xs">
          {t('invoice.phone')}: {businessInfo.phone}
        </p>
        {businessInfo.gst && (
          <p className="text-xs">{t('invoice.gst')}: {businessInfo.gst}</p>
        )}
      </div>

      {/* Invoice Details */}
      <div className="mb-4 text-xs">
        <div className="flex justify-between">
          <span>{t('invoice.invoiceNo')}: #{transaction.id.slice(0, 8)}</span>
          <span>{formatDate(transaction.timestamp)}</span>
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1">{t('invoice.item')}</th>
            <th className="text-right py-1">{t('invoice.qty')}</th>
            <th className="text-right py-1">{t('invoice.price')}</th>
            <th className="text-right py-1">{t('invoice.total')}</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-1">{item.name}</td>
              <td className="text-right py-1">{item.quantity}</td>
              <td className="text-right py-1">{formatCurrency(item.sellingPrice)}</td>
              <td className="text-right py-1">
                {formatCurrency(item.sellingPrice * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t pt-2 text-xs">
        <div className="flex justify-between">
          <span>{t('invoice.subtotal')}:</span>
          <span>{formatCurrency(transaction.subtotalAmount)}</span>
        </div>
        
        {transaction.discountValue && (
          <div className="flex justify-between text-xs">
            <span>{t('invoice.discount')} 
              {transaction.discountType === 'percentage' 
                ? ` (${transaction.discountValue}%)` 
                : ''}:
            </span>
            <span>-{formatCurrency(
              transaction.discountType === 'percentage'
                ? (transaction.subtotalAmount * transaction.discountValue) / 100
                : transaction.discountValue
            )}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold mt-2 text-sm">
          <span>{t('invoice.total')}:</span>
          <span>{formatCurrency(transaction.totalAmount)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs">
        <p>{t('invoice.thankYou')}</p>
        <p className="mt-2">{t('invoice.poweredBy')} Sivaji Groups</p>
      </div>
    </div>
  );
}