import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../Modal';
import { Product, Brand, Category, Supplier } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  brands: Brand[];
  categories: Category[];
  suppliers: Supplier[];
}

export function ProductModal({ 
  isOpen, 
  onClose, 
  onSave,
  brands,
  categories,
  suppliers 
}: ProductModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sellingPrice || !formData.buyingPrice || !formData.stock) {
      alert(t('inventory.requiredFields'));
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(t('inventory.saveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('inventory.addProduct')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('inventory.form.name.label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('inventory.form.name.placeholder')}
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('inventory.form.description.label')}
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('inventory.form.description.placeholder')}
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('inventory.form.brand.label')}
            </label>
            <select
              value={formData.brandId || ''}
              onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{t('inventory.form.brand.placeholder')}</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('inventory.form.modelNumber.label')}
            </label>
            <input
              type="text"
              value={formData.modelNumber || ''}
              onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
              placeholder={t('inventory.form.modelNumber.placeholder')}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('inventory.form.supplier.label')}
            </label>
            <select
              value={formData.supplierId || ''}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{t('inventory.form.supplier.placeholder')}</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('inventory.form.category.label')}
            </label>
            <select
              value={formData.categoryId || ''}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{t('inventory.form.category.placeholder')}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('inventory.form.buyingPrice.label')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.buyingPrice || ''}
              onChange={(e) => setFormData({ ...formData, buyingPrice: parseFloat(e.target.value) })}
              placeholder={t('inventory.form.buyingPrice.placeholder')}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('inventory.form.sellingPrice.label')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.sellingPrice || ''}
              onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
              placeholder={t('inventory.form.sellingPrice.placeholder')}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('inventory.form.stock.label')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.stock || ''}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              placeholder={t('inventory.form.stock.placeholder')}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('modal.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}