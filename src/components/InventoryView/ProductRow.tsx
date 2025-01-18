import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Product, Brand, Category, Supplier } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface ProductRowProps {
  product: Product;
  brands: Brand[];
  suppliers: Supplier[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
}

export function ProductRow({ 
  product, 
  brands, 
  suppliers, 
  categories, 
  onEdit,
  onDelete 
}: ProductRowProps) {
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (window.confirm(t('inventory.confirmDelete'))) {
      try {
        await onDelete(product.id);
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert(t('inventory.deleteFailed'));
      }
    }
  };

  return (
    <tr className="border-b">
      <td className="py-4">{product.name}</td>
      <td className="py-4">{product.description}</td>
      <td className="py-4">{brands.find(b => b.id === product.brandId)?.name}</td>
      <td className="py-4">{product.modelNumber}</td>
      <td className="py-4">{suppliers.find(s => s.id === product.supplierId)?.name}</td>
      <td className="py-4">{categories.find(c => c.id === product.categoryId)?.name}</td>
      <td className="py-4">{formatCurrency(product.buyingPrice)}</td>
      <td className="py-4">{formatCurrency(product.sellingPrice)}</td>
      <td className="py-4">{product.stock}</td>
      <td className="py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-700"
            title={t('common.edit')}
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
            title={t('common.delete')}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}