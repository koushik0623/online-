import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag, ShieldCheck, Video, Truck, MessageSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getDirectImageUrl } from '../utils/imageUtils';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    user,
    setIsLoginModalOpen,
    showToast,
    placeOrder
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const fetchImageFile = async (rawUrl) => {
    if (!rawUrl) return null;
    try {
      const directUrl = getDirectImageUrl(rawUrl);
      let fetchUrl = directUrl;
      if (!directUrl.startsWith('http') && !directUrl.startsWith('data:')) {
        const cleanPath = directUrl.replace(/^\//, '');
        fetchUrl = `${window.location.origin}/${cleanPath}`;
      }
      const response = await fetch(fetchUrl);
      const blob = await response.blob();
      const mimeType = blob.type && blob.type.startsWith('image/') ? blob.type : 'image/jpeg';
      const ext = mimeType.split('/')[1] || 'jpg';
      return new File([blob], `sparkle_order_item.${ext}`, { type: mimeType });
    } catch (err) {
      console.warn("Could not fetch image file for sharing:", err);
      return null;
    }
  };

  const handleWhatsAppCheckout = async () => {
    if (!cart || cart.length === 0) return;

    const firstItem = cart[0];
    const rawImg = firstItem?.product?.images?.[0] || '';

    const itemsText = cart.map((item, index) => {
      const colorText = item.selectedColor ? ` (Color: ${item.selectedColor})` : '';
      const itemSubtotal = (item.product.price || 0) * (item.quantity || 1);
      const directImgUrl = getDirectImageUrl(item.product.images?.[0] || '');

      let fullImgUrl = '';
      if (directImgUrl) {
        if (directImgUrl.startsWith('http')) {
          fullImgUrl = directImgUrl;
        } else if (!directImgUrl.startsWith('data:')) {
          const cleanPath = directImgUrl.replace(/^\//, '');
          fullImgUrl = `https://sparklekkv.com/${cleanPath}`;
        }
      }

      const imageLine = fullImgUrl ? `\n   🖼️ *Item Image:* ${fullImgUrl}` : '';
      return `${index + 1}. *${item.product.name}*${colorText}\n   Qty: ${item.quantity} × ₹${item.product.price} = ₹${itemSubtotal}${imageLine}`;
    }).join('\n\n');

    let discountText = discountAmount > 0 ? `\n🏷️ *Discount:* -₹${discountAmount}` : '';
    let couponText = appliedCoupon ? ` (Coupon: ${appliedCoupon.code})` : '';

    const customerNameText = user?.name ? `👤 *Customer Name:* ${user.name}\n` : '';
    const customerPhoneText = user?.phone ? `📱 *Phone:* ${user.phone}\n` : '';

    const message = 
`✨ *NEW ORDER REQUEST - SPARKLE @KKV* ✨

${customerNameText}${customerPhoneText}🛒 *Order Items (${cart.reduce((sum, i) => sum + i.quantity, 0)} items):*
${itemsText}

-----------------------------
💵 *Bag Subtotal:* ₹${cartSubtotal}
${discountText}${couponText}
🚚 *Shipping Fee:* ${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
💰 *Total Amount:* *₹${cartTotal}*
-----------------------------

Please confirm my order and share delivery / payment details!`;

    // Store order record in system for store owner dashboard
    try {
      placeOrder({
        shippingAddress: { 
          fullName: user?.name || "WhatsApp Customer", 
          phone: user?.phone || "", 
          street: "WhatsApp Direct Order", 
          city: "", 
          state: "", 
          pincode: "" 
        },
        paymentMethod: "WhatsApp Direct Order",
        paymentStatus: "Pending WhatsApp Confirmation",
        orderStatus: "Order Received",
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal
      });
    } catch (e) {
      console.warn("WhatsApp order record exception:", e);
    }

    setIsCartOpen(false);

    // Fetch product image file for direct attachment
    const imageFile = await fetchImageFile(rawImg);

    // 1. Native Web Share API (attaches direct image file directly in WhatsApp on Mobile/Tablet)
    if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      try {
        showToast("📸 Attaching direct item photo to WhatsApp...", "info");
        await navigator.share({
          files: [imageFile],
          title: "Sparkle @ KKV Order",
          text: message
        });
        return;
      } catch (shareErr) {
        console.log("Web Share cancelled/fallback:", shareErr);
      }
    }

    // 2. Clipboard Image Copy (for Desktop browsers)
    if (imageFile && navigator.clipboard && window.ClipboardItem) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [imageFile.type]: imageFile })
        ]);
        showToast("📋 Direct item photo copied! Press Ctrl+V in WhatsApp chat to paste image.", "success");
      } catch (clipErr) {
        console.log("Clipboard image copy exception:", clipErr);
      }
    }

    // 3. Fallback: Open WhatsApp URL
    const whatsappUrl = `https://wa.me/919949157771?text=${encodeURIComponent(message)}`;
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 200);
  };

  const handleApplyCouponSubmit = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#FCE4EC]">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF7F]" />
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#FCE4EC]">Your Luxury Cart</h2>
              <span className="bg-[#D4AF7F] text-[#2C2C2C] text-xs font-bold font-montserrat px-2 py-0.5 rounded-full">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
              </span>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    clearCart();
                    showToast("Cart cleared!", "info");
                  }}
                  className="text-xs font-montserrat text-red-300 hover:text-white underline mr-2"
                >
                  Clear Cart
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Free Shipping & 10% OFF Meter */}
          <div className="bg-[#FFF9F5] p-3.5 sm:p-4 border-b border-[#FCE4EC] shrink-0">
            {cartSubtotal >= freeShippingThreshold ? (
              <div className="flex flex-col gap-1 text-xs font-montserrat text-emerald-700 font-bold">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C89B3C] animate-bounce" />
                  <span>🎉 UNLOCKED: AUTOMATIC 10% OFF + FREE SHIPPING!</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-normal font-poppins">
                  You save 10% on your entire cart + FREE Express Pan-India Delivery!
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 font-poppins text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Add <strong className="text-[#C89B3C]">₹{freeShippingThreshold - cartSubtotal}</strong> more for <strong className="text-emerald-600">10% OFF + FREE Shipping</strong>!</span>
                  <span className="font-bold text-[#2C2C2C]">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F48FB1] via-[#D4AF7F] to-[#C89B3C] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items Scroll List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto text-3xl text-[#D4AF7F]">
                  🛍️
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">Your Cart is Empty</h3>
                <p className="text-xs text-gray-500 font-poppins max-w-xs mx-auto">
                  Explore Swarovski hair clips, Kundan chokers, and boutique gift hampers.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-semibold text-xs px-6 py-3 rounded-full uppercase tracking-wider shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemSubtotal = (item.product.price || 0) * (item.quantity || 1);

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 sm:gap-4 p-3 bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC] relative group shadow-xs hover:border-[#D4AF7F]/50 transition-colors"
                  >
                    <img
                      src={getDirectImageUrl(item.product.images[0])}
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.src = getDirectImageUrl('images/plumeria_flower_claw_clip_drive.jpg');
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover object-center rounded-xl shrink-0 border border-[#D4AF7F]/30"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif-luxury text-xs sm:text-sm font-bold text-[#2C2C2C] truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 p-0.5 shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        {item.selectedColor && (
                          <span className="text-[10px] sm:text-[11px] text-gray-500 block">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#C89B3C]">
                            ₹{item.product.price}
                          </span>
                          <span className="text-[10px] text-gray-400">× {item.quantity} = </span>
                          <span className="text-xs font-bold text-[#2C2C2C]">₹{itemSubtotal}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#D4AF7F]/40 rounded-full bg-white px-2 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="text-xs font-bold text-gray-600 px-1.5 hover:text-[#C89B3C]"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-2">{item.quantity}</span>
                          <button
                            disabled={item.quantity >= (item.product.stock || 999)}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="text-xs font-bold text-gray-600 px-1.5 hover:text-[#C89B3C] disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        {item.quantity >= (item.product.stock || 999) ? (
                          <span className="text-[10px] text-amber-700 font-semibold font-montserrat bg-amber-50 px-2 py-0.5 rounded-full">
                            Max Stock ({item.product.stock})
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-semibold font-montserrat">
                            In Stock ({item.product.stock} available)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Coupon Form */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-[#FCE4EC] space-y-3 shadow-xl shrink-0">
              
              {/* Promo Coupon Input (Supports SPARKLE10 for 10% OFF) */}
              <form onSubmit={handleApplyCouponSubmit} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF7F]" />
                    <input
                      type="text"
                      placeholder="Coupon Code (SPARKLE10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-xl py-2 pl-9 pr-3 text-xs font-poppins uppercase tracking-wider focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-bold text-xs px-4 py-2 rounded-xl uppercase tracking-wider hover:bg-[#3A2D32]"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <span className="font-semibold">Code '{appliedCoupon.code}' Applied! ({appliedCoupon.discountPercent}% OFF)</span>
                    <button type="button" onClick={removeCoupon} className="text-red-500 text-[10px] underline ml-2">Remove</button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-500 px-1">{couponError}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1 font-poppins text-xs pt-2 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promo Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-[#2C2C2C] pt-1.5 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-[#C89B3C]">₹{cartTotal}</span>
                </div>
              </div>

              {/* 7-Day Delivery Guarantee Badge */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-2.5 space-y-1 text-left font-poppins shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-900 font-montserrat text-[10px] font-bold">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>🚚 Guaranteed 7-Day Express Delivery</span>
                </div>
                <p className="text-[10px] text-emerald-800 font-light leading-relaxed">
                  Every item in your order is delivered within <strong>7 business days</strong> pan-India.
                </p>
              </div>

              {/* Unboxing Notice */}
              <div className="bg-amber-50/95 border border-amber-300/80 rounded-2xl p-2.5 space-y-1 text-left font-poppins shadow-xs">
                <div className="flex items-center gap-1.5 text-amber-900 font-montserrat text-[10px] font-bold">
                  <Video className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Unboxing Video Policy</span>
                </div>
                <p className="text-[10px] text-amber-800 font-light leading-relaxed">
                  ⚠️ Returns/exchanges accepted <u>ONLY with continuous unboxing video proof</u>.
                </p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full shimmer-btn bg-gradient-to-r from-[#25D366] via-[#1ebd59] to-[#128C7E] text-white py-3.5 sm:py-4 rounded-2xl font-montserrat text-xs sm:text-sm font-bold tracking-wider uppercase shadow-xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-white animate-bounce shrink-0" />
                <span>Order On WhatsApp Now (₹{cartTotal})</span>
                <ArrowRight className="w-4 h-4 text-white shrink-0" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-poppins pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>Instant WhatsApp Confirmation • 100% Encrypted</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
