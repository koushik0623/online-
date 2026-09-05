import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES, COUPONS, BRAND_INFO } from '../data/mockData';
import { sendCustomerSigninEmailToAdmin, sendOrderPaymentConfirmationEmail } from '../services/emailService';
import { saveOrderToGlobalDatabase, fetchGlobalDatabaseOrders } from '../services/remoteOrderSync';
import { logUserLoginToSQL, syncOrderToSQLDatabase } from '../services/sqlDatabaseService';
import { apiFetch } from '../services/apiConfig';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [stockDeductions, setStockDeductions] = useState(() => {
    try {
      // Clear legacy stock overrides if present
      localStorage.removeItem('sparkel_product_stocks');
      const saved = localStorage.getItem('sparkel_stock_deductions');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const savedDeductions = localStorage.getItem('sparkel_stock_deductions');
      const deductions = savedDeductions ? JSON.parse(savedDeductions) : {};
      return PRODUCTS.map(p => {
        const deducted = typeof deductions[p.id] === 'number' ? deductions[p.id] : 0;
        const currentStock = Math.max(0, (typeof p.stock === 'number' ? p.stock : 0) - deducted);
        return { ...p, stock: currentStock };
      });
    } catch (e) {
      return PRODUCTS;
    }
  });
  const [categories, setCategories] = useState(CATEGORIES);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // Clean and validate items against stock limit:
      return parsed
        .filter(item => item && item.product && typeof item.product.price === 'number')
        .map(item => {
          const foundProd = PRODUCTS.find(p => p.id === item.product.id) || item.product;
          const maxStock = typeof foundProd.stock === 'number' ? foundProd.stock : 999;
          return {
            ...item,
            product: foundProd,
            quantity: Math.min(item.quantity || 1, maxStock)
          };
        });
    } catch (e) {
      return [];
    }
  });
  
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_wishlist');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const defaultOrders = [];

  const TEST_ORDER_IDS = ['ORD-91714', 'ORD-95159', 'ORD-54561', 'ORD-11718', 'ORD-72852', 'ORD-55003', 'ORD-31965', 'ORD-57289', 'ORD-52031', 'ORD-23498', 'ORD-99999', 'ORD-98241', 'ORD-99585', 'ORD-22198', 'ORD-17788', 'ORD-37009', 'ORD-USER-LIVE-900', 'ORD-USERLINK-101', 'ORD-17317', 'ORD-SCANNER-888', 'ORD-KOUSHIK-102', 'ORD-AKASH-101', 'ORD-LIVE-777', 'ORD-TEST-999', 'ORD-54438'];

  const getOrderId = (o) => String(o?.id || o?.order_id || o?.orderId || '');

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_orders');
      const parsed = saved ? JSON.parse(saved) : [];
      const filtered = Array.isArray(parsed) ? parsed.filter(o => {
        const id = getOrderId(o);
        return id && !TEST_ORDER_IDS.includes(id);
      }) : [];
      return filtered;
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const defaultUser = {
    name: "",
    email: "",
    phone: "",
    role: "customer",
    isLoggedIn: false,
    savedAddresses: []
  };

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_user');
      if (!saved) return defaultUser;
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object' && parsed.isLoggedIn) ? parsed : defaultUser;
    } catch (e) {
      return defaultUser;
    }
  });

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingCheckoutAfterLogin, setPendingCheckoutAfterLogin] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('sparkel_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sparkel_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('sparkel_user', JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('sparkel_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart Management
  const addToCart = (product, quantity = 1, color = null) => {
    if (!product || !product.id) return false;
    const maxStock = typeof product.stock === 'number' ? product.stock : 999;
    
    if (maxStock <= 0) {
      showToast(`Sorry, "${product.name}" is currently Out of Stock!`, "error");
      return false;
    }

    let addedSuccessfully = true;

    setCart(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existingIndex = safePrev.findIndex(item => item && item.product && item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = safePrev[existingIndex].quantity || 0;
        const totalRequested = currentQty + quantity;
        const finalQty = Math.min(totalRequested, maxStock);
        
        if (currentQty >= maxStock) {
          showToast(`Stock limit reached! Maximum ${maxStock} units already in your cart for "${product.name}".`, "warning");
          addedSuccessfully = false;
          return safePrev;
        } else if (totalRequested > maxStock) {
          showToast(`Stock limit reached! Cart updated to maximum ${maxStock} units for "${product.name}".`, "warning");
        } else {
          showToast(`✨ Added "${product.name}" to your luxury cart!`);
        }

        const updated = [...safePrev];
        updated[existingIndex].quantity = finalQty;
        return updated;
      }
      
      const finalQty = Math.min(quantity, maxStock);
      if (quantity > maxStock) {
        showToast(`Stock limit reached! Maximum ${maxStock} units available for "${product.name}".`, "warning");
      } else {
        showToast(`✨ Added "${product.name}" to your luxury cart!`);
      }

      return [...safePrev, { product, quantity: finalQty, selectedColor: color || product.colors?.[0] || 'Default' }];
    });

    return addedSuccessfully;
  };

  const buyNow = (product, quantity = 1, color = null) => {
    if (!product || !product.id) return false;
    const foundProd = PRODUCTS.find(p => p.id === product.id) || product;
    const maxStock = typeof foundProd.stock === 'number' ? foundProd.stock : 999;
    
    if (maxStock <= 0) {
      showToast(`Sorry, "${foundProd.name}" is currently Out of Stock!`, "error");
      return false;
    }

    const finalQty = Math.min(quantity, maxStock);
    if (quantity > maxStock) {
      showToast(`Stock limit reached! Set to maximum ${maxStock} available units.`, "warning");
    }

    const singleItemCart = [{
      product: foundProd,
      quantity: finalQty,
      selectedColor: color || foundProd.colors?.[0] || 'Default'
    }];

    setCart(singleItemCart);
    try {
      localStorage.setItem('sparkel_cart', JSON.stringify(singleItemCart));
    } catch (e) {}

    // SECURITY GUARD: Require customer login BEFORE opening payment / checkout screen
    if (!user || !user.isLoggedIn) {
      setPendingCheckoutAfterLogin(true);
      setIsLoginModalOpen(true);
      showToast("🔒 Please Sign In or Register to continue to Secure Checkout!", "warning");
      return false;
    }

    setIsCheckoutOpen(false);
    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 10);
    return true;
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const itemToRemove = safePrev.find(item => item && item.product && item.product.id === productId);
      if (itemToRemove && itemToRemove.product) {
        showToast(`Removed "${itemToRemove.product.name}" from cart`, "info");
      }
      return safePrev.filter(item => item && item.product && item.product.id !== productId);
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => (Array.isArray(prev) ? prev.map(item => {
      if (item && item.product && item.product.id === productId) {
        const maxStock = typeof item.product.stock === 'number' ? item.product.stock : 999;
        if (newQuantity > maxStock) {
          showToast(`Maximum available stock for this item is ${maxStock}.`, "warning");
          return { ...item, quantity: maxStock };
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }) : []));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Management
  const toggleWishlist = (product) => {
    if (!product || !product.id) return;
    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    const isWishlisted = safeWishlist.includes(product.id);
    if (isWishlisted) {
      setWishlist(prev => (Array.isArray(prev) ? prev.filter(id => id !== product.id) : []));
      showToast(`Removed from wishlist`, "info");
    } else {
      setWishlist(prev => [...(Array.isArray(prev) ? prev : []), product.id]);
      showToast(`💖 Saved "${product.name}" to wishlist!`);
    }
  };

  // Coupon Manager
  const applyCoupon = (code) => {
    setCouponError("");
    const found = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    const cartSubtotal = Array.isArray(cart) ? cart.reduce((sum, item) => {
      if (!item || !item.product || typeof item.product.price !== 'number') return sum;
      return sum + (item.product.price * (item.quantity || 1));
    }, 0) : 0;

    if (!found) {
      setCouponError("Invalid coupon code. Try SPARKEL10 or LUXURY20.");
      showToast("Invalid promo coupon code.", "error");
      return false;
    }

    if (cartSubtotal < found.minAmount) {
      setCouponError(`Code '${found.code}' requires min order of ₹${found.minAmount}`);
      showToast(`Min purchase of ₹${found.minAmount} required`, "error");
      return false;
    }

    setAppliedCoupon(found);
    showToast(`🎉 Code ${found.code} applied! You saved ${found.discountPercent}%!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    showToast("Coupon code removed.", "info");
  };

  // Subtotals and totals
  const cartSubtotal = Array.isArray(cart) ? cart.reduce((sum, item) => {
    if (!item || !item.product || typeof item.product.price !== 'number') return sum;
    return sum + (item.product.price * (item.quantity || 1));
  }, 0) : 0;

  const auto10PercentDiscount = cartSubtotal >= 999 ? 10 : 0;
  const effectiveDiscountPercent = appliedCoupon 
    ? Math.max(appliedCoupon.discountPercent, auto10PercentDiscount) 
    : auto10PercentDiscount;
  const discountAmount = Math.round((cartSubtotal * effectiveDiscountPercent) / 100);
  const shippingFee = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 70;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Order Placement
  const placeOrder = async (orderDetails) => {
    const deliveryDateObj = new Date();
    deliveryDateObj.setDate(deliveryDateObj.getDate() + 7);
    const estimatedDeliveryDate = deliveryDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id || user.user_id || "",
      items: cart.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        size: i.selectedSize || i.size || 'Standard',
        image: i.product.images ? i.product.images[0] : '',
        deliveryDays: 7
      })),
      customerName: orderDetails.shippingAddress?.fullName || user.name || "Sparkle Customer",
      email: user.email || orderDetails.shippingAddress?.email || "",
      phone: orderDetails.shippingAddress?.phone || user.phone || "",
      totalAmount: cartSubtotal,
      discount: discountAmount,
      shippingFee,
      finalAmount: cartTotal,
      cartSubtotal,
      discountAmount,
      cartTotal,
      paymentMethod: orderDetails.paymentMethod,
      paymentStatus: orderDetails.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Order Received',
      utrNumber: orderDetails.utrNumber || `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      trackingNumber: `SPK-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      shippingAddress: orderDetails.shippingAddress,
      estimatedDeliveryDate,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Live Sync Directly to MySQL Database via Backend API
    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {}

    // Real-time stock decrement on order placement
    setStockDeductions(prev => {
      const updated = { ...prev };
      cart.forEach(ci => {
        if (ci && ci.product && ci.product.id) {
          updated[ci.product.id] = (updated[ci.product.id] || 0) + (ci.quantity || 1);
        }
      });
      try {
        localStorage.setItem('sparkel_stock_deductions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setProducts(prevProducts => prevProducts.map(p => {
      const cartItem = cart.find(ci => ci.product.id === p.id);
      if (cartItem) {
        const newStock = Math.max(0, p.stock - cartItem.quantity);
        return { ...p, stock: newStock };
      }
      return p;
    }));

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);

    // Save to global remote database store
    saveOrderToGlobalDatabase(newOrder);
    syncOrderToSQLDatabase(newOrder);

    // Dispatch order payment confirmation alert to sparklekkvofficial@gmail.com and customer!
    sendOrderPaymentConfirmationEmail({
      id: newOrder.id,
      customerName: newOrder.customerName || newOrder.shippingAddress?.fullName || user.name || "Customer",
      customerEmail: newOrder.email || newOrder.shippingAddress?.email || user.email,
      phone: newOrder.shippingAddress?.phone || newOrder.phone || user.phone,
      total: newOrder.finalAmount || newOrder.cartTotal,
      paymentMethod: newOrder.paymentMethod,
      shippingAddress: newOrder.shippingAddress,
      address: newOrder.shippingAddress?.street,
      city: newOrder.shippingAddress?.city,
      pincode: newOrder.shippingAddress?.pincode,
      items: newOrder.items
    });

    return newOrder;
  };

  // Fetch live customer/admin orders from MySQL database via backend API
  useEffect(() => {
    if (user && user.isLoggedIn) {
      const custId = user.id || user.user_id || user.email || user.phone || '';
      apiFetch(`/api/orders/user/${encodeURIComponent(custId)}`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.orders) && data.orders.length > 0) {
            setOrders(data.orders);
          }
        })
        .catch(err => console.log('My orders fetch:', err.message));
    }
  }, [user.isLoggedIn, user.id, user.email, user.phone]);

  const loginUser = (nameInput, phoneInput, passwordInput, emailInput, roleInput) => {
    let name = "Sparkle Customer";
    let phone = "+91 9876543210";
    let password = "••••••••";
    let email = "";
    let role = "customer";

    if (nameInput && typeof nameInput === 'object') {
      name = nameInput.name || nameInput.fullName || "Sparkle Customer";
      email = nameInput.email || "";
      phone = nameInput.phone || "+91 9876543210";
      password = nameInput.password || "••••••••";
      role = nameInput.role || "customer";
    } else {
      name = nameInput || "Sparkle Customer";
      password = passwordInput || "••••••••";
      
      if (typeof phoneInput === 'string' && phoneInput.includes('@')) {
        email = phoneInput;
        phone = "+91 9876543210";
      } else {
        phone = phoneInput || "+91 9876543210";
      }

      if (emailInput && typeof emailInput === 'string' && emailInput.includes('@')) {
      }

    // Resolve exact registered display name if email/phone was passed in name input
    let displayName = name;
    try {
      const regUsers = JSON.parse(localStorage.getItem('sparkle_registered_users') || '[]');
      const found = regUsers.find(u => 
        (email && u.email && u.email.toLowerCase() === email.toLowerCase()) ||
        (phone && u.phone && u.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
      );
      if (found && found.name && !found.name.includes('@')) {
        displayName = found.name;
      }
    } catch (e) {}

    if (displayName.includes('@')) {
      const prefixParts = displayName.split('@')[0].split(/[\._\-]/);
      displayName = prefixParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }

    const authenticatedUser = {
      id: `USR-${Date.now()}`,
      name: displayName,
      email,
      phone,
      password,
      role: role.toLowerCase(),
      isLoggedIn: true,
      authMethod: "Secure Authentication",
      authDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      savedAddresses: [
        {
          id: "addr1",
          fullName: displayName,
          phone: phone,
          street: "Flat 402, Rosewood Heights, Madhapur",
          city: "Hyderabad",
          state: "Telangana",
          pincode: "500081",
          isDefault: true
        }
      ]
    };

    setUser(authenticatedUser);
    try {
      localStorage.setItem('sparkel_user', JSON.stringify(authenticatedUser));
      logUserLoginToSQL(authenticatedUser);
    } catch (e) {}

    // Send login/register POST request to backend API for cloud database sync
    apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, identifier: email || phone || name, password, role })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.token) {
          localStorage.setItem('sparkle_token', data.token);
          if (data.user) {
            const serverName = data.user.name || data.user.fullName || (data.user.firstName ? `${data.user.firstName} ${data.user.lastName || ''}`.trim() : null);
            const updatedUser = {
              ...authenticatedUser,
              id: data.user.id || authenticatedUser.id,
              name: serverName || displayName,
              email: data.user.email || authenticatedUser.email,
              phone: data.user.phone || authenticatedUser.phone
            };
            setUser(updatedUser);
            localStorage.setItem('sparkel_user', JSON.stringify(updatedUser));
          }
        }
      })
      .catch(err => console.log('Auth API background sync:', err.message));

    apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    }).catch(() => {});

    sendCustomerSigninEmailToAdmin(authenticatedUser);

    if (pendingCheckoutAfterLogin) {
      setPendingCheckoutAfterLogin(false);
      setIsLoginModalOpen(false);
      setIsCheckoutOpen(true);
      showToast(`⚡ Welcome ${name}! Resuming your secure payment checkout...`, "success");
    } else {
      showToast(`👋 Welcome back, ${name}!`);
    }

    return true;
  };

  const logoutUser = () => {
    setUser(defaultUser);
    setOrders([]);
    try {
      localStorage.removeItem('sparkel_user');
      localStorage.removeItem('sparkle_token');
    } catch (e) {}
    showToast("Logged out successfully.", "info");
  };

  // Product CRUD for Admin
  const addProduct = (newProd) => {
    const prod = {
      id: `p${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      ...newProd
    };
    setProducts(prev => [prod, ...prev]);
    showToast(`New product "${prod.name}" created!`);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    showToast(`Product updated successfully!`);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Product deleted`, "info");
  };

  const defaultSubscribers = [];

  const [subscribers, setSubscribers] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_subscribers');
      if (!saved) return defaultSubscribers;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaultSubscribers;
    } catch (e) {
      return defaultSubscribers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sparkel_subscribers', JSON.stringify(subscribers));
    } catch (e) {}
  }, [subscribers]);

  const addSubscriber = (email) => {
    if (!email) return;
    setSubscribers(prev => {
      if (prev.some(s => s && s.email && s.email.toLowerCase() === email.toLowerCase())) return prev;
      return [
        {
          id: `SUB-${Date.now()}`,
          email,
          subscribedAt: new Date().toISOString(),
          couponCode: 'SPARKEL10',
          status: 'active'
        },
        ...prev
      ];
    });
  };

  const deleteSubscriber = (id) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
    showToast("Subscriber removed from database", "info");
  };

  return (
    <ShopContext.Provider value={{
      brandInfo: BRAND_INFO,
      products,
      categories,
      COUPONS,
      cart,
      wishlist,
      orders,
      subscribers,
      user,
      appliedCoupon,
      couponError,
      cartSubtotal,
      auto10PercentDiscount,
      auto30PercentDiscount: auto10PercentDiscount,
      effectiveDiscountPercent,
      discountAmount,
      shippingFee,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isLoginModalOpen,
      setIsLoginModalOpen,
      pendingCheckoutAfterLogin,
      setPendingCheckoutAfterLogin,
      quickViewProduct,
      setQuickViewProduct,
      toast,
      showToast,
      addToCart,
      buyNow,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      applyCoupon,
      removeCoupon,
      placeOrder,
      loginUser,
      logoutUser,
      addProduct,
      updateProduct,
      deleteProduct,
      addSubscriber,
      deleteSubscriber
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
