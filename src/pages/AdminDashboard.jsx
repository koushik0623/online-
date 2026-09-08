import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShieldCheck, Package, DollarSign, Users, ShoppingBag, 
  Check, X, Sparkles, Tag, Search, Truck, Clock, RefreshCw, Download, Filter, CheckCircle2,
  Plus, Edit3, Trash2, Database, AlertCircle, PhoneCall, ExternalLink, Globe
} from 'lucide-react';

import { fetchGlobalDatabaseOrders } from '../services/remoteOrderSync';
import { getSQLLoggedInUsers, getSQLOrders, getSQLOrderItems, getSQLProducts, generateSQLDumpScript } from '../services/sqlDatabaseService';
import { fetchCloudUsers, fetchCloudOrders } from '../services/neonCloudService';
import { apiFetch } from '../services/apiConfig';

export const AdminDashboard = () => {
  const {
    user,
    loginUser,
    products,
    orders,
    subscribers,
    deleteSubscriber,
    COUPONS,
    showToast
  } = useShop();

  const [adminEmail, setAdminEmail] = useState("admin@sparklekkv.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    return localStorage.getItem('sparkle_admin_authed') === 'true';
  });
  const [liveOrders, setLiveOrders] = useState([]);
  const [localProducts, setLocalProducts] = useState(products || []);

  const [adminTab, setAdminTab] = useState('orders');
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const [manualOrder, setManualOrder] = useState({
    customerName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    pincode: '',
    totalAmount: '',
    itemName: '',
    paymentMethod: 'PhonePe'
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'gift-sets',
    subcategory: 'canvas',
    price: '',
    originalPrice: '',
    stock: 10,
    images: 'images/shin-chan.png',
    description: ''
  });

  const TEST_ORDER_IDS = ['ORD-91714', 'ORD-95159', 'ORD-54561', 'ORD-11718', 'ORD-72852', 'ORD-55003', 'ORD-31965', 'ORD-57289', 'ORD-52031', 'ORD-23498', 'ORD-99999', 'ORD-98241', 'ORD-99585', 'ORD-22198', 'ORD-17788', 'ORD-37009', 'ORD-USER-LIVE-900', 'ORD-USERLINK-101', 'ORD-17317', 'ORD-SCANNER-888', 'ORD-KOUSHIK-102', 'ORD-AKASH-101', 'ORD-LIVE-777', 'ORD-TEST-999', 'ORD-54438'];

  const getOrderId = (o) => String(o?.id || o?.order_id || o?.orderId || '');

  const syncLiveCloudOrders = async () => {
    try {
      const res = await apiFetch('/api/admin/orders');
      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.orders)) {
          setLiveOrders(data.orders);
          return;
        }
      }
    } catch (e) {}

    const cloudOrders = await fetchCloudOrders();
    const globalOrders = fetchGlobalDatabaseOrders();

    const mergedMap = new Map();
    [...cloudOrders, ...globalOrders, ...orders].forEach(o => {
      const id = getOrderId(o);
      if (id && !TEST_ORDER_IDS.includes(id)) {
        mergedMap.set(id, { ...o, id });
      }
    });

    setLiveOrders(Array.from(mergedMap.values()));
  };

  const [liveUsers, setLiveUsers] = useState([]);

  const syncLiveCloudUsers = async () => {
    try {
      const res = await apiFetch('/api/admin/customers');
      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.customers)) {
          setLiveUsers(data.customers);
          return;
        }
      }
    } catch (e) {}

    const sqlUsers = getSQLLoggedInUsers();
    const cloudUsers = await fetchCloudUsers();

    const mergedUsersMap = new Map();
    [...cloudUsers, ...sqlUsers].forEach(u => {
      if (!u) return;
      const key = String(u.email || u.phone || u.full_name || u.name || '').toLowerCase().trim();
      if (key && !key.includes('admin@sparklekkv.com')) {
        mergedUsersMap.set(key, u);
      }
    });

    setLiveUsers(Array.from(mergedUsersMap.values()));
  };

  const handleExportCustomersCSV = () => {
    if (!liveUsers || liveUsers.length === 0) {
      showToast('⚠️ No customer records available to export.');
      return;
    }
    const headers = ['User ID', 'Full Name', 'Email', 'Phone', 'Role', 'Auth Method', 'Login Count', 'Created At'];
    const rows = liveUsers.map(u => [
      `"${u.user_id || u.id || ''}"`,
      `"${u.full_name || u.name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.role || 'customer'}"`,
      `"${u.auth_method || u.authMethod || 'Standard'}"`,
      `"${u.login_count || u.loginCount || 1}"`,
      `"${u.created_at || u.createdAt || new Date().toISOString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sparkle_customers_database_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Customer Database CSV Downloaded!');
  };

  useEffect(() => {
    syncLiveCloudOrders();
    syncLiveCloudUsers();
    const interval = setInterval(() => {
      syncLiveCloudOrders();
      syncLiveCloudUsers();
    }, 10000);
    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLocalProducts(products);
    }
  }, [products]);

  const totalRevenue = (Array.isArray(liveOrders) ? liveOrders : []).reduce((sum, o) => sum + (o?.finalAmount || o?.cartTotal || o?.totalAmount || 0), 0);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin123' || adminPassword === 'sparkleadmin' || adminPassword === 'admin') {
      loginUser("Sparkle Owner @ KKV", adminEmail || "admin@sparklekkv.com", adminPassword, "admin@sparklekkv.com", "admin");
      setIsAdminAuthed(true);
      localStorage.setItem('sparkle_admin_authed', 'true');
      setLoginError('');
      showToast("🛡️ Owner Admin Authenticated Successfully!", "success");
    } else {
      setLoginError("Invalid Admin Passcode! (Default: admin123)");
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setLiveOrders(prev => (Array.isArray(prev) ? prev : []).map(o => getOrderId(o) === orderId ? { ...o, orderStatus: newStatus } : o));
    try {
      const updatedList = (Array.isArray(liveOrders) ? liveOrders : []).map(o => getOrderId(o) === orderId ? { ...o, orderStatus: newStatus } : o);
      localStorage.setItem('sparkel_orders', JSON.stringify(updatedList));
      localStorage.setItem('SPARKLE_REMOTE_ORDERS_DATABASE', JSON.stringify(updatedList));
    } catch (e) {}
    showToast(`Order ${orderId} status updated to "${newStatus}"!`, "success");
  };

  const handleClearAllOrders = async () => {
    if (window.confirm("Are you sure you want to clear all test orders from your admin portal?")) {
      localStorage.removeItem('sparkel_orders');
      localStorage.removeItem('SPARKLE_REMOTE_ORDERS_DATABASE');
      localStorage.removeItem('SPARKLE_SQL_ORDERS_DB');
      localStorage.removeItem('SPARKLE_SQL_ITEMS_DB');
      setLiveOrders([]);
      try {
        await apiFetch('/api/orders/clear-all', { method: 'DELETE' });
      } catch (e) {}
      showToast("🗑️ All test orders cleared from Admin Portal!", "info");
    }
  };

  const handleDeleteSingleOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const updated = (Array.isArray(liveOrders) ? liveOrders : []).filter(o => getOrderId(o) !== orderId);
      setLiveOrders(updated);
      try {
        localStorage.setItem('sparkel_orders', JSON.stringify(updated));
        localStorage.setItem('SPARKLE_REMOTE_ORDERS_DATABASE', JSON.stringify(updated));
      } catch (e) {}
      showToast(`Deleted order ${orderId}!`, "info");
    }
  };

  const handleCreateManualOrder = (e) => {
    e.preventDefault();
    if (!manualOrder.customerName || !manualOrder.totalAmount) {
      showToast("Please fill customer name and order total!", "error");
      return;
    }

    const createdOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: manualOrder.customerName,
      email: manualOrder.email || 'customer@sparklekkv.com',
      phone: manualOrder.phone || 'N/A',
      items: [
        {
          id: 'SPK-CUSTOM',
          name: manualOrder.itemName || 'Jewelry Accessory',
          price: Number(manualOrder.totalAmount),
          quantity: 1,
          image: 'images/shin-chan.png'
        }
      ],
      totalAmount: Number(manualOrder.totalAmount),
      finalAmount: Number(manualOrder.totalAmount),
      cartTotal: Number(manualOrder.totalAmount),
      cartSubtotal: Number(manualOrder.totalAmount),
      discountAmount: 0,
      shippingFee: 0,
      paymentMethod: manualOrder.paymentMethod,
      paymentStatus: 'Paid',
      orderStatus: 'Order Received',
      trackingNumber: `SPK-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      shippingAddress: {
        fullName: manualOrder.customerName,
        phone: manualOrder.phone || 'N/A',
        street: manualOrder.street || 'Madhapur',
        city: manualOrder.city || 'Hyderabad',
        pincode: manualOrder.pincode || '500081'
      },
      estimatedDeliveryDate: 'Within 7 Business Days',
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [createdOrder, ...liveOrders];
    setLiveOrders(updated);
    try {
      localStorage.setItem('sparkel_orders', JSON.stringify(updated));
      localStorage.setItem('SPARKLE_REMOTE_ORDERS_DATABASE', JSON.stringify(updated));
    } catch (err) {}

    setIsAddModalOpen(false);
    setManualOrder({ customerName: '', phone: '', email: '', street: '', city: '', pincode: '', totalAmount: '', itemName: '', paymentMethod: 'PhonePe' });
    showToast(`🎉 Order ${createdOrder.id} added successfully!`, "success");
  };

  const handleCreateNewProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      showToast("Please enter product name and price!", "error");
      return;
    }

    const createdProd = {
      id: `SPK-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      sku: `SPK-NEW-${Math.floor(100 + Math.random() * 900)}`,
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      categoryName: 'Custom Product',
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || newProduct.price),
      rating: 5,
      reviewsCount: 1,
      isNew: true,
      isTrending: true,
      stock: Number(newProduct.stock),
      images: [newProduct.images || 'images/shin-chan.png'],
      description: newProduct.description || 'Premium handcrafted jewelry item.'
    };

    setLocalProducts([createdProd, ...localProducts]);
    setIsAddProductModalOpen(false);
    setNewProduct({ name: '', category: 'gift-sets', subcategory: 'canvas', price: '', originalPrice: '', stock: 10, images: 'images/shin-chan.png', description: '' });
    showToast(`✨ Product "${createdProd.name}" added to store catalog!`, "success");
  };

  const filteredOrdersList = (Array.isArray(liveOrders) ? liveOrders : []).filter(o => {
    if (!o) return false;
    const orderIdStr = getOrderId(o);
    const matchesSearch = 
      (orderIdStr && orderIdStr.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.email && o.email.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.shippingAddress?.phone && String(o.shippingAddress.phone).includes(orderSearchQuery)) ||
      (o.utrNumber && o.utrNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    const matchesStatus = selectedStatusFilter === "ALL" || o.orderStatus === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredProductsList = localProducts.filter(p => {
    if (!p) return false;
    const q = productSearchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q))
    );
  });

  // Admin Passcode Login Screen
  if (!isAdminAuthed && (!user || !user.isLoggedIn || user.role !== 'admin')) {
    return (
      <div className="py-16 sm:py-24 bg-[#1A1A1A] min-h-screen font-poppins flex items-center justify-center p-4">
        <div className="bg-[#2C2C2C] max-w-md w-full rounded-3xl p-6 sm:p-8 border border-[#D4AF7F]/40 shadow-2xl space-y-6 text-center text-white">
          <div className="w-16 h-16 bg-[#C89B3C] text-black rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-9 h-9 text-black" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-montserrat uppercase tracking-widest text-[#D4AF7F] font-bold">Sparkle @ KKV Owner Portal</span>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#FCE4EC]">Private Admin Sign In</h2>
            <p className="text-xs text-gray-400 font-light">Enter owner passcode to manage customer orders & MongoDB Atlas database.</p>
          </div>

          {loginError && (
            <div className="bg-red-950/80 text-red-300 text-xs p-3 rounded-xl border border-red-800 font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4 text-left font-poppins text-xs">
            <div>
              <label className="block text-[11px] font-montserrat font-semibold text-[#D4AF7F] uppercase tracking-wider mb-1">
                Admin Owner Email / ID
              </label>
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#D4AF7F]/40 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-montserrat font-semibold text-[#D4AF7F] uppercase tracking-wider mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter passcode (e.g. admin123)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#D4AF7F]/40 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C89B3C] hover:bg-[#D4AF7F] text-black font-montserrat font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Authenticate As Owner</span>
              <ShieldCheck className="w-4 h-4 text-black" />
            </button>
          </form>

          <p className="text-[10px] text-gray-500 font-light">
            🔒 Private Owner Access • Sparkle @ KKV Luxury Accessories
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#0F0F0F] min-h-screen font-poppins text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* EXECUTIVE ADMIN HEADER BAR */}
        <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2A1E24] to-[#1A1A1A] text-white p-6 sm:p-8 rounded-3xl shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C89B3C]/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C89B3C]/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#C89B3C] text-black flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
              <ShieldCheck className="w-8 h-8 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-2xl font-bold text-[#FCE4EC]">
                  Sparkle @ KKV Owner Admin Portal
                </h1>
                <span className="bg-[#C89B3C] text-black text-[10px] font-bold font-montserrat px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live Cloud Admin
                </span>
              </div>
              <p className="text-xs text-gray-400 font-light mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Connected to MongoDB Atlas Database: <strong className="text-[#D4AF7F]">sparkle_store</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-[#2C2C2C] px-5 py-2.5 rounded-2xl border border-[#D4AF7F]/30 text-center">
              <span className="block font-bold text-lg text-[#D4AF7F]">₹{totalRevenue}</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-montserrat font-bold">Total Revenue</span>
            </div>
            <div className="bg-[#2C2C2C] px-5 py-2.5 rounded-2xl border border-[#D4AF7F]/30 text-center">
              <span className="block font-bold text-lg text-[#F48FB1]">{liveOrders.length}</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-montserrat font-bold">Live Orders</span>
            </div>
            <div className="bg-[#2C2C2C] px-5 py-2.5 rounded-2xl border border-[#D4AF7F]/30 text-center">
              <span className="block font-bold text-lg text-emerald-400">{localProducts.length}</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-montserrat font-bold">Products</span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION ROW */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 font-montserrat text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-6 py-3 rounded-2xl transition-all shrink-0 flex items-center gap-2 border ${adminTab === 'orders' ? 'bg-[#C89B3C] text-black border-[#C89B3C] shadow-lg' : 'bg-[#1A1A1A] text-gray-300 border-gray-800 hover:border-[#D4AF7F]/50'}`}
          >
            <Package className="w-4 h-4" />
            <span>📦 Order Manager ({liveOrders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`px-6 py-3 rounded-2xl transition-all shrink-0 flex items-center gap-2 border ${adminTab === 'products' ? 'bg-[#C89B3C] text-black border-[#C89B3C] shadow-lg' : 'bg-[#1A1A1A] text-gray-300 border-gray-800 hover:border-[#D4AF7F]/50'}`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>🏷️ Product Catalog ({localProducts.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-6 py-3 rounded-2xl transition-all shrink-0 flex items-center gap-2 border ${adminTab === 'analytics' ? 'bg-[#C89B3C] text-black border-[#C89B3C] shadow-lg' : 'bg-[#1A1A1A] text-gray-300 border-gray-800 hover:border-[#D4AF7F]/50'}`}
          >
            <DollarSign className="w-4 h-4" />
            <span>📊 Sales Analytics</span>
          </button>

          <button
            onClick={() => setAdminTab('subscribers')}
            className={`px-6 py-3 rounded-2xl transition-all shrink-0 flex items-center gap-2 border ${adminTab === 'subscribers' ? 'bg-[#C89B3C] text-black border-[#C89B3C] shadow-lg' : 'bg-[#1A1A1A] text-gray-300 border-gray-800 hover:border-[#D4AF7F]/50'}`}
          >
            <Users className="w-4 h-4" />
            <span>👑 VIP Subscribers ({subscribers ? subscribers.length : 0})</span>
          </button>

          <button
            onClick={() => setAdminTab('logins')}
            className={`px-6 py-3 rounded-2xl transition-all shrink-0 flex items-center gap-2 border ${adminTab === 'logins' ? 'bg-[#C89B3C] text-black border-[#C89B3C] shadow-lg' : 'bg-[#1A1A1A] text-gray-300 border-gray-800 hover:border-[#D4AF7F]/50'}`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>👥 Customer Logins ({liveUsers.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('sqldb')}
            className={`px-6 py-3 rounded-2xl transition-all shrink-0 flex items-center gap-2 border ${adminTab === 'sqldb' ? 'bg-[#C89B3C] text-black border-[#C89B3C] shadow-lg' : 'bg-[#1A1A1A] text-gray-300 border-gray-800 hover:border-[#D4AF7F]/50'}`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>🗄️ SQL Database</span>
          </button>
        </div>

        {/* TAB 1: ORDER MANAGER */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Search & Action Bar */}
            <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-[#D4AF7F]/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 font-poppins">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Order ID, Name, Phone, UTR..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto font-montserrat text-[10px] font-bold uppercase">
                {['ALL', 'Order Received', 'Processing', 'Shipped', 'Delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${selectedStatusFilter === status ? 'bg-[#C89B3C] text-black' : 'bg-[#2C2C2C] text-gray-300 hover:bg-[#3C3C3C]'}`}
                  >
                    {status}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg transition-colors shrink-0 font-bold flex items-center gap-1 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Order</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAllOrders}
                  className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 px-3 py-1.5 rounded-lg transition-colors shrink-0 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* MANUAL ORDER MODAL */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#1A1A1A] rounded-3xl p-6 max-w-md w-full border border-[#D4AF7F]/40 shadow-2xl space-y-4 font-poppins text-white">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="font-serif-luxury font-bold text-lg text-[#FCE4EC]">➕ Add Manual Customer Order</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
                  </div>

                  <form onSubmit={handleCreateManualOrder} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#D4AF7F] mb-1">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kowshik Varma"
                        value={manualOrder.customerName}
                        onChange={(e) => setManualOrder({ ...manualOrder, customerName: e.target.value })}
                        className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-[#D4AF7F] mb-1">Phone Number</label>
                        <input
                          type="text"
                          placeholder="9949157771"
                          value={manualOrder.phone}
                          onChange={(e) => setManualOrder({ ...manualOrder, phone: e.target.value })}
                          className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#D4AF7F] mb-1">Total Paid (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="169"
                          value={manualOrder.totalAmount}
                          onChange={(e) => setManualOrder({ ...manualOrder, totalAmount: e.target.value })}
                          className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#D4AF7F] mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="customer@gmail.com"
                        value={manualOrder.email}
                        onChange={(e) => setManualOrder({ ...manualOrder, email: e.target.value })}
                        className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-[#D4AF7F] mb-1">City / Region</label>
                        <input
                          type="text"
                          placeholder="Hyderabad"
                          value={manualOrder.city}
                          onChange={(e) => setManualOrder({ ...manualOrder, city: e.target.value })}
                          className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#D4AF7F] mb-1">Payment Method</label>
                        <select
                          value={manualOrder.paymentMethod}
                          onChange={(e) => setManualOrder({ ...manualOrder, paymentMethod: e.target.value })}
                          className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                        >
                          <option value="PhonePe">PhonePe QR Scanner</option>
                          <option value="UPI Direct">UPI Direct</option>
                          <option value="COD">Cash on Delivery</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#C89B3C] hover:bg-[#D4AF7F] text-black font-montserrat font-bold py-3 rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all mt-2"
                    >
                      Save Order To Live Database
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ORDERS LIST CARDS */}
            {filteredOrdersList.length === 0 ? (
              <div className="bg-[#1A1A1A] p-12 rounded-3xl text-center border border-[#D4AF7F]/20 space-y-3">
                <Package className="w-12 h-12 text-[#D4AF7F] mx-auto opacity-60" />
                <h3 className="text-base font-bold text-[#FCE4EC]">No Live Orders Found</h3>
                <p className="text-xs text-gray-400">All test orders have been wiped. New customer orders from sparklekkv.com will appear here live.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 font-poppins">
                {filteredOrdersList.map(order => {
                  const orderIdStr = getOrderId(order);
                  return (
                    <div key={orderIdStr} className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF7F]/30 shadow-lg space-y-4 relative">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-[#C89B3C] bg-[#2C2C2C] px-3 py-1 rounded-xl">
                            {orderIdStr}
                          </span>
                          <span className="text-xs text-gray-400 font-light">{order.createdAt || 'Recent Order'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-montserrat font-bold px-3 py-1 rounded-full bg-[#2C2C2C] text-[#D4AF7F]">
                            {order.paymentMethod || 'PhonePe'}
                          </span>
                          <span className={`text-[10px] uppercase font-montserrat font-bold px-3 py-1 rounded-full ${order.orderStatus === 'Delivered' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                            {order.orderStatus || 'Order Received'}
                          </span>
                          <button
                            onClick={() => handleDeleteSingleOrder(orderIdStr)}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer Info & Contact */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF7F] font-montserrat block">Customer Details</span>
                          <p className="font-semibold text-white">{order.customerName || order.shippingAddress?.fullName || 'Customer'}</p>
                          <p className="text-gray-400">📱 {order.phone || order.shippingAddress?.phone || 'N/A'}</p>
                          <p className="text-gray-400">✉️ {order.email || 'N/A'}</p>

                          {order.phone && (
                            <a
                              href={`https://wa.me/91${String(order.phone).replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:underline font-medium pt-1"
                            >
                              <span>💬 Contact Customer on WhatsApp</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF7F] font-montserrat block">Shipping Address</span>
                          <p className="text-gray-300">
                            {order.shippingAddress?.street || order.shippingAddress?.address || 'Madhapur'}, {order.shippingAddress?.city || 'Hyderabad'}
                          </p>
                          <p className="text-gray-400">PIN: {order.shippingAddress?.pincode || '500081'}</p>
                          {order.utrNumber && (
                            <p className="text-[#C89B3C] font-mono text-[11px] font-bold pt-1">
                              VERIFIED UTR: {order.utrNumber}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 border-t md:border-t-0 md:border-l border-gray-800 pt-3 md:pt-0 md:pl-4">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF7F] font-montserrat block">Order Amount</span>
                          <p className="text-xl font-bold text-[#FCE4EC]">₹{order.finalAmount || order.cartTotal || order.totalAmount || 0}</p>
                          <p className="text-[10px] text-gray-400">Status: {order.paymentStatus || 'Paid'}</p>
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-800 text-[10px] font-montserrat font-bold uppercase">
                        <span className="text-gray-400 mr-2">Update Status:</span>
                        {['Order Received', 'Processing', 'Shipped', 'Delivered'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleUpdateOrderStatus(orderIdStr, status)}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${order.orderStatus === status ? 'bg-[#C89B3C] text-black' : 'bg-[#2C2C2C] text-gray-400 hover:text-white'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGER */}
        {adminTab === 'products' && (
          <div className="space-y-6 font-poppins">
            <div className="bg-[#1A1A1A] p-5 rounded-3xl border border-[#D4AF7F]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Products by Name, SKU..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(true)}
                className="bg-[#C89B3C] hover:bg-[#D4AF7F] text-black px-4 py-2.5 rounded-xl font-montserrat text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* ADD PRODUCT MODAL */}
            {isAddProductModalOpen && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#1A1A1A] rounded-3xl p-6 max-w-md w-full border border-[#D4AF7F]/40 shadow-2xl space-y-4 text-white">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="font-serif-luxury font-bold text-lg text-[#FCE4EC]">➕ Add Product to Catalog</h3>
                    <button onClick={() => setIsAddProductModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
                  </div>

                  <form onSubmit={handleCreateNewProduct} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#D4AF7F] mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Custom Canvas Art Frame"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-[#D4AF7F] mb-1">Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="299"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#D4AF7F] mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          placeholder="399"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                          className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-[#D4AF7F] mb-1">Category</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                        >
                          <option value="gift-sets">Gift Sets & Combos</option>
                          <option value="canvas">CANVAS Art</option>
                          <option value="earrings">Ear Rings</option>
                          <option value="hair-accessories">Clips</option>
                          <option value="necklaces">Necklace Sets</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-[#D4AF7F] mb-1">Subcategory</label>
                        <input
                          type="text"
                          placeholder="canvas"
                          value={newProduct.subcategory}
                          onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                          className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#D4AF7F] mb-1">Image Path</label>
                      <input
                        type="text"
                        placeholder="images/shin-chan.png"
                        value={newProduct.images}
                        onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })}
                        className="w-full p-2.5 bg-[#0F0F0F] border border-[#D4AF7F]/40 rounded-xl text-white focus:outline-none focus:border-[#C89B3C]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#C89B3C] hover:bg-[#D4AF7F] text-black font-montserrat font-bold py-3 rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all mt-2"
                    >
                      Add Product To Store
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* PRODUCT CATALOG GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProductsList.map(prod => (
                <div key={prod.id} className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#D4AF7F]/30 shadow-md flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <img
                      src={prod.images?.[0] || 'images/shin-chan.png'}
                      alt={prod.name}
                      className="w-full h-36 object-cover rounded-xl border border-gray-800 bg-[#0F0F0F]"
                    />
                    <div>
                      <span className="text-[10px] font-mono text-[#C89B3C] block">{prod.sku || prod.id}</span>
                      <h4 className="font-semibold text-xs text-white line-clamp-2">{prod.name}</h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-800 pt-2 text-xs">
                    <span className="font-bold text-[#FCE4EC]">₹{prod.price}</span>
                    <span className="text-[10px] text-gray-400">Stock: {prod.stock || 10}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SALES ANALYTICS */}
        {adminTab === 'analytics' && (
          <div className="space-y-6 font-poppins">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF7F]/30 shadow-lg space-y-2">
                <span className="text-xs uppercase font-montserrat font-bold text-gray-400">Total Store Revenue</span>
                <p className="text-3xl font-bold text-[#D4AF7F]">₹{totalRevenue}</p>
                <p className="text-[11px] text-emerald-400 font-medium">📈 Live MongoDB Atlas Stream</p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF7F]/30 shadow-lg space-y-2">
                <span className="text-xs uppercase font-montserrat font-bold text-gray-400">Total Customer Orders</span>
                <p className="text-3xl font-bold text-[#F48FB1]">{liveOrders.length}</p>
                <p className="text-[11px] text-gray-400">PhonePe QR & UPI Payments</p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF7F]/30 shadow-lg space-y-2">
                <span className="text-xs uppercase font-montserrat font-bold text-gray-400">Total VIP Subscribers</span>
                <p className="text-3xl font-bold text-[#C89B3C]">{subscribers ? subscribers.length : 0}</p>
                <p className="text-[11px] text-gray-400">Email Marketing Community</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VIP SUBSCRIBERS */}
        {adminTab === 'subscribers' && (
          <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF7F]/30 shadow-lg space-y-4 font-poppins">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-serif-luxury font-bold text-lg text-[#FCE4EC]">👑 VIP Subscribers Directory</h3>
              <span className="text-xs font-montserrat font-bold text-[#C89B3C] bg-[#2C2C2C] px-3 py-1 rounded-full">
                {subscribers ? subscribers.length : 0} Total
              </span>
            </div>

            {(!subscribers || subscribers.length === 0) ? (
              <p className="text-xs text-gray-400 py-6 text-center">No subscribers yet.</p>
            ) : (
              <div className="space-y-2">
                {subscribers.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0F0F0F] rounded-xl border border-gray-800 text-xs">
                    <span className="font-mono text-gray-200">✉️ {sub.email || sub}</span>
                    <button
                      onClick={() => deleteSubscriber(sub.email || sub)}
                      className="text-red-400 hover:text-red-300 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LIVE CUSTOMER LOGINS */}
        {adminTab === 'logins' && (
          <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF7F]/30 shadow-lg space-y-4 font-poppins">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#FCE4EC] flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span>Live Customer Logins & Registered Accounts</span>
                </h3>
                <p className="text-xs text-gray-400 font-light mt-0.5">
                  Real-time stream of all customer logins across all servers (OTP & Standard Auth)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCustomersCSV}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-montserrat px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <span className="text-xs font-montserrat font-bold text-[#C89B3C] bg-[#2C2C2C] px-3 py-1.5 rounded-xl">
                  {liveUsers.length} Logged In Users
                </span>
              </div>
            </div>

            {(!liveUsers || liveUsers.length === 0) ? (
              <p className="text-xs text-gray-400 py-6 text-center">No customer logins recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {liveUsers.map((u, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0F0F0F] rounded-2xl border border-gray-800 text-xs gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{u.full_name || u.name || 'Customer'}</span>
                        <span className="text-[10px] uppercase font-montserrat font-bold px-2 py-0.5 rounded-full bg-[#2C2C2C] text-[#D4AF7F]">
                          {u.role || 'customer'}
                        </span>
                      </div>
                      <p className="text-gray-300 font-mono">✉️ {u.email || 'N/A'} {u.phone ? `• 📱 ${u.phone}` : ''}</p>
                      <p className="text-[10px] text-gray-500">
                        Auth Method: {u.auth_method || u.authMethod || 'Standard'} • Login Count: {u.login_count || u.loginCount || 1} • ID: {u.user_id || u.id || 'USR-001'}
                      </p>
                    </div>

                    {u.phone && (
                      <a
                        href={`https://wa.me/91${String(u.phone).replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-950/80 border border-emerald-700 text-emerald-400 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto hover:bg-emerald-900 transition-colors"
                      >
                        <span>💬 WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SQL DATABASE & DUMP EXPORTER */}
        {adminTab === 'sqldb' && (
          <div className="space-y-6 font-poppins">
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#D4AF7F]/30 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg text-[#FCE4EC] flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span>SQL Database Tables & Export Dump</span>
                  </h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">
                    View relational database tables (Users, Orders, Items, Products) & download executable .SQL scripts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const sqlScript = generateSQLDumpScript();
                    const blob = new Blob([sqlScript], { type: 'text/sql' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `sparkle_store_database_${new Date().toISOString().split('T')[0]}.sql`;
                    a.click();
                    showToast("📥 Executable .SQL Backup Script Downloaded!", "success");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .SQL Backup</span>
                </button>
              </div>

              {/* SQL TABLES PREVIEW */}
              <div className="space-y-6 text-xs">
                {/* 1. USERS TABLE */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-montserrat text-[#D4AF7F] block">
                    1. SQL `users` Table ({getSQLLoggedInUsers().length} Records)
                  </span>
                  <div className="overflow-x-auto bg-[#0F0F0F] rounded-2xl border border-gray-800 p-3">
                    <table className="w-full text-left font-mono">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-800 text-[11px]">
                          <th className="p-2">user_id</th>
                          <th className="p-2">full_name</th>
                          <th className="p-2">email</th>
                          <th className="p-2">phone</th>
                          <th className="p-2">role</th>
                          <th className="p-2">login_count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSQLLoggedInUsers().map(u => (
                          <tr key={u.user_id} className="border-b border-gray-800/50 hover:bg-[#1A1A1A] text-gray-200">
                            <td className="p-2 text-[#C89B3C] font-bold">{u.user_id}</td>
                            <td className="p-2">{u.full_name}</td>
                            <td className="p-2 text-gray-300">{u.email}</td>
                            <td className="p-2">{u.phone}</td>
                            <td className="p-2 text-emerald-400 uppercase font-bold text-[10px]">{u.role}</td>
                            <td className="p-2">{u.login_count || 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. CATALOG PRODUCTS TABLE */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-montserrat text-[#D4AF7F] block">
                    2. SQL `products` Table ({getSQLProducts().length} Featured Items)
                  </span>
                  <div className="overflow-x-auto bg-[#0F0F0F] rounded-2xl border border-gray-800 p-3">
                    <table className="w-full text-left font-mono">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-800 text-[11px]">
                          <th className="p-2">product_id</th>
                          <th className="p-2">product_name</th>
                          <th className="p-2">category</th>
                          <th className="p-2">price</th>
                          <th className="p-2">stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSQLProducts().map(p => (
                          <tr key={p.product_id} className="border-b border-gray-800/50 hover:bg-[#1A1A1A] text-gray-200">
                            <td className="p-2 text-[#C89B3C] font-bold">{p.product_id}</td>
                            <td className="p-2">{p.product_name}</td>
                            <td className="p-2 text-gray-400">{p.category}</td>
                            <td className="p-2 text-[#FCE4EC]">₹{p.price}</td>
                            <td className="p-2">{p.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
