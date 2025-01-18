import React from 'react';
import { ProductCard } from './ProductCard';
import { SearchBar } from './SearchBar';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  selectedCategory: string | null;
}

export function ProductGrid({ products, onAddToCart, selectedCategory }: ProductGridProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredProducts = products
    .filter(product => 
      (selectedCategory ? product.categoryId === selectedCategory : true) &&
      (searchQuery ? 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.modelNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      : true)
    );

  return (
    <div className="space-y-4">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t('inventory.searchProducts')}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            {t('inventory.noProductsFound')}
          </div>
        )}
      </div>
    </div>
  );
}