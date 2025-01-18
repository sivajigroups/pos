import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save, X } from 'lucide-react';
import { Product, Brand, Category, Supplier } from '../../types';

interface ProductFormProps {
  formData: Partial<Product>;
  setFormData: (data: Partial<Product>) => void;
  brands: Brand[];
  categories: Category[];
  suppliers: Supplier[];
  onSave: () => void;
  onCancel: () => void;
}

export function ProductForm({
  formData,
  setFormData,
  brands,
  categories,
  suppliers,
  onSave,
  onCancel
}: ProductFormProps) {
  const { t } = useTranslation();

  return (
    <tr className="border-b">
      <td className="py-4">
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border rounded px-2 py-1 w-full"
          placeholder={t('inventory.productName')}
        />
      </td>
      <td className="py-4">
        <input
          type="text"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border rounded px-2 py-1 w-full"
          placeholder={t('inventory.productDescription')}
        />
      </td>
      <td className="py-4">
        <select
          value={formData.brandId || ''}
          onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">{t('inventory.selectBrand')}</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
      </td>
      <td className="py-4">
        <input
          type="text"
          value={formData.modelNumber || ''}
          onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
          className="border rounded px-2 py-1 w-full"
          placeholder={t('inventory.modelNumber')}
        />
      </td>
      <td className="py-4">
        <select
          value={formData.supplierId || ''}
          onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">{t('inventory.selectSupplier')}</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
      </td>
      <td className="py-4">
        <select
          value={formData.categoryId || ''}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">{t('inventory.selectCategory')}</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </td>
      <td className="py-4">
        <input
          type="number"
          value={formData.buyingPrice || ''}
          onChange={(e) => setFormData({ ...formData, buyingPrice: parseFloat(e.target.value) })}
          className="border rounded px-2 py-1 w-full"
          step="0.01"
          min="0"
        />
      </td>
      <td className="py-4">
        <input
          type="number"
          value={formData.sellingPrice || ''}
          onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
          className="border rounded px-2 py-1 w-full"
          step="0.01"
          min="0"
        />
      </td>
      <td className="py-4">
        <input
          type="number"
          value={formData.stock || ''}
          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
          className="border rounded px-2 py-1 w-full"
          min="0"
        />
      </td>
      <td className="py-4">
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="text-green-600 hover:text-green-700"
            title={t('common.save')}
          >
            <Save size={20} />
          </button>
          <button
            onClick={onCancel}
            className="text-red-600 hover:text-red-700"
            title={t('common.cancel')}
          >
            <X size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}