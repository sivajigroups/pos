-- Drop existing tables if they exist
DROP TABLE IF EXISTS transaction_items CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create suppliers table
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create brands table
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table with all required fields
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id),
  model_number VARCHAR(100),
  supplier_id UUID REFERENCES suppliers(id),
  category_id UUID REFERENCES categories(id),
  buying_price DECIMAL(10,2) NOT NULL CHECK (buying_price >= 0),
  selling_price DECIMAL(10,2) NOT NULL CHECK (selling_price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subtotal_amount DECIMAL(10,2) NOT NULL,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transaction_items table for storing items in each transaction
CREATE TABLE transaction_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create stock_movements table for tracking inventory changes
CREATE TABLE stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'adjustment')),
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to calculate final amount with discount
CREATE OR REPLACE FUNCTION calculate_final_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.discount_type IS NOT NULL THEN
    IF NEW.discount_type = 'percentage' THEN
      NEW.total_amount = NEW.subtotal_amount * (1 - NEW.discount_value / 100);
    ELSE
      NEW.total_amount = NEW.subtotal_amount - NEW.discount_value;
    END IF;
  ELSE
    NEW.total_amount = NEW.subtotal_amount;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically calculate final amount
CREATE TRIGGER calculate_final_amount_trigger
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_final_amount();

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for updating stock on transaction
CREATE OR REPLACE FUNCTION update_stock_after_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product stock
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
    
    -- Create stock movement record
    INSERT INTO stock_movements (
        product_id,
        quantity,
        movement_type,
        reference_id,
        notes
    ) VALUES (
        NEW.product_id,
        -NEW.quantity,
        'sale',
        NEW.transaction_id,
        'Sale transaction'
    );
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stock_after_transaction_trigger
    AFTER INSERT ON transaction_items
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_transaction();

-- Create indexes for better query performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_reference ON stock_movements(reference_id);

-- Insert dummy data
INSERT INTO suppliers (name, contact_person, email, phone) VALUES
('Tech Supplies Co.', 'John Smith', 'john@techsupplies.com', '+1-555-0123'),
('Global Electronics', 'Mary Johnson', 'mary@globalelec.com', '+1-555-0124'),
('Digital Distributors', 'Robert Brown', 'robert@digidist.com', '+1-555-0125');

INSERT INTO brands (name) VALUES
('Apple'),
('Samsung'),
('Dell'),
('HP'),
('Lenovo');

INSERT INTO categories (name) VALUES
('Laptops'),
('Smartphones'),
('Tablets'),
('Accessories'),
('Monitors');

-- Insert sample products
DO $$ 
DECLARE
    supplier1_id UUID;
    supplier2_id UUID;
    brand1_id UUID;
    brand2_id UUID;
    category1_id UUID;
    category2_id UUID;
BEGIN
    SELECT id INTO supplier1_id FROM suppliers WHERE name = 'Tech Supplies Co.' LIMIT 1;
    SELECT id INTO supplier2_id FROM suppliers WHERE name = 'Global Electronics' LIMIT 1;
    SELECT id INTO brand1_id FROM brands WHERE name = 'Apple' LIMIT 1;
    SELECT id INTO brand2_id FROM brands WHERE name = 'Samsung' LIMIT 1;
    SELECT id INTO category1_id FROM categories WHERE name = 'Laptops' LIMIT 1;
    SELECT id INTO category2_id FROM categories WHERE name = 'Smartphones' LIMIT 1;

    INSERT INTO products (
        name, 
        description, 
        brand_id, 
        model_number, 
        supplier_id, 
        category_id, 
        buying_price, 
        selling_price, 
        stock
    ) VALUES
    ('MacBook Pro 16"', 'Latest model with M2 chip', brand1_id, 'MBP16-M2', supplier1_id, category1_id, 1800.00, 2399.00, 50),
    ('iPhone 15 Pro', '256GB Storage', brand1_id, 'IP15P-256', supplier1_id, category2_id, 900.00, 1199.00, 100),
    ('Galaxy S24 Ultra', '512GB Storage', brand2_id, 'S24U-512', supplier2_id, category2_id, 1000.00, 1399.00, 75),
    ('Galaxy Book3', '16GB RAM, 512GB SSD', brand2_id, 'GB3-16512', supplier2_id, category1_id, 1200.00, 1599.00, 30);
END $$;