import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Brand, Category, Supplier } from '../types';
import { masterDataService } from '../services/masterDataService';
import { MasterDataForm } from './MasterData/MasterDataForm';
import { MasterDataList } from './MasterData/MasterDataList';

interface MasterDataViewProps {
  type: 'categories' | 'brands' | 'suppliers';
}

export function MasterDataView({ type }: MasterDataViewProps) {
  const { t } = useTranslation();
  const [items, setItems] = React.useState<(Brand | Category | Supplier)[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<Brand | Category | Supplier | null>(null);

  React.useEffect(() => {
    loadData();
  }, [type]);

  async function loadData() {
    try {
      setLoading(true);
      let data;
      switch (type) {
        case 'categories':
          data = await masterDataService.getCategories();
          break;
        case 'brands':
          data = await masterDataService.getBrands();
          break;
        case 'suppliers':
          data = await masterDataService.getSuppliers();
          break;
      }
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(formData: any) {
    try {
      if (editingItem) {
        switch (type) {
          case 'categories':
            await masterDataService.updateCategory(formData);
            break;
          case 'brands':
            await masterDataService.updateBrand(formData);
            break;
          case 'suppliers':
            await masterDataService.updateSupplier(formData);
            break;
        }
      } else {
        switch (type) {
          case 'categories':
            await masterDataService.addCategory(formData.name);
            break;
          case 'brands':
            await masterDataService.addBrand(formData.name);
            break;
          case 'suppliers':
            await masterDataService.addSupplier(formData);
            break;
        }
      }
      await loadData();
      setIsAdding(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('common.confirmDelete'))) return;
    
    try {
      switch (type) {
        case 'categories':
          await masterDataService.deleteCategory(id);
          break;
        case 'brands':
          await masterDataService.deleteBrand(id);
          break;
        case 'suppliers':
          await masterDataService.deleteSupplier(id);
          break;
      }
      await loadData();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center">
        <h2 className="text-2xl font-bold mb-2">{t('common.error')}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t(`master.${type}`)}</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          disabled={isAdding || editingItem !== null}
        >
          <Plus size={20} />
          {t('common.add')}
        </button>
      </div>

      {(isAdding || editingItem) && (
        <MasterDataForm
          type={type}
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setIsAdding(false);
            setEditingItem(null);
          }}
        />
      )}

      <MasterDataList
        type={type}
        items={items}
        onEdit={(item) => setEditingItem(item)}
        onDelete={handleDelete}
      />
    </div>
  );
}