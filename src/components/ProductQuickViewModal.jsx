import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getDirectImageUrl, getCategoryFallbackImage } from '../utils/imageUtils';

export const ProductQuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    setIsCheckoutOpen,
    user,
    setIsLoginModalOpen,
    showToast
  } = useShop();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(quickViewProduct?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(quickViewProduct?.sizes?.[0] || '2*6');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity, selectedColor);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#FCE4EC] flex flex-col max-h-[90vh] md:max-h-[85vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-[#C89B3C] shadow-md transition-transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          
          {/* Left Column: Image Viewer */}
          <div className="p-6 bg-[#FFF9F5] flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#FCE4EC]">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner bg-white border border-[#D4AF7F]/20 mb-4">
              <img
                src={getDirectImageUrl(quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0])}
                alt={quickViewProduct.name}
                onError={(e) => {
                  e.target.src = getDirectImageUrl(getCategoryFallbackImage(quickViewProduct.category));
                }}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
              <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[10px] font-montserrat font-bold text-[#C89B3C] px-3 py-1 rounded-full shadow-sm">
                360° Luxury View
              </span>
            </div>

            {/* Thumbnail Navigation */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImageIndex === idx ? 'border-[#C89B3C] scale-105 shadow' : 'border-transparent opacity-70'}`}
                  >
                    <img src={getDirectImageUrl(img)} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-montserrat uppercase font-bold text-[#D4AF7F] tracking-widest">
                  {quickViewProduct.categoryName}
                </span>
                {quickViewProduct.stock <= 0 ? (
                  <span className="text-xs text-red-600 font-bold flex items-center gap-1">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({quickViewProduct.stock || 12} left)
                  </span>
                )}
              </div>

              <h2 className="font-serif-luxury text-2xl font-bold text-[#2C2C2C]">
                {quickViewProduct.name}
              </h2>

              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-[#C89B3C]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#2C2C2C]">{quickViewProduct.rating}</span>
                <span className="text-xs text-gray-400">({quickViewProduct.reviewsCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold text-[#2C2C2C] font-poppins">₹{quickViewProduct.price}</span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{quickViewProduct.originalPrice}</span>
                )}
                <span className="bg-[#FCE4EC] text-[#F48FB1] text-xs font-bold px-2.5 py-0.5 rounded-full font-montserrat">
                  Save ₹{quickViewProduct.originalPrice - quickViewProduct.price}
                </span>
              </div>

              {/* Bangle Size Selector */}
              {(quickViewProduct.sizes || quickViewProduct.category === 'bangles') && (
                <div className="pt-2">
                  <label className="text-xs font-montserrat uppercase font-semibold text-[#2C2C2C] block mb-2">
                    Select Bangle Size: <span className="text-[#C89B3C] font-bold">{selectedSize}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {(quickViewProduct.sizes || ["2*4", "2*6", "2*8"]).map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedSize === sz ? 'bg-[#2C2C2C] text-[#FCE4EC] border-[#2C2C2C] shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#D4AF7F]'}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Options */}
              {quickViewProduct.colors && (
                <div className="pt-2">
                  <label className="text-xs font-montserrat uppercase font-semibold text-[#2C2C2C] block mb-2">
                    Select Color Finish: <span className="text-[#C89B3C]">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedColor === c ? 'bg-[#2C2C2C] text-[#FCE4EC] border-[#2C2C2C] shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#D4AF7F]'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Manager */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-montserrat uppercase font-semibold text-[#2C2C2C] block">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center w-32 border border-[#D4AF7F]/40 rounded-full overflow-hidden bg-[#FFF9F5]">
                    <button
                      disabled={quantity <= 1 || quickViewProduct.stock <= 0}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 py-1.5 text-gray-600 hover:bg-[#FCE4EC] font-bold text-sm disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-xs">{quickViewProduct.stock <= 0 ? 0 : quantity}</span>
                    <button
                      disabled={quantity >= quickViewProduct.stock || quickViewProduct.stock <= 0}
                      onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                      className="w-10 py-1.5 text-gray-600 hover:bg-[#FCE4EC] font-bold text-sm disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {(quickViewProduct.category === 'hair-accessories' || quickViewProduct.categoryName === 'Clips' || quickViewProduct.id?.startsWith('SPK-HC')) && (
                    <div className="bg-[#FFF9F5] border border-[#C89B3C]/50 text-[#2C2C2C] px-3 py-1.5 rounded-xl text-[11px] font-bold font-montserrat flex items-center gap-1">
                      <span className="text-[#C89B3C]">📦</span>
                      <span>{quickViewProduct.id === 'SPK-HC-006' || quickViewProduct.isIndividual ? `${quantity} Piece (Sold Individually)` : `${quantity} Set (${quantity * 6} Pieces)`}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 font-montserrat pt-4 border-t border-gray-100">
              {quickViewProduct.stock <= 0 ? (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 border border-gray-200 py-3 rounded-2xl text-xs font-bold uppercase cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, quantity, selectedColor);
                      setQuickViewProduct(null);
                    }}
                    className="w-full bg-[#FFF9F5] border border-[#D4AF7F] text-[#2C2C2C] hover:bg-[#FCE4EC] py-3 rounded-2xl text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C89B3C]" /> Add To Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-[#2C2C2C] to-[#3A2D32] text-[#FCE4EC] hover:text-white py-3 rounded-2xl text-xs font-bold tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-[#D4AF7F]" /> Buy Now
                  </button>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-[#F48FB1] flex items-center justify-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#F48FB1] text-[#F48FB1]' : ''}`} />
                {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-gray-500 font-poppins border-t border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#C89B3C]" />
                <span>Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                <span>Anti-Tarnish Plating</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-[#C89B3C]" />
                <span>7 Days Exchange</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
