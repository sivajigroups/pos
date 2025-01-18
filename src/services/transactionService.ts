import { supabase } from '../lib/supabase';
import { Transaction, CartItem, Discount } from '../types';

export const transactionService = {
  async createTransaction(
    items: CartItem[], 
    subtotal: number,
    discount?: Discount
  ): Promise<Transaction> {
    // Start a Supabase transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        subtotal_amount: subtotal,
        discount_type: discount?.type,
        discount_value: discount?.value,
        status: 'completed'
      }])
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      throw transactionError;
    }

    // Insert transaction items
    const transactionItems = items.map(item => ({
      transaction_id: transaction.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.sellingPrice
    }));

    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(transactionItems);

    if (itemsError) {
      console.error('Transaction items error:', itemsError);
      throw itemsError;
    }

    return {
      id: transaction.id,
      items,
      subtotalAmount: subtotal,
      discountType: discount?.type,
      discountValue: discount?.value,
      totalAmount: transaction.total_amount,
      status: transaction.status,
      timestamp: new Date(transaction.created_at)
    };
  },

  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        transaction_items (
          quantity,
          unit_price,
          products (
            id,
            name,
            description,
            model_number,
            selling_price
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get transactions error:', error);
      throw error;
    }

    return data.map(transaction => ({
      id: transaction.id,
      items: transaction.transaction_items.map((item: any) => ({
        ...item.products,
        quantity: item.quantity,
        sellingPrice: parseFloat(item.unit_price)
      })),
      subtotalAmount: parseFloat(transaction.subtotal_amount),
      discountType: transaction.discount_type,
      discountValue: transaction.discount_value 
        ? parseFloat(transaction.discount_value)
        : undefined,
      totalAmount: parseFloat(transaction.total_amount),
      status: transaction.status,
      timestamp: new Date(transaction.created_at)
    }));
  }
};