import React from 'react';
import { CategoryView } from '../components/MasterData/CategoryView';
import { BrandView } from '../components/MasterData/BrandView';
import { SupplierView } from '../components/MasterData/SupplierView';
import { View } from '../types';

interface MasterDataViewProps {
  type: Extract<View, 'categories' | 'brands' | 'suppliers'>;
}

export function MasterDataView({ type }: MasterDataViewProps) {
  switch (type) {
    case 'categories':
      return <CategoryView />;
    case 'brands':
      return <BrandView />;
    case 'suppliers':
      return <SupplierView />;
    default:
      return null;
  }
}