import { supabase } from '../lib/supabase';
import { Brand, Category, Supplier } from '../types';

export const masterDataService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async addCategory(name: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(category: Category): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({ name: category.name })
      .eq('id', category.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Brands
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async addBrand(name: string): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBrand(brand: Brand): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .update({ name: brand.name })
      .eq('id', brand.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteBrand(id: string): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async addSupplier(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([{
        name: supplier.name,
        contact_person: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding supplier:', error);
      throw error;
    }
    return data;
  },

  async updateSupplier(supplier: Supplier): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .update({
        name: supplier.name,
        contact_person: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone
      })
      .eq('id', supplier.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
    return data;
  },

  async deleteSupplier(id: string): Promise<void> {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  }
};