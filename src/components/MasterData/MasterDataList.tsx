import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2 } from 'lucide-react';
import { Brand, Category, Supplier } from '../../types';

interface MasterDataListProps {
  type: 'categories' | 'brands' | 'suppliers';
  items: (Brand | Category | Supplier)[];
  onEdit: (item: Brand | Category | Supplier) => void;
  onDelete: (id: string) => void;
}

export function MasterDataList({ type, items, onEdit, onDelete }: MasterDataListProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-4">{t('common.name')}</th>
            {type === 'suppliers' && (
              <>
                <th className="text-left py-4">{t('master.contactPerson')}</th>
                <th className="text-left py-4">{t('master.email')}</th>
                <th className="text-left py-4">{t('master.phone')}</th>
              </>
            )}
            <th className="text-left py-4">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-4">{item.name}</td>
              {type === 'suppliers' && (
                <>
                  <td className="py-4">{(item as Supplier).contact_person}</td>
                  <td className="py-4">{(item as Supplier).email}</td>
                  <td className="py-4">{(item as Supplier).phone}</td>
                </>
              )}
              <td className="py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-700"
                    title={t('common.edit')}
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                    title={t('common.delete')}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}