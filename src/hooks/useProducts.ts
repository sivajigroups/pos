import { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { productService } from '../services/productService';
import { masterDataService } from '../services/masterDataService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts().catch(err => {
          console.error('Error fetching products:', err);
          throw new Error('Failed to load products. Please try again later.');
        }),
        masterDataService.getCategories().catch(err => {
          console.error('Error fetching categories:', err);
          throw new Error('Failed to load categories. Please try again later.');
        })
      ]);
      
      const transformedProducts = productsData.map(product => ({
        ...product,
        categoryId: product.category_id,
        brandId: product.brand_id,
        supplierId: product.supplier_id,
        modelNumber: product.model_number,
        buyingPrice: parseFloat(product.buying_price),
        sellingPrice: parseFloat(product.selling_price),
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at)
      }));

      setProducts(transformedProducts);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newProduct = await productService.addProduct(product);
      const transformedProduct = {
        ...newProduct,
        categoryId: newProduct.category_id,
        brandId: newProduct.brand_id,
        supplierId: newProduct.supplier_id,
        modelNumber: newProduct.model_number,
        buyingPrice: parseFloat(newProduct.buying_price),
        sellingPrice: parseFloat(newProduct.selling_price),
        createdAt: new Date(newProduct.created_at),
        updatedAt: new Date(newProduct.updated_at)
      };
      setProducts(prev => [...prev, transformedProduct]);
      return transformedProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  }

  async function updateProduct(product: Product) {
    try {
      const updatedProduct = await productService.updateProduct(product);
      const transformedProduct = {
        ...updatedProduct,
        categoryId: updatedProduct.category_id,
        brandId: updatedProduct.brand_id,
        supplierId: updatedProduct.supplier_id,
        modelNumber: updatedProduct.model_number,
        buyingPrice: parseFloat(updatedProduct.buying_price),
        sellingPrice: parseFloat(updatedProduct.selling_price),
        createdAt: new Date(updatedProduct.created_at),
        updatedAt: new Date(updatedProduct.updated_at)
      };
      setProducts(prev => prev.map(p => p.id === product.id ? transformedProduct : p));
      return transformedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  }

  async function deleteProduct(id: string) {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  }
  
  return {
    products,
    categories,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadData
  };
}