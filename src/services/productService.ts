import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const productService = {
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products. Please check your connection and try again.');
    }
  },

  // Rest of the service remains the same...
};