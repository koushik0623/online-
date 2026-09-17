import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Banknote, QrCode, Sparkles, Copy, Smartphone, Video, Truck, MessageSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { apiFetch } from '../services/apiConfig';
import { sha512 } from 'js-sha512';
import exactScannerImg from '../assets/phonepe_scanner_exact.png';
import { getDirectImageUrl } from '../utils/imageUtils';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    user,
    placeOrder,
    clearCart,
    showToast
  } = useShop();

  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment, 3: Confirmation
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.savedAddresses?.[0]?.street || '',
    city: user?.savedAddresses?.[0]?.city || '',
    state: user?.savedAddresses?.[0]?.state || '',
    pincode: user?.savedAddresses?.[0]?.pincode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('GPay'); // 'GPay', 'Paytm', 'PhonePe', 'Supermoney', 'PayU'
  const [utrInput, setUtrInput] = useState('');
  const [isPayULoading, setIsPayULoading] = useState(false);

  React.useLayoutEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setPlacedOrderInfo(null);
      setPaymentError('');
      setUtrInput('');
      setIsPayULoading(false);
    }
  }, [isCheckoutOpen, cart]);

  const handleCloseModal = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setPlacedOrderInfo(null);
    setPaymentError('');
    setUtrInput('');
    setIsPayULoading(false);
  };

  const handleDirectWhatsAppCheckout = () => {
    if (!cart || cart.length === 0) return;

    const itemsText = cart.map((item, index) => {
      const colorText = item.selectedColor ? ` (Color: ${item.selectedColor})` : '';
      const itemSubtotal = (item.product.price || 0) * (item.quantity || 1);
      const rawImg = item.product.images?.[0] || '';
      const directImgUrl = getDirectImageUrl(rawImg);

      let fullImgUrl = '';
      if (directImgUrl) {
        if (directImgUrl.startsWith('http')) {
          fullImgUrl = directImgUrl;
        } else if (!directImgUrl.startsWith('data:')) {
          const cleanPath = directImgUrl.replace(/^\//, '');
          fullImgUrl = `https://sparklekkv.com/${cleanPath}`;
        }
      }

      const imageLine = fullImgUrl ? `\n   🖼️ *Product Photo:* ${fullImgUrl}` : '';
      return `${index + 1}. *${item.product.name}*${colorText}\n   Qty: ${item.quantity} × ₹${item.product.price} = ₹${itemSubtotal}${imageLine}`;
    }).join('\n\n');

    const customerNameText = shippingForm.fullName ? `👤 *Customer Name:* ${shippingForm.fullName}\n` : (user?.name ? `👤 *Customer Name:* ${user.name}\n` : '');
    const customerPhoneText = shippingForm.phone ? `📱 *Phone:* ${shippingForm.phone}\n` : (user?.phone ? `📱 *Phone:* ${user.phone}\n` : '');
    const addressText = shippingForm.street ? `📍 *Address:* ${shippingForm.street}, ${shippingForm.city || ''} ${shippingForm.pincode || ''}\n` : '';

    const message = 
`✨ *NEW ORDER REQUEST - SPARKLE @KKV* ✨

${customerNameText}${customerPhoneText}${addressText}🛒 *Order Items (${cart.reduce((sum, i) => sum + i.quantity, 0)} items):*
${itemsText}

-----------------------------
💵 *Bag Subtotal:* ₹${cartSubtotal}
${discountAmount > 0 ? `🏷️ *Discount:* -₹${discountAmount}\n` : ''}🚚 *Shipping Fee:* ${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
💰 *Total Amount:* *₹${cartTotal}*
-----------------------------

Please confirm my order and share payment details!`;

    try {
      placeOrder({
        shippingAddress: shippingForm,
        paymentMethod: "WhatsApp Direct Order",
        paymentStatus: "Pending WhatsApp Confirmation",
        orderStatus: "Order Received",
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal
      });
    } catch (e) {}

    showToast("📱 Opening WhatsApp directly with live product photos...", "success");
    setIsCheckoutOpen(false);

    const whatsappUrl = `https://wa.me/919949157771?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isCheckoutOpen) return null;

  // Generate UPI Deep Links for GPay, Paytm, PhonePe & SuperMoney with exact order total
  const upiDeepLink = `upi://pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;
  const gpayLink = `gpay://upi/pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;
  const paytmLink = `paytmmp://pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;
  const phonepeLink = `phonepe://pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;
  const supermoneyLink = `supermoney://pay?pa=sparklekkv@ibl&pn=Sparkle%20@kkv&am=${cartTotal}&cu=INR&tn=Sparkle%20Order%20Payment`;

  const copyUpiId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('sparklekkv@ibl');
      showToast("Copied UPI ID sparklekkv@ibl!");
    }
  };

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleAppPaymentClick = (e, appName, deepLink) => {
    e.stopPropagation();
    if (isMobileDevice()) {
      window.location.href = deepLink;
    } else {
      copyUpiId();
    }
    showToast(`📱 ${appName} opened! After payment, enter your 12-digit UTR/Ref number below.`);
  };

  // Official Dynamic PayU Hosted Checkout Submit Handler
  const handlePayUPayment = async () => {
    setPaymentError('');
    setIsPayULoading(true);
    showToast('🔒 Connecting to PayU Secure Payment Gateway...');

    try {
      let params = null;
      let payuUrl = 'https://secure.payu.in/_payment';
      const cleanFirstName = (shippingForm.fullName || user?.name || 'Customer').trim().split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'Customer';
      const cleanEmail = (shippingForm.email || user?.email || 'customer@sparklekkv.com').trim();
      const cleanPhone = (shippingForm.phone || user?.phone || '9949157771').replace(/\D/g, '').slice(-10) || '9949157771';
      const cleanProductInfo = `SparkleAccessories${cart.length}items`;

      // 1. Call Backend Order Creation & SHA-512 PayU Hash API
      try {
        const response = await apiFetch('/payment/payu/create', {
          method: 'POST',
          body: JSON.stringify({
            amount: cartTotal,
            firstname: cleanFirstName,
            email: cleanEmail,
            phone: cleanPhone,
            productinfo: cleanProductInfo,
            cartItems: cart,
            shippingAddress: shippingForm,
            customerId: user?.id || user?.user_id
          })
        });

        const data = await response.json();
        if (data && data.success && data.params) {
          params = data.params;
          if (data.payuUrl) payuUrl = data.payuUrl;
        }
      } catch (err) {
        console.warn('Backend payu/create fetch warning:', err.message);
      }

      // 2. Pure JS SHA-512 Fallback if backend API endpoint not reached
      if (!params) {
        const key = '8izKVp';
        const salt = 'Do2eaSyvC2mBV7HoEPGiiYpaVxsSSmGl';
        const txnId = `SPK-${Date.now()}`;
        const cleanAmount = Number(cartTotal || 0).toFixed(2);
        const hashString = `${key}|${txnId}|${cleanAmount}|${cleanProductInfo}|${cleanFirstName}|${cleanEmail}|||||||||||${salt}`;
        const hash = sha512(hashString);

        params = {
          key,
          txnid: txnId,
          amount: cleanAmount,
          productinfo: cleanProductInfo,
          firstname: cleanFirstName,
          email: cleanEmail,
          phone: cleanPhone,
          surl: 'https://sparkle-backend.onrender.com/api/payments/payu/success',
          furl: 'https://sparkle-backend.onrender.com/api/payments/payu/failure',
          hash,
          service_provider: 'payu_paisa',
          udf1: '', udf2: '', udf3: '', udf4: '', udf5: ''
        };
      }

      showToast('🔒 Redirecting to PayU Secure Gateway...');
      if (typeof setIsCheckoutOpen === 'function') {
        setIsCheckoutOpen(false);
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payuUrl;

      Object.keys(params).forEach((k) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = params[k];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('PayU Submit Error:', err);
      setPaymentError('❌ Connection error with PayU Gateway. Please try again.');
      setIsPayULoading(false);
    }
  };

  const PAYU_PREPAYMENT_LINK = 'https://payu.in/pay/285702A153E4F3C350185F77B97F6B6C';

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingForm.fullName || !shippingForm.phone || !shippingForm.street || !shippingForm.pincode) {
      showToast("Please fill in all address details", "error");
      return;
    }

    showToast("🔒 Opening PayU Payment Page...");

    const cleanFirstName = (shippingForm.fullName || user?.name || 'Customer').trim().split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'Customer';
    const cleanEmail = (shippingForm.email || user?.email || 'customer@sparklekkv.com').trim();
    const cleanPhone = (shippingForm.phone || user?.phone || '9949157771').replace(/\D/g, '').slice(-10) || '9949157771';

    // 1. Store pending checkout details in sessionStorage (Order placed ONLY after payment completion)
    try {
      sessionStorage.setItem('sparkle_pending_checkout', JSON.stringify({
        cartItems: cart,
        shippingAddress: shippingForm,
        cartTotal,
        customerName: shippingForm.fullName,
        phone: cleanPhone,
        email: cleanEmail,
        customerId: user?.id || user?.user_id
      }));
    } catch (err) {}

    setIsCheckoutOpen(false);

    // 2. Open official PayU Payment Link (Cart & Order placed after payment is DONE)
    const targetUrl = `${PAYU_PREPAYMENT_LINK}?amount=${encodeURIComponent(cartTotal)}`;
    window.location.href = targetUrl;
  };

  const handleVerifyAndCompleteOrder = async () => {
    setPaymentError('');

    const cleanUtr = utrInput.trim();
    if (!cleanUtr || !/^\d{12}$/.test(cleanUtr)) {
      setPaymentError('⚠️ Payment Verification Required: Please complete your payment in PhonePe / GPay and enter your valid 12-digit numeric Payment UTR / Ref Number (e.g. 429182749102) from your receipt before submitting.');
      showToast('Please enter your 12-digit Payment UTR Number', 'error');
      return;
    }

    // Perform Server-to-Server Payment Status Verification
    let isVerified = false;
    let verifiedUtrNumber = cleanUtr;

    try {
      const verifyRes = await apiFetch('/api/payments/verify-status', {
        method: 'POST',
        body: JSON.stringify({
          transactionId: cleanUtr,
          utrNumber: cleanUtr
        })
      });

      if (verifyRes && verifyRes.ok) {
        const verifyData = await verifyRes.json();
        if (verifyData && verifyData.success === true) {
          isVerified = true;
          verifiedUtrNumber = verifyData.utrNumber || cleanUtr;
        } else {
          setPaymentError(verifyData?.error || '❌ Payment Verification Failed: No verified payment found for this UTR.');
          showToast('Payment verification failed.', 'error');
          return;
        }
      } else {
        const errData = await verifyRes.json().catch(() => ({}));
        setPaymentError(errData?.error || '❌ Payment Verification Failed: Invalid 12-digit UTR number.');
        showToast('Payment verification failed.', 'error');
        return;
      }
    } catch (e) {
      setPaymentError('❌ Server verification connection error. Your order was NOT placed.');
      showToast('Payment verification connection error.', 'error');
      return;
    }

    if (!isVerified) {
      setPaymentError('❌ Payment not verified by server. Your order was NOT placed.');
      return;
    }

    // Authenticate customer if not already logged in
    if (!user || !user.isLoggedIn) {
      await loginUser(
        shippingForm.fullName || "Sparkle Customer",
        shippingForm.phone || "+91 9876543210",
        "••••••••",
        shippingForm.email || `${(shippingForm.fullName || 'customer').toLowerCase().replace(/\s+/g, '')}@sparklekkv.com`
      );
    }

    const newOrder = await placeOrder({
      shippingAddress: shippingForm,
      paymentMethod: paymentMethod === 'PhonePe' ? 'PhonePe UPI Payment' : paymentMethod,
      paymentStatus: 'Paid',
      orderStatus: 'ORDER_RECEIVED',
      utrNumber: verifiedUtrNumber,
      cartSubtotal,
      discountAmount,
      shippingFee,
      cartTotal
    });

    setPlacedOrderInfo(newOrder);
    setStep(3);
    showToast(`🎉 Payment Verified & Order Placed Successfully for ${shippingForm.fullName}!`, "success");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#FCE4EC] my-auto font-poppins relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-montserrat tracking-widest uppercase font-bold">
              <strong className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</strong> <span className="text-[#2C2C2C] bg-white/90 px-1 py-0.5 rounded text-[9px] font-extrabold lowercase font-poppins ml-0.5">@kkv</span> Secure Checkout
            </span>
            <h2 className="font-serif-luxury text-xl font-bold">
              {step === 1 && "Shipping & Delivery Address"}
              {step === 2 && "Payment Options"}
              {step === 3 && "Order Placed & Received Successfully!"}
            </h2>
          </div>

          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Summary Bar */}
        {cart.length > 0 && (
          <div className="bg-[#FFF9F5] px-4 sm:px-6 py-2.5 border-b border-[#FCE4EC] flex items-center justify-between text-xs font-poppins shrink-0">
            <span className="text-gray-600 font-medium">
              Checkout Items: <strong className="text-[#2C2C2C]">{cart.length} Product{cart.length > 1 ? 's' : ''} ({cart.reduce((s, i) => s + i.quantity, 0)} Units)</strong>
            </span>
          </div>
        )}

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">1. Delivery Details</h3>
              </div>

              {/* Instant WhatsApp Order Prompt Banner */}
              <div className="bg-[#DCF8C6]/90 border-2 border-emerald-500/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 text-xs text-emerald-950 font-poppins">
                  <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-xs">Want to order directly on WhatsApp?</span>
                    <span className="text-[11px] text-emerald-800">Send cart items instantly to +91 9949157771</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDirectWhatsAppCheckout}
                  className="bg-[#25D366] hover:bg-[#1ebd59] text-white font-montserrat font-bold py-2 px-4 rounded-xl text-xs shadow-sm transition-transform active:scale-95 shrink-0 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>

              <form onSubmit={handleShippingSubmit} className="space-y-4 text-xs font-poppins">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 9876543210"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="customer@example.com"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Street Address / Flat No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat No, Building Name, Street / Area (e.g. Madhapur)"
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Telangana"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="500081"
                      value={shippingForm.pincode}
                      onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl p-3 focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isPayULoading}
                    className="w-full sm:w-auto bg-[#2C2C2C] hover:bg-[#C89B3C] text-white px-8 py-3.5 rounded-full font-montserrat font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isPayULoading ? 'Connecting to PayU...' : 'Proceed to Payment'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Swiggy-Style Payment Options */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C]">2. Select Payment Method</h3>
                  <p className="text-[11px] text-gray-500 font-poppins">Choose your preferred payment option (Total: <strong className="text-[#C89B3C]">₹{cartTotal}</strong>)</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-montserrat flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% SECURE
                </span>
              </div>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-poppins font-medium animate-bounce">
                  {paymentError}
                </div>
              )}

              <div className="space-y-3 font-poppins">
                
                {/* OPTION 1: Google Pay (GPay) */}
                <div
                  onClick={() => setPaymentMethod('GPay')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'GPay' ? 'border-[#4285F4] bg-[#F4F8FF] shadow-md ring-2 ring-[#4285F4]/30' : 'border-gray-200 bg-white hover:border-[#4285F4]/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center font-bold text-sm">
                        🔵
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#2C2C2C] flex items-center gap-1.5">
                          Google Pay (GPay)
                          <span className="text-[9px] bg-[#4285F4] text-white font-bold px-2 py-0.5 rounded-full">POPULAR</span>
                        </span>
                        <p className="text-[10px] text-gray-500">1-Tap Instant UPI Payment • Auto-fills ₹{cartTotal}</p>
                      </div>
                    </div>
                    <input type="radio" checked={paymentMethod === 'GPay'} onChange={() => {}} className="accent-[#4285F4] w-4 h-4" />
                  </div>

                  {paymentMethod === 'GPay' && (
                    <div className="mt-4 pt-4 border-t border-[#4285F4]/20 space-y-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleAppPaymentClick(e, 'Google Pay', gpayLink)}
                        className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white py-3 px-4 rounded-xl text-xs font-bold font-montserrat shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>🔵 Pay ₹{cartTotal} directly using Google Pay App</span>
                      </button>

                      {/* Dynamic QR & UTR Section */}
                      <div className="max-w-[260px] mx-auto rounded-2xl p-3 bg-white border-2 border-[#4285F4] shadow-sm space-y-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Or Scan GPay QR Code</span>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(gpayLink)}`}
                          alt="GPay QR Code"
                          className="w-40 h-40 mx-auto object-contain"
                        />
                        <p className="text-[11px] text-gray-700 font-medium">UPI ID: <strong className="text-[#4285F4]">sparklekkv@ibl</strong></p>
                        <div className="text-left space-y-1 pt-1">
                          <label className="block text-[10px] font-bold text-[#4285F4] uppercase">Enter 12-Digit GPay Payment Ref/UTR *</label>
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="e.g. 429182749102"
                            value={utrInput}
                            onChange={(e) => setUtrInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white border border-[#4285F4] rounded-lg p-2 text-xs font-mono text-center font-bold tracking-widest focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION 2: Paytm */}
                <div
                  onClick={() => setPaymentMethod('Paytm')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'Paytm' ? 'border-[#00BAF2] bg-[#F0FCFF] shadow-md ring-2 ring-[#00BAF2]/30' : 'border-gray-200 bg-white hover:border-[#00BAF2]/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#00BAF2]/10 text-[#00BAF2] flex items-center justify-center font-bold text-sm">
                        🟦
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#2C2C2C] flex items-center gap-1.5">
                          Paytm UPI & Wallet
                          <span className="text-[9px] bg-[#00BAF2] text-white font-bold px-2 py-0.5 rounded-full">INSTANT</span>
                        </span>
                        <p className="text-[10px] text-gray-500">Paytm Wallet & Direct UPI • Auto-fills ₹{cartTotal}</p>
                      </div>
                    </div>
                    <input type="radio" checked={paymentMethod === 'Paytm'} onChange={() => {}} className="accent-[#00BAF2] w-4 h-4" />
                  </div>

                  {paymentMethod === 'Paytm' && (
                    <div className="mt-4 pt-4 border-t border-[#00BAF2]/20 space-y-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleAppPaymentClick(e, 'Paytm', paytmLink)}
                        className="w-full bg-[#00BAF2] hover:bg-[#0095c4] text-white py-3 px-4 rounded-xl text-xs font-bold font-montserrat shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>🟦 Pay ₹{cartTotal} directly using Paytm App</span>
                      </button>

                      {/* Dynamic QR & UTR Section */}
                      <div className="max-w-[260px] mx-auto rounded-2xl p-3 bg-white border-2 border-[#00BAF2] shadow-sm space-y-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Or Scan Paytm QR Code</span>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(paytmLink)}`}
                          alt="Paytm QR Code"
                          className="w-40 h-40 mx-auto object-contain"
                        />
                        <p className="text-[11px] text-gray-700 font-medium">UPI ID: <strong className="text-[#00BAF2]">sparklekkv@ibl</strong></p>
                        <div className="text-left space-y-1 pt-1">
                          <label className="block text-[10px] font-bold text-[#00BAF2] uppercase">Enter 12-Digit Paytm Payment Ref/UTR *</label>
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="e.g. 429182749102"
                            value={utrInput}
                            onChange={(e) => setUtrInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white border border-[#00BAF2] rounded-lg p-2 text-xs font-mono text-center font-bold tracking-widest focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION 3: PhonePe */}
                <div
                  onClick={() => setPaymentMethod('PhonePe')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'PhonePe' ? 'border-[#5f259f] bg-[#F7F2FC] shadow-md ring-2 ring-[#5f259f]/30' : 'border-gray-200 bg-white hover:border-[#5f259f]/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#5f259f]/10 text-[#5f259f] flex items-center justify-center font-bold text-sm">
                        🟣
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#2C2C2C] flex items-center gap-1.5">
                          PhonePe UPI & QR
                          <span className="text-[9px] bg-[#5f259f] text-white font-bold px-2 py-0.5 rounded-full">RECOMMENDED</span>
                        </span>
                        <p className="text-[10px] text-gray-500">PhonePe App Direct UPI • Auto-fills ₹{cartTotal}</p>
                      </div>
                    </div>
                    <input type="radio" checked={paymentMethod === 'PhonePe'} onChange={() => {}} className="accent-[#5f259f] w-4 h-4" />
                  </div>

                  {paymentMethod === 'PhonePe' && (
                    <div className="mt-4 pt-4 border-t border-[#5f259f]/20 space-y-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleAppPaymentClick(e, 'PhonePe', phonepeLink)}
                        className="w-full bg-[#5f259f] hover:bg-[#4a1c7d] text-white py-3 px-4 rounded-xl text-xs font-bold font-montserrat shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>🟣 Pay ₹{cartTotal} directly using PhonePe App</span>
                      </button>

                      {/* Dynamic QR & UTR Section */}
                      <div className="max-w-[260px] mx-auto rounded-2xl p-3 bg-white border-2 border-[#5f259f] shadow-sm space-y-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Or Scan PhonePe QR Code</span>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(phonepeLink)}`}
                          alt="PhonePe QR Code"
                          className="w-40 h-40 mx-auto object-contain"
                        />
                        <p className="text-[11px] text-gray-700 font-medium">UPI ID: <strong className="text-[#5f259f]">sparklekkv@ibl</strong></p>
                        <div className="text-left space-y-1 pt-1">
                          <label className="block text-[10px] font-bold text-[#5f259f] uppercase">Enter 12-Digit PhonePe Payment Ref/UTR *</label>
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="e.g. 429182749102"
                            value={utrInput}
                            onChange={(e) => setUtrInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white border border-[#5f259f] rounded-lg p-2 text-xs font-mono text-center font-bold tracking-widest focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION 4: Supermoney */}
                <div
                  onClick={() => setPaymentMethod('Supermoney')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'Supermoney' ? 'border-[#F59E0B] bg-[#FFFBF0] shadow-md ring-2 ring-[#F59E0B]/30' : 'border-gray-200 bg-white hover:border-[#F59E0B]/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                        🟡
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#2C2C2C] flex items-center gap-1.5">
                          Supermoney UPI
                          <span className="text-[9px] bg-[#F59E0B] text-white font-bold px-2 py-0.5 rounded-full">CASHBACK</span>
                        </span>
                        <p className="text-[10px] text-gray-500">Supermoney UPI Instant Pay & Rewards • Auto-fills ₹{cartTotal}</p>
                      </div>
                    </div>
                    <input type="radio" checked={paymentMethod === 'Supermoney'} onChange={() => {}} className="accent-[#F59E0B] w-4 h-4" />
                  </div>

                  {paymentMethod === 'Supermoney' && (
                    <div className="mt-4 pt-4 border-t border-[#F59E0B]/20 space-y-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleAppPaymentClick(e, 'Supermoney', supermoneyLink)}
                        className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white py-3 px-4 rounded-xl text-xs font-bold font-montserrat shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>🟡 Pay ₹{cartTotal} directly using Supermoney App</span>
                      </button>

                      {/* Dynamic QR & UTR Section */}
                      <div className="max-w-[260px] mx-auto rounded-2xl p-3 bg-white border-2 border-[#F59E0B] shadow-sm space-y-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Or Scan Supermoney QR Code</span>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(supermoneyLink)}`}
                          alt="Supermoney QR Code"
                          className="w-40 h-40 mx-auto object-contain"
                        />
                        <p className="text-[11px] text-gray-700 font-medium">UPI ID: <strong className="text-[#F59E0B]">sparklekkv@ibl</strong></p>
                        <div className="text-left space-y-1 pt-1">
                          <label className="block text-[10px] font-bold text-[#F59E0B] uppercase">Enter 12-Digit Supermoney Ref/UTR *</label>
                          <input
                            type="text"
                            maxLength={12}
                            placeholder="e.g. 429182749102"
                            value={utrInput}
                            onChange={(e) => setUtrInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white border border-[#F59E0B] rounded-lg p-2 text-xs font-mono text-center font-bold tracking-widest focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION 5 (LAST): PayU Payment Gateway Integration (Swiggy Style) */}
                <div
                  onClick={() => setPaymentMethod('PayU')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'PayU' ? 'border-[#C89B3C] bg-gradient-to-r from-[#FFF9F5] via-white to-[#FFF9F5] shadow-lg ring-2 ring-[#C89B3C]/40' : 'border-gray-200 bg-white hover:border-[#C89B3C]/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2C2C2C] to-[#C89B3C] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        💳
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#2C2C2C] flex items-center gap-1.5">
                          PayU Payment Gateway (Credit Card / Debit Card / NetBanking)
                          <span className="text-[9px] bg-gradient-to-r from-[#C89B3C] to-[#2C2C2C] text-white font-bold px-2.5 py-0.5 rounded-full">RECOMMENDED</span>
                        </span>
                        <p className="text-[10px] text-gray-500 font-medium">💳 Credit Card, Debit Card, NetBanking & All UPI Apps</p>
                      </div>
                    </div>
                    <input type="radio" checked={paymentMethod === 'PayU'} onChange={() => {}} className="accent-[#C89B3C] w-4 h-4" />
                  </div>

                  {paymentMethod === 'PayU' && (
                    <div className="mt-4 pt-4 border-t border-[#C89B3C]/30 space-y-4 font-poppins text-xs">
                      
                      {/* Supported Gateways & Credit/Debit Cards */}
                      <div className="bg-white p-3.5 rounded-2xl border border-[#D4AF7F]/30 shadow-xs space-y-2.5">
                        <span className="text-[10px] font-bold text-[#C89B3C] uppercase tracking-wider block">Accepted Cards & Payment Methods:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-700 font-semibold">
                          <div className="bg-[#FFF9F5] p-2 rounded-xl border border-[#D4AF7F]/20 flex items-center gap-2">
                            <span>💳</span>
                            <span>Credit Card & Debit Card</span>
                          </div>
                          <div className="bg-[#FFF9F5] p-2 rounded-xl border border-[#D4AF7F]/20 flex items-center gap-2">
                            <span>🏧</span>
                            <span>Visa, Mastercard, RuPay</span>
                          </div>
                          <div className="bg-[#FFF9F5] p-2 rounded-xl border border-[#D4AF7F]/20 flex items-center gap-2">
                            <span>🏦</span>
                            <span>Net Banking (All Banks)</span>
                          </div>
                          <div className="bg-[#FFF9F5] p-2 rounded-xl border border-[#D4AF7F]/20 flex items-center gap-2">
                            <span>📱</span>
                            <span>UPI & Digital Wallets</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isPayULoading}
                        onClick={handlePayUPayment}
                        className="w-full shimmer-btn bg-gradient-to-r from-[#2C2C2C] via-[#C89B3C] to-[#2C2C2C] text-white py-3.5 px-4 rounded-xl text-xs font-bold font-montserrat uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <span>{isPayULoading ? 'Connecting to PayU Gateway...' : `Proceed to Pay via PayU Gateway (₹${cartTotal})`}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* WhatsApp Payment Screenshot Share Box */}
                <div className="bg-[#DCF8C6]/80 border-2 border-emerald-500 rounded-2xl p-3.5 text-center space-y-2 mt-4 shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-emerald-950 font-montserrat font-bold text-xs">
                    <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant WhatsApp Order Support (+91 9949157771)</span>
                  </div>
                  <a
                    href={`https://wa.me/919949157771?text=${encodeURIComponent(`Hi Sparkle @kkv, I am completing my payment of ₹${cartTotal} via ${paymentMethod}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white font-montserrat font-bold py-2 px-4 rounded-xl text-xs shadow-sm transition-transform active:scale-95 w-full"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Share Payment Confirmation on WhatsApp
                  </a>
                </div>

              </div>

              <div className="pt-3 flex justify-between items-center font-montserrat border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-black font-semibold"
                >
                  ← Back to Address
                </button>

                {paymentMethod !== 'PayU' && (
                  <button
                    type="button"
                    onClick={handleVerifyAndCompleteOrder}
                    className="shimmer-btn bg-gradient-to-r from-emerald-700 via-emerald-800 to-[#2C2C2C] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2"
                  >
                    <span>Confirm Order (₹{cartTotal})</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation */}
          {step === 3 && placedOrderInfo && (
            <div className="text-center space-y-6 py-4 font-poppins">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                ✓
              </div>

              <div className="space-y-1">
                <span className="text-xs font-montserrat uppercase tracking-widest text-[#C89B3C] font-bold">Sparkle @kkv Order Receipt</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">
                  Thank You, {placedOrderInfo.customerName}!
                </h3>
                <p className="text-xs text-gray-500">Order ID: <strong className="text-[#2C2C2C]">{placedOrderInfo.id}</strong></p>
              </div>

              {/* Order Summary Receipt Box */}
              <div className="bg-[#FFF9F5] p-6 rounded-3xl border border-[#FCE4EC] max-w-md mx-auto text-left space-y-3 text-xs">
                
                {/* AMAZON-STYLE PAYMENT DONE & VERIFIED STATUS BADGE */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-2xl space-y-2 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0 animate-pulse" />
                      <div>
                        <span className="text-[10px] font-montserrat uppercase tracking-wider text-emerald-100 font-bold block">Amazon Style Verified Update</span>
                        <strong className="text-base font-extrabold uppercase tracking-wide">YOUR PAYMENT IS DONE!</strong>
                      </div>
                    </div>
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-white/30">
                      Payment Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 font-light border-t border-emerald-500/50 pt-2">
                    ✅ Your payment of <strong>₹{placedOrderInfo.cartTotal}</strong> has been received & verified. Order confirmation sent to <strong>sparklekkvofficial@gmail.com</strong>.
                  </p>
                </div>

                {/* 7-Day Express Delivery Guarantee Box */}
                <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex items-center gap-3 text-emerald-950 font-poppins">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs text-emerald-900 font-bold">🚚 Guaranteed 7-Day Express Delivery</strong>
                    <span className="text-[11px] text-emerald-700">Estimated Delivery Date: <strong className="text-emerald-900">{placedOrderInfo.estimatedDeliveryDate || 'Within 7 Business Days'}</strong></span>
                  </div>
                </div>

                {/* Purchased Items List */}
                <div className="space-y-2 pt-1 border-t border-[#D4AF7F]/20">
                  <span className="text-[10px] font-montserrat uppercase font-bold text-gray-500 block">Purchased Items ({placedOrderInfo.items.length})</span>
                  {placedOrderInfo.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-poppins bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image || "images/plumeria_flower.jpg"} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-[#2C2C2C] text-[11px]">{item.name}</h4>
                          <span className="text-gray-500 text-[10px]">Qty: {item.quantity} × ₹{item.price}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#2C2C2C] text-xs">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-semibold text-gray-700 border-b border-[#D4AF7F]/30 pb-2 pt-2">
                  <span>Items Subtotal</span>
                  <span>₹{placedOrderInfo.cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>10% Special Discount Saved</span>
                  <span>-₹{placedOrderInfo.discountAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Express Shipping Fee</span>
                  <span>{placedOrderInfo.shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${placedOrderInfo.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#2C2C2C] border-t border-[#D4AF7F]/30 pt-2">
                  <span>Total Amount Paid</span>
                  <span className="text-[#C89B3C] font-extrabold text-base">₹{placedOrderInfo.cartTotal}</span>
                </div>
                <div className="pt-2 text-[11px] text-gray-500 font-light border-t border-gray-100 space-y-1">
                  <p><strong>Deliver To:</strong> {placedOrderInfo.shippingAddress.street}, {placedOrderInfo.shippingAddress.city} - {placedOrderInfo.shippingAddress.pincode}</p>
                  <p><strong>Guaranteed Delivery:</strong> Arriving by <strong>{placedOrderInfo.estimatedDeliveryDate}</strong></p>
                </div>
              </div>

              {/* Direct WhatsApp Alert Button */}
              <div className="max-w-md mx-auto">
                <a
                  href={`https://wa.me/919949157771?text=${encodeURIComponent(`🛍️ *SPARKLE @ KKV ORDER PAYMENT CONFIRMATION*\n\n📌 *Order Ref:* ${placedOrderInfo.id}\n👤 *Customer:* ${placedOrderInfo.customerName}\n📱 *Phone:* ${placedOrderInfo.shippingAddress.phone}\n📍 *Address:* ${placedOrderInfo.shippingAddress.street}, ${placedOrderInfo.shippingAddress.city} - ${placedOrderInfo.shippingAddress.pincode}\n💰 *Total Paid:* ₹${placedOrderInfo.cartTotal}\n💳 *Payment Method:* ${placedOrderInfo.paymentMethod}\n📦 *Status:* Order Received`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-montserrat font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition-all uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>💬 Notify Store Owner on WhatsApp (+91 9949157771)</span>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-montserrat">
                <Link
                  to="/dashboard"
                  onClick={handleCloseModal}
                  className="bg-[#2C2C2C] text-[#FCE4EC] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#3A2D32]"
                >
                  Track Order in Dashboard
                </Link>

                <button
                  onClick={handleCloseModal}
                  className="bg-[#C89B3C] hover:bg-[#b08732] text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  🛍️ Place Another Order / Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
