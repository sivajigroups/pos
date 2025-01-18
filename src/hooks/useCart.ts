import { useState, useCallback } from 'react';
import { CartItem, Product, Discount } from '../types';
import { transactionService } from '../services/transactionService';

export function useCart(products: Product[]) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) {
      alert('This item is out of stock');
      return;
    }

    setCartItems(items => {
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert('Not enough stock available');
          return items;
        }
        return items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    const product = products.find(p => p.id === itemId);
    if (product && newQuantity > product.stock) {
      alert('Not enough stock available');
      return;
    }

    if (newQuantity < 1) {
      setCartItems(items => items.filter(item => item.id !== itemId));
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [products]);

  const removeItem = useCallback((itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  }, []);

  const checkout = useCallback(async (discount?: Discount) => {
    try {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0
      );

      // Create transaction
      await transactionService.createTransaction(cartItems, subtotal, discount);

      // Clear cart after successful transaction
      setCartItems([]);
      
      return true;
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    }
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    checkout
  };
}