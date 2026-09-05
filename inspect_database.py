import sqlite3

db_path = "sparkle_store.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("\n" + "="*75)
print(" SPARKLE @ KKV LUXURY STORE - LOCAL SQL DATABASE INSPECTOR")
print("="*75 + "\n")

print("1. REGISTERED & LOGGED IN USERS (users Table):")
print("-" * 75)
cursor.execute("SELECT user_id, full_name, email, phone, role, auth_method, last_login_at FROM users")
users = cursor.fetchall()
for u in users:
    print(f" * [{u[0]}] {u[1]} | Email: {u[2]} | Phone: {u[3]} | Role: {u[4]} | Login: {u[6]}")

print("\n2. CUSTOMER ORDERS & PAYMENTS (orders & order_items Tables):")
print("-" * 75)
cursor.execute("""
SELECT 
    o.order_id, o.customer_name, o.phone, o.email, o.final_paid_amount, o.payment_method, o.order_status,
    i.product_name, i.selected_size, i.quantity, i.unit_price
FROM orders o
LEFT JOIN order_items i ON o.order_id = i.order_id
""")
orders = cursor.fetchall()
for o in orders:
    print(f" * Order ID: {o[0]} | Customer: {o[1]} ({o[2]})")
    print(f"   Item: {o[7]} | Bangle Size: {o[8]} | Qty: {o[9]} | Price: Rs.{o[10]} | Total Paid: Rs.{o[4]} ({o[5]})")
    print(f"   Status: {o[6]}\n")

conn.close()
print("="*75 + "\n")
