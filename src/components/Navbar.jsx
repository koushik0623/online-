import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Sparkles, Menu, X, ShieldCheck, ChevronDown, Home, Grid, Lock, Eye, EyeOff } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { NAVIGATION_TREE } from '../data/mockData';
import { AmazonAuthModal } from './AmazonAuthModal';

export const Navbar = () => {
  const {
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    user,
    switchUserRole,
    loginUser,
    logoutUser,
    isLoginModalOpen,
    setIsLoginModalOpen,
    products
  } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const safeCart = Array.isArray(cart) ? cart : [];
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeUser = user || { isLoggedIn: false };

  const totalCartItems = safeCart.reduce((sum, item) => sum + (item?.quantity || 1), 0);

  // Active Route Helpers
  const currentPath = location?.pathname || '/';
  const searchParams = new URLSearchParams(location?.search || '');
  const activeCategory = searchParams.get('category');
  const isSearchActive = !!searchParams.get('search');

  const isHomeActive = currentPath === '/' && !activeCategory && !isSearchActive;
  const isShopAllActive = currentPath === '/shop' && !activeCategory && !isSearchActive;

  const searchFilteredProducts = searchQuery.trim() === "" ? [] : safeProducts.filter(p => 
    p && (
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  ).slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('about');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-[100] transition-all duration-300 shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#2C2C2C] via-[#3A2D32] to-[#2C2C2C] text-[#FCE4EC] py-2 px-3 tracking-widest font-montserrat shadow-sm border-b border-[#D4AF7F]/30 overflow-hidden flex items-center relative z-[100]">
        <marquee behavior="scroll" direction="left" scrollamount="6" className="font-montserrat text-[11px] sm:text-xs tracking-widest uppercase flex items-center gap-4 py-0.5">
          ✨ SPARKLE @ KKV LUXURY ACCESSORIES • SPECIAL OFFER: AUTOMATIC 10% OFF + FREE PAN-INDIA SHIPPING ON ORDERS OVER ₹999 • USE PROMO CODE: <span className="bg-[#D4AF7F] text-[#2C2C2C] font-bold px-2 py-0.5 rounded text-[10px] mx-1 inline-block">CODE: SPARKLE10</span> FOR 10% OFF YOUR ORDER • 100% HANDCRAFTED ANTI-TARNISH FINISH ✨
        </marquee>
      </div>

      {/* Main Glass Header */}
      <nav className="glass-header border-b border-[#FCE4EC]/60 shadow-md relative z-[100] bg-white/98">
        
        {/* Tier 1: Brand Bar (Logo + Search Bar + Actions) */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-1 sm:gap-4">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-[#2C2C2C] hover:text-[#C89B3C] bg-[#FFF9F5] rounded-xl border border-[#D4AF7F]/30 transition-colors shadow-xs"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

            {/* Brand Logo - Perfectly aligned & formatted Sparkle @ KKV */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-3 group shrink-0 py-1 max-w-[55vw] sm:max-w-none">
              <div className="relative flex items-center justify-center shrink-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl border-2 border-[#D4AF7F]/50 bg-[#FFF9F5] p-[2px] shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-[#FFF9F5] rounded-[5px] sm:rounded-[12px] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#C89B3C] group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-baseline gap-1 leading-none">
                  <span className="font-serif-luxury text-base sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#C89B3C] group-hover:text-[#AA7C11] transition-colors leading-none">
                    SPARKLE
                  </span>
                  <span className="font-poppins text-[9px] sm:text-xs lg:text-sm font-extrabold text-[#2C2C2C] lowercase leading-none">
                    @kkv
                  </span>
                </div>
                <span className="text-[6px] sm:text-[9px] text-[#8C4A57] font-montserrat tracking-[0.1em] sm:tracking-[0.2em] uppercase block mt-0.5 sm:mt-1 font-bold truncate">
                  Luxury Fashion Accessories
                </span>
              </div>
            </Link>

            {/* Search Bar - Center (Desktop Tier 1) */}
            <div className="relative hidden lg:block flex-1 max-w-md mx-6">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search SKU, Kundan, Hair Clips..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-full bg-[#FFF9F5]/90 border border-[#D4AF7F]/40 focus:border-[#C89B3C] rounded-full py-2.5 pl-4 pr-10 text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#FCE4EC] shadow-inner transition-all"
                  />
                  <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4AF7F] hover:text-[#C89B3C] p-1">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Search Autocomplete Results */}
              {showSearchResults && searchFilteredProducts.length > 0 && (
                <div className="absolute top-full mt-2 w-full left-0 bg-white rounded-2xl shadow-xl border border-[#FCE4EC] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-montserrat uppercase tracking-wider text-[#D4AF7F] px-3 py-1 font-semibold">Suggested Items</p>
                  {searchFilteredProducts.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        navigate(`/product/${prod.id}`);
                        setShowSearchResults(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-[#FFF9F5] rounded-xl cursor-pointer transition-colors"
                    >
                      <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium truncate text-[#2C2C2C]">{prod.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">SKU: {prod.sku}</span>
                        <span className="text-xs font-semibold text-[#C89B3C]">₹{prod.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Action Controls (Wishlist, Cart, User Menu) */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              
              {/* Wishlist Icon */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-1.5 sm:p-2 text-[#2C2C2C] hover:text-[#C89B3C] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-6 sm:h-6" />
                {safeWishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#F48FB1] text-white text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-xs">
                    {safeWishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-[#FCE4EC] hover:bg-[#F8BBD0] text-[#2C2C2C] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 font-montserrat font-bold text-xs shadow-xs transition-all cursor-pointer group shrink-0"
                aria-label="Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2C2C2C] group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-[#2C2C2C] whitespace-nowrap">
                  {totalCartItems} <span className="hidden sm:inline">{totalCartItems === 1 ? 'Item' : 'Items'}</span>
                </span>
              </button>

              {/* Admin Portal Link Button */}
              <Link
                to="/admin"
                className="bg-[#2C2C2C] hover:bg-[#C89B3C] text-[#FCE4EC] hover:text-black px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 font-montserrat font-bold text-[11px] sm:text-xs shadow-xs transition-all shrink-0 border border-[#D4AF7F]/30"
                title="Admin Portal (Add Products & Manage Store)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF7F]" />
                <span className="hidden sm:inline">Admin</span>
              </Link>

              {/* User Account & Admin Sign In (Desktop) */}
              <div className="relative hidden sm:block">
                {safeUser.isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 p-1 rounded-full border border-[#D4AF7F]/40 hover:border-[#C89B3C] transition-all bg-[#FFF9F5]"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#2C2C2C] text-[#FCE4EC] flex items-center justify-center text-xs font-bold font-montserrat">
                        {user.name.charAt(0)}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-[#2C2C2C]" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#FCE4EC] py-2 z-50 font-poppins text-xs">
                        <div className="px-4 py-2 border-b border-gray-100 space-y-0.5">
                          <p className="font-bold text-[#2C2C2C] text-sm">{user.name}</p>
                          <p className="text-[11px] text-gray-600 truncate">{user.email}</p>
                          {user.phone && <p className="text-[11px] text-[#C89B3C] font-mono font-medium">📱 {user.phone}</p>}
                        </div>

                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-[#FFF9F5] text-[#2C2C2C]"
                          >
                            <User className="w-4 h-4" /> My Account & Orders
                          </Link>
                          <button
                            onClick={() => {
                              logoutUser();
                              setIsUserMenuOpen(false);
                              navigate('/');
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 font-semibold"
                          >
                            <X className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

            </div>
          </div>
        </div>

        {/* Tier 2: Category Navigation Bar (Desktop Dedicated Row) */}
        <div className="hidden lg:block border-t border-[#FCE4EC]/80 bg-white/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-center gap-2 lg:gap-4 xl:gap-6 font-montserrat text-[10px] xl:text-xs uppercase tracking-wider font-semibold text-[#2C2C2C] h-11">
              
              <Link
                to="/"
                className={`transition-colors relative py-3 group whitespace-nowrap flex items-center gap-1.5 ${
                  isHomeActive ? 'text-[#C89B3C] font-bold' : 'hover:text-[#C89B3C]'
                }`}
              >
                <span>Home</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] transition-transform duration-300 ${
                  isHomeActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>

              <Link
                to="/shop"
                className={`transition-colors relative py-3 group whitespace-nowrap flex items-center gap-1.5 ${
                  isShopAllActive ? 'text-[#C89B3C] font-bold' : 'hover:text-[#C89B3C]'
                }`}
              >
                <span>Shop All</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] transition-transform duration-300 ${
                  isShopAllActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>

              {NAVIGATION_TREE.map(cat => {
                const isCatActive = activeCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="relative group py-3"
                    onMouseEnter={() => setActiveDropdown(cat.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      to={`/shop?category=${cat.id}`}
                      className={`transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                        isCatActive ? 'text-[#C89B3C] font-bold' : 'hover:text-[#C89B3C]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown className="w-3 h-3 text-[#D4AF7F] group-hover:rotate-180 transition-transform duration-200" />
                    </Link>

                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] transition-transform duration-300 ${
                      isCatActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />

                    {activeDropdown === cat.id && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white rounded-2xl shadow-xl border border-[#FCE4EC] py-2 z-50 animate-in fade-in">
                        {cat.subcategories.map(sub => (
                          <Link
                            key={sub.id}
                            to={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                            className="block px-4 py-2 hover:bg-[#FFF9F5] text-[11px] text-[#2C2C2C] hover:text-[#C89B3C] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <a
                href="#about"
                onClick={handleAboutClick}
                className="transition-colors relative py-3 group whitespace-nowrap flex items-center gap-1.5 hover:text-[#C89B3C]"
              >
                <span>About Us</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#FCE4EC] bg-white/95 backdrop-blur-2xl px-4 pt-4 pb-8 font-montserrat text-xs uppercase tracking-wider space-y-4 animate-in fade-in shadow-2xl">
            
            {/* User Account Info Bar on Mobile */}
            <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#D4AF7F]/30 flex items-center justify-between font-poppins text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2C2C2C] text-[#FCE4EC] flex items-center justify-center font-bold font-montserrat text-xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <p className="font-semibold text-[#2C2C2C]">{user.name || 'Sparkle Member'}</p>
                  <p className="text-[10px] text-gray-500">{user.email || 'Welcome to Sparkle @kkv'}</p>
                </div>
              </div>
            </div>

            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="mb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/50 focus:border-[#C89B3C] rounded-full py-2.5 pl-4 pr-10 text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#FCE4EC]"
                />
                <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4AF7F]">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Navigation Links */}
            <div className="space-y-1.5">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  isHomeActive
                    ? 'bg-[#FFF9F5] text-[#C89B3C] border-l-4 border-[#C89B3C] shadow-xs'
                    : 'text-[#2C2C2C] hover:bg-[#FFF9F5] hover:text-[#C89B3C]'
                }`}
              >
                <Home className="w-4 h-4 text-[#D4AF7F]" />
                <span>Home</span>
              </Link>

              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  isShopAllActive
                    ? 'bg-[#FFF9F5] text-[#C89B3C] border-l-4 border-[#C89B3C] shadow-xs'
                    : 'text-[#2C2C2C] hover:bg-[#FFF9F5] hover:text-[#C89B3C]'
                }`}
              >
                <Grid className="w-4 h-4 text-[#D4AF7F]" />
                <span>Shop All</span>
              </Link>

              {NAVIGATION_TREE.map(cat => {
                const isCatActive = activeCategory === cat.id;
                const isExpanded = expandedMobileCategory === cat.id;

                return (
                  <div key={cat.id} className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/shop?category=${cat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex-1 px-3.5 py-2.5 font-bold transition-colors ${
                          isCatActive ? 'text-[#C89B3C] bg-[#FFF9F5]' : 'text-[#2C2C2C] hover:text-[#C89B3C]'
                        }`}
                      >
                        {cat.name}
                      </Link>

                      <button
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                        className="p-2.5 text-[#D4AF7F] hover:text-[#C89B3C]"
                        aria-label="Expand category"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="bg-[#FFF9F5]/70 px-4 py-2 space-y-1.5 border-t border-gray-100 text-[11px] font-medium lowercase font-poppins">
                        {cat.subcategories.map(sub => (
                          <Link
                            key={sub.id}
                            to={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-1 text-gray-600 hover:text-[#C89B3C] transition-colors"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <a
                href="#about"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleAboutClick(e);
                }}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#2C2C2C] hover:bg-[#FFF9F5] hover:text-[#C89B3C] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF7F]" />
                <span>About Us</span>
              </a>
            </div>

            {/* Quick Action Links inside Mobile Drawer */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-around text-xs font-poppins text-gray-600 font-medium">
              <button onClick={() => { setIsWishlistOpen(true); setIsMobileMenuOpen(false); }} className="hover:text-[#C89B3C]">
                💖 Wishlist ({wishlist.length})
              </button>
              <span className="text-gray-300">•</span>
              <button onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }} className="hover:text-[#C89B3C]">
                🛍️ Cart ({totalCartItems})
              </button>
              <span className="text-gray-300">•</span>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[#C89B3C] font-bold">
                🛡️ Admin
              </Link>
              {user.isLoggedIn && (
                <>
                  <span className="text-gray-300">•</span>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C89B3C]">
                    My Orders
                  </Link>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => {
                      logoutUser();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-red-500 font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>

          </div>
        )}

        {/* Auth Modal */}
        <AmazonAuthModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      </nav>
    </header>
  );
};
