import React from 'react';
import { InventoryView as InventoryComponent } from '../components/InventoryView';
import { useProducts } from '../hooks/useProducts';
import { useTranslation } from 'react-i18next';

export function InventoryView() {
  const { t } = useTranslation();
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

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
    <InventoryComponent
      products={products}
      onUpdateProduct={updateProduct}
      onAddProduct={addProduct}
      onDeleteProduct={deleteProduct}
    />
  );
}