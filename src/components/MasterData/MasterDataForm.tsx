import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, X } from 'lucide-react';
import { Brand, Category, Supplier } from '../../types';

interface MasterDataFormProps {
  type: 'categories' | 'brands' | 'suppliers';
  initialData?: Brand | Category | Supplier | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function MasterDataForm({ type, initialData, onSave, onCancel }: MasterDataFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (initialData) {
      if (type === 'suppliers') {
        const supplier = initialData as Supplier;
        setFormData({
          name: supplier.name,
          contactPerson: supplier.contact_person || '',
          email: supplier.email || '',
          phone: supplier.phone || ''
        });
      } else {
        setFormData({
          name: initialData.name,
          contactPerson: '',
          email: '',
          phone: ''
        });
      }
    }
  }, [initialData, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'suppliers') {
      onSave({
        ...formData,
        id: initialData?.id
      });
    } else {
      onSave({
        name: formData.name,
        id: initialData?.id
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.name')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        {type === 'suppliers' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('master.contactPerson')}
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('master.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('master.phone')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-green-600 hover:text-green-800"
          >
            <Save size={20} />
          </button>
        </div>
      </div>
    </form>
  );
}