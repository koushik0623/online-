import sqlite3
import os

db_path = "sparkle_store.db"

# Create or connect to local SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Create USERS table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'customer',
    auth_method TEXT DEFAULT 'Standard Auth',
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_count INTEGER DEFAULT 1
);
''')

# 2. Create ORDERS table
cursor.execute('''
CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    total_amount REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    final_paid_amount REAL NOT NULL,
    payment_method TEXT DEFAULT 'PhonePe',
    payment_status TEXT DEFAULT 'Paid',
    order_status TEXT DEFAULT 'Order Received',
    utr_number TEXT,
    tracking_number TEXT,
    shipping_street TEXT,
    shipping_city TEXT,
    shipping_pincode TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')

# 3. Create ORDER_ITEMS table
cursor.execute('''
CREATE TABLE IF NOT EXISTS order_items (
    item_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    selected_size TEXT DEFAULT 'N/A',
    quantity INTEGER DEFAULT 1,
    unit_price REAL NOT NULL,
    total_item_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
''')

# 4. Insert initial sample seed data into database
cursor.execute("INSERT OR REPLACE INTO users (user_id, full_name, email, phone, role, auth_method) VALUES ('USR-1001', 'Sparkle Owner', 'sparklekkvofficial@gmail.com', '+919949157771', 'admin', 'Owner Portal Auth')")
cursor.execute("INSERT OR REPLACE INTO users (user_id, full_name, email, phone, role, auth_method) VALUES ('USR-1002', 'Chenchu Koushik', 'chenchukoushik@gmail.com', '+919949157771', 'customer', 'Standard Auth')")

cursor.execute("INSERT OR REPLACE INTO orders (order_id, customer_name, email, phone, total_amount, final_paid_amount, payment_method, payment_status, order_status, shipping_street, shipping_city, shipping_pincode) VALUES ('ORD-99999', 'Chenchu Koushik', 'sparklekkvofficial@gmail.com', '+919949157771', 1299.00, 1299.00, 'PhonePe Scanner', 'Paid', 'Order Received', 'Madhapur', 'Hyderabad', '500081')")

cursor.execute("INSERT OR REPLACE INTO order_items (item_id, order_id, product_id, product_name, selected_size, quantity, unit_price, total_item_price) VALUES ('ITM-501', 'ORD-99999', 'SPK-BG-501', 'Royal Kundan Gold Bangle Set', '2*8', 1, 1299.00, 1299.00)")

conn.commit()
conn.close()

print(f"SUCCESS: Sparkle Store SQL Database created locally at: {os.path.abspath(db_path)}")
