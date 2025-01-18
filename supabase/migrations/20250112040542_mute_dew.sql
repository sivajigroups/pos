/*
  # Add Sample Data

  1. Sample Data
    - Brands: Popular electronics brands
    - Categories: Common electronics categories
    - Suppliers: Sample electronics suppliers
    - Products: Various electronics products with realistic prices and stock levels

  2. Notes
    - All data is fictional and for demonstration purposes
    - Prices are in INR
    - Stock levels are reasonable for a small electronics store
*/

-- Insert sample brands
INSERT INTO brands (name) VALUES
('Apple'),
('Samsung'),
('Dell'),
('HP'),
('Lenovo'),
('Sony'),
('LG'),
('Asus'),
('Acer'),
('MSI');

-- Insert sample categories
INSERT INTO categories (name) VALUES
('Laptops'),
('Smartphones'),
('Tablets'),
('Monitors'),
('Accessories'),
('Smart Watches'),
('Audio Devices'),
('Gaming'),
('Networking'),
('Storage');

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_person, email, phone) VALUES
('Tech Distributors Ltd', 'Rajesh Kumar', 'rajesh@techdist.com', '+91 98765 43210'),
('Global Electronics', 'Priya Singh', 'priya@globalelec.com', '+91 87654 32109'),
('Digital Solutions', 'Amit Patel', 'amit@digitalsol.com', '+91 76543 21098'),
('Smart Systems', 'Neha Sharma', 'neha@smartsys.com', '+91 65432 10987'),
('Future Tech', 'Vikram Malhotra', 'vikram@futuretech.com', '+91 54321 09876');

-- Insert sample products
DO $$ 
DECLARE
    apple_id UUID;
    samsung_id UUID;
    dell_id UUID;
    hp_id UUID;
    lenovo_id UUID;
    laptops_id UUID;
    phones_id UUID;
    tablets_id UUID;
    monitors_id UUID;
    accessories_id UUID;
    supplier1_id UUID;
    supplier2_id UUID;
    supplier3_id UUID;
BEGIN
    -- Get brand IDs
    SELECT id INTO apple_id FROM brands WHERE name = 'Apple' LIMIT 1;
    SELECT id INTO samsung_id FROM brands WHERE name = 'Samsung' LIMIT 1;
    SELECT id INTO dell_id FROM brands WHERE name = 'Dell' LIMIT 1;
    SELECT id INTO hp_id FROM brands WHERE name = 'HP' LIMIT 1;
    SELECT id INTO lenovo_id FROM brands WHERE name = 'Lenovo' LIMIT 1;

    -- Get category IDs
    SELECT id INTO laptops_id FROM categories WHERE name = 'Laptops' LIMIT 1;
    SELECT id INTO phones_id FROM categories WHERE name = 'Smartphones' LIMIT 1;
    SELECT id INTO tablets_id FROM categories WHERE name = 'Tablets' LIMIT 1;
    SELECT id INTO monitors_id FROM categories WHERE name = 'Monitors' LIMIT 1;
    SELECT id INTO accessories_id FROM categories WHERE name = 'Accessories' LIMIT 1;

    -- Get supplier IDs
    SELECT id INTO supplier1_id FROM suppliers WHERE name = 'Tech Distributors Ltd' LIMIT 1;
    SELECT id INTO supplier2_id FROM suppliers WHERE name = 'Global Electronics' LIMIT 1;
    SELECT id INTO supplier3_id FROM suppliers WHERE name = 'Digital Solutions' LIMIT 1;

    -- Insert products
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
    -- Laptops
    ('MacBook Pro 16"', 'Latest model with M2 chip', apple_id, 'MBP16-M2', supplier1_id, laptops_id, 180000.00, 239900.00, 15),
    ('MacBook Air', 'M2, 8GB RAM, 256GB SSD', apple_id, 'MBA-M2', supplier1_id, laptops_id, 92000.00, 114900.00, 20),
    ('Dell XPS 15', '12th Gen i7, 16GB RAM, 512GB SSD', dell_id, 'XPS15-12', supplier2_id, laptops_id, 125000.00, 159900.00, 10),
    ('HP Pavilion', '11th Gen i5, 8GB RAM, 512GB SSD', hp_id, 'PAV-11i5', supplier3_id, laptops_id, 55000.00, 69900.00, 25),
    ('Lenovo ThinkPad X1', '12th Gen i7, 16GB RAM, 1TB SSD', lenovo_id, 'TP-X1-12', supplier2_id, laptops_id, 145000.00, 189900.00, 8),

    -- Smartphones
    ('iPhone 15 Pro', '256GB, Space Black', apple_id, 'IP15P-256', supplier1_id, phones_id, 98000.00, 129900.00, 30),
    ('iPhone 15', '128GB, Blue', apple_id, 'IP15-128', supplier1_id, phones_id, 68000.00, 79900.00, 40),
    ('Samsung S24 Ultra', '512GB, Titanium', samsung_id, 'S24U-512', supplier2_id, phones_id, 110000.00, 139900.00, 25),
    ('Samsung S24', '256GB, Black', samsung_id, 'S24-256', supplier2_id, phones_id, 65000.00, 79900.00, 35),

    -- Tablets
    ('iPad Pro 12.9"', 'M2 chip, 256GB, Wi-Fi', apple_id, 'IPDP-12-256', supplier1_id, tablets_id, 89000.00, 119900.00, 15),
    ('Samsung Tab S9', '256GB, Wi-Fi, Gray', samsung_id, 'TS9-256', supplier2_id, tablets_id, 58000.00, 74900.00, 20),

    -- Monitors
    ('Dell UltraSharp 27"', '4K USB-C Monitor', dell_id, 'U2723QE', supplier2_id, monitors_id, 45000.00, 59900.00, 12),
    ('HP 24" Monitor', 'Full HD IPS Display', hp_id, 'HP24F', supplier3_id, monitors_id, 12000.00, 15900.00, 30),
    ('Samsung 32" Curved', 'Gaming Monitor 165Hz', samsung_id, 'C32G55T', supplier2_id, monitors_id, 28000.00, 35900.00, 15);

END $$;

-- Insert sample transactions
DO $$
DECLARE
    iphone_id UUID;
    macbook_id UUID;
    monitor_id UUID;
    transaction_id UUID;
BEGIN
    -- Get some product IDs
    SELECT id INTO iphone_id FROM products WHERE name LIKE 'iPhone%' LIMIT 1;
    SELECT id INTO macbook_id FROM products WHERE name LIKE 'MacBook%' LIMIT 1;
    SELECT id INTO monitor_id FROM products WHERE name LIKE '%Monitor%' LIMIT 1;

    -- Create a transaction
    INSERT INTO transactions (subtotal_amount, discount_type, discount_value, total_amount, status)
    VALUES (294700.00, 'percentage', 5, 279965.00, 'completed')
    RETURNING id INTO transaction_id;

    -- Add transaction items
    INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price)
    VALUES
    (transaction_id, iphone_id, 1, 129900.00),
    (transaction_id, macbook_id, 1, 149900.00),
    (transaction_id, monitor_id, 1, 14900.00);

    -- Create another transaction without discount
    INSERT INTO transactions (subtotal_amount, total_amount, status)
    VALUES (129900.00, 129900.00, 'completed')
    RETURNING id INTO transaction_id;

    -- Add transaction items
    INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price)
    VALUES
    (transaction_id, iphone_id, 1, 129900.00);

END $$;