import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { NAVIGATION_TREE } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, X, ChevronRight, Tag, Zap, Star, Filter, Check, Plus } from 'lucide-react';

export const ShopPage = () => {
  const { products, user } = useShop();
  const isAdminOwner = (user && user.role === 'admin') || localStorage.getItem('sparkle_admin_authed') === 'true';
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSubcategory = searchParams.get('subcategory') || '';
  const searchQueryParam = searchParams.get('search') || '';
  const flashSaleParam = searchParams.get('flashSale') === 'true';

  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [onlyFlashSale, setOnlyFlashSale] = useState(flashSaleParam);
  const [maxPriceFilter, setMaxPriceFilter] = useState('all');
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Mobile Filter Drawer Toggle State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category and search query state when URL searchParams change
  React.useEffect(() => {
    setSelectedCategory(currentCategory);
    setSearchQuery(searchQueryParam);
  }, [currentCategory, searchQueryParam]);

  const activeCategoryObj = useMemo(() => {
    return NAVIGATION_TREE.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  const activeSubcategoryObj = useMemo(() => {
    if (!activeCategoryObj || !currentSubcategory) return null;
    return activeCategoryObj.subcategories.find(s => s.id === currentSubcategory);
  }, [activeCategoryObj, currentSubcategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => {
        if (!p || (!p.category && !p.categoryName)) return false;
        const catLower = (p.category || '').toLowerCase().trim();
        const catNameLower = (p.categoryName || '').toLowerCase().trim();
        const rawSelLower = selectedCategory.toLowerCase().trim();
        const selHyphen = rawSelLower.replace(/[\s_]+/g, '-');

        if (catLower === rawSelLower || catLower === selHyphen) return true;

        if ((selHyphen === 'hair-accessories' || selHyphen === 'clips') && (catLower === 'clips' || catLower === 'hair-accessories' || catNameLower.includes('clip'))) return true;
        if (selHyphen === 'chains' && (catLower === 'chains' || catNameLower.includes('chain'))) return true;
        if ((selHyphen === 'earrings' || selHyphen === 'ear-rings') && (catLower === 'earrings' || catNameLower.includes('ear') || catNameLower.includes('jhumka'))) return true;
        if ((selHyphen === 'necklaces' || selHyphen === 'necklace-sets') && (catLower === 'necklaces' || catNameLower.includes('necklace') || catNameLower.includes('choker'))) return true;
        if (selHyphen === 'bracelets' && (catLower === 'bracelets' || catNameLower.includes('bracelet') || catNameLower.includes('kada'))) return true;
        if (selHyphen === 'bangles' && (catLower === 'bangles' || catNameLower.includes('bangle'))) return true;
        if ((selHyphen === 'gift-sets' || selHyphen === 'giftsets' || selHyphen.includes('gift')) && (catLower === 'gift-sets' || catLower.includes('gift') || catNameLower.includes('gift') || catNameLower.includes('combo'))) return true;

        return false;
      });
    }

    if (currentSubcategory) {
      const curSubHyphen = currentSubcategory.toLowerCase().trim().replace(/[\s_]+/g, '-');
      result = result.filter(p => {
        if (!p) return false;
        // Include custom items and items without strict subcategory constraints
        if (!p.subcategory || p.subcategory === 'all' || p.subcategory === '' || p.subcategory === 'luxury-sets' || p.isNew || String(p.id || '').startsWith('SPK-CUSTOM')) return true;
        const pSubHyphen = (p.subcategory || '').toLowerCase().trim().replace(/[\s_]+/g, '-');
        return pSubHyphen === curSubHyphen;
      });
    }

    if (onlyFlashSale) {
      result = result.filter(p => p.isFlashSale);
    }

    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    if (minRatingFilter > 0) {
      result = result.filter(p => (p.rating || 5) >= minRatingFilter);
    }

    if (maxPriceFilter !== 'all') {
      const limit = Number(maxPriceFilter);
      result = result.filter(p => p.price <= limit);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.categoryName.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedCategory, currentSubcategory, searchQuery, sortBy, onlyFlashSale, maxPriceFilter, minRatingFilter, inStockOnly]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setOnlyFlashSale(false);
    setMaxPriceFilter('all');
    setMinRatingFilter(0);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF9F5] min-h-screen font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Trail */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-montserrat text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#C89B3C]">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/shop" onClick={() => setSelectedCategory('all')} className="hover:text-[#C89B3C]">Shop Catalog</Link>
          
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <Link to={`/shop?category=${activeCategoryObj.id}`} className="hover:text-[#C89B3C] font-medium text-[#2C2C2C]">
                {activeCategoryObj.name}
              </Link>
            </>
          )}

          {activeSubcategoryObj && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-[#C89B3C] font-bold">{activeSubcategoryObj.name}</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#2C2C2C]">
                {activeSubcategoryObj 
                  ? activeSubcategoryObj.name 
                  : activeCategoryObj 
                  ? activeCategoryObj.name 
                  : "Complete Boutique Catalog"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
                Showing {filteredProducts.length} handcrafted luxury accessories with 10% OFF on ₹999+ orders.
              </p>
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-[#2C2C2C] text-[#FCE4EC] px-4 py-2 rounded-full font-montserrat text-xs font-bold shadow-md"
              >
                <Filter className="w-4 h-4 text-[#D4AF7F]" />
                <span>Filters & Sort ({filteredProducts.length})</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#FCE4EC] shadow-xs text-xs font-montserrat font-bold text-[#2C2C2C]">
                <Sparkles className="w-4 h-4 text-[#C89B3C]" />
                <span>{filteredProducts.length} Items Available</span>
              </div>
            </div>
          </div>

          {/* Active Subcategory Pill Chips Filter Bar */}
          {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
            <div className="pt-3 flex items-center gap-2 overflow-x-auto pb-2 font-montserrat text-xs">
              <Link
                to={`/shop?category=${activeCategoryObj.id}`}
                className={`px-3.5 py-1.5 rounded-full font-bold shrink-0 transition-all ${!currentSubcategory ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-xs' : 'bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF7F]'}`}
              >
                All {activeCategoryObj.name}
              </Link>
              {activeCategoryObj.subcategories.map(sub => (
                <Link
                  key={sub.id}
                  to={`/shop?category=${activeCategoryObj.id}&subcategory=${sub.id}`}
                  className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${currentSubcategory === sub.id ? 'bg-[#C89B3C] text-white shadow-xs' : 'bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF7F]'}`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}

          {/* Special Prominent 2-Option Selection Cards for Gift Sets & Combos */}
          {selectedCategory === 'gift-sets' && !currentSubcategory && (
            <div className="my-6 p-6 sm:p-8 bg-gradient-to-r from-[#FFF9F5] via-[#FCE4EC]/50 to-[#FFF9F5] rounded-3xl border-2 border-[#D4AF7F]/40 shadow-sm text-center">
              <div className="inline-flex items-center gap-1.5 text-[#C89B3C] font-montserrat text-xs tracking-widest uppercase font-bold mb-2">
                <Sparkles className="w-4 h-4" /> Select Your Gift Collection <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-2">
                Choose Gift Category: <span className="text-[#C89B3C]">CANVAS</span> or <span className="text-[#F48FB1]">FLOWERS</span>
              </h2>
              <p className="text-xs text-gray-600 font-poppins max-w-xl mx-auto mb-6 font-light">
                Select your preferred gift type to view handcrafted personalized canvas prints or botanical flower hampers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto font-montserrat">
                <Link
                  to="/shop?category=gift-sets&subcategory=canvas"
                  className="group bg-white p-6 rounded-2xl border-2 border-[#D4AF7F]/40 hover:border-[#C89B3C] shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF9F5] text-3xl flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    🖼️
                  </div>
                  <h3 className="font-bold text-lg text-[#2C2C2C] group-hover:text-[#C89B3C] tracking-wider uppercase">
                    CANVAS
                  </h3>
                  <p className="text-xs text-gray-500 font-poppins mt-1">
                    Custom Personalized Canvas Art Frames & Keepsake Gift Boxes
                  </p>
                  <span className="mt-4 bg-[#2C2C2C] text-[#FCE4EC] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-[#C89B3C] group-hover:text-white transition-colors shadow-xs">
                    Select CANVAS →
                  </span>
                </Link>

                <Link
                  to="/shop?category=gift-sets&subcategory=flowers"
                  className="group bg-white p-6 rounded-2xl border-2 border-[#FCE4EC] hover:border-[#F48FB1] shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF9F5] text-3xl flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    🌸
                  </div>
                  <h3 className="font-bold text-lg text-[#2C2C2C] group-hover:text-[#F48FB1] tracking-wider uppercase">
                    FLOWERS
                  </h3>
                  <p className="text-xs text-gray-500 font-poppins mt-1">
                    Handcrafted Plumeria Flowers & Botanical Accessory Hampers
                  </p>
                  <span className="mt-4 bg-[#2C2C2C] text-[#FCE4EC] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-[#F48FB1] group-hover:text-white transition-colors shadow-xs">
                    Select FLOWERS →
                  </span>
                </Link>
              </div>
            </div>
          )}

          {/* Active Filter Badges */}
          {(currentSubcategory || searchQuery || onlyFlashSale || maxPriceFilter !== 'all' || minRatingFilter > 0 || inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-montserrat">
              <span className="text-gray-400 font-semibold">Active Filters:</span>
              
              {currentSubcategory && (
                <span className="bg-[#FCE4EC] text-[#2C2C2C] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  Subcategory: {activeSubcategoryObj?.name || currentSubcategory}
                  <Link to={`/shop?category=${selectedCategory}`} className="hover:text-red-500 ml-1">
                    <X className="w-3 h-3" />
                  </Link>
                </span>
              )}

              {searchQuery && (
                <span className="bg-[#FFF9F5] border border-[#D4AF7F] text-[#2C2C2C] px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyFlashSale && (
                <span className="bg-[#C89B3C] text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  Flash Sale Only
                  <button onClick={() => setOnlyFlashSale(false)} className="hover:text-red-200 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {maxPriceFilter !== 'all' && (
                <span className="bg-[#2C2C2C] text-[#FCE4EC] px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  Under ₹{maxPriceFilter}
                  <button onClick={() => setMaxPriceFilter('all')} className="hover:text-red-200 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {minRatingFilter > 0 && (
                <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  Rating: {minRatingFilter}★ & above
                  <button onClick={() => setMinRatingFilter(0)} className="hover:text-red-500 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:text-red-500 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-gray-400 hover:text-red-500 underline text-xs font-medium ml-2"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Desktop Comprehensive Filter Controls Bar */}
        <div className="hidden lg:block bg-white p-6 rounded-3xl border border-[#FCE4EC] shadow-xs mb-8 space-y-4">
          
          <div className="flex items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search accessories or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFF9F5] border border-[#D4AF7F]/40 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#C89B3C]"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF7F]" />
            </div>

            {/* Sorting & Flash Sale */}
            <div className="flex items-center gap-3 font-montserrat text-xs">
              
              <button
                onClick={() => setOnlyFlashSale(!onlyFlashSale)}
                className={`px-3.5 py-2 rounded-full font-bold transition-all border ${onlyFlashSale ? 'bg-[#C89B3C] text-white border-[#C89B3C]' : 'bg-[#FFF9F5] text-gray-700 border-gray-200 hover:border-[#D4AF7F]'}`}
              >
                ⚡ Flash Sale Only
              </button>

              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3.5 py-2 rounded-full font-bold transition-all border ${inStockOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-[#FFF9F5] text-gray-700 border-gray-200 hover:border-[#D4AF7F]'}`}
              >
                In Stock Only
              </button>

              <div className="flex items-center gap-2 bg-[#FFF9F5] px-3.5 py-2 rounded-full border border-[#D4AF7F]/40">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span className="font-semibold text-gray-600">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-[#2C2C2C] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </div>

          </div>

          {/* Quick Price & Rating Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 font-montserrat text-xs">
            
            {/* Price Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400 font-semibold flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5 text-[#C89B3C]" /> Price:
              </span>

              <button
                onClick={() => setMaxPriceFilter(maxPriceFilter === '199' ? 'all' : '199')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === '199' ? 'bg-[#2C2C2C] text-[#FCE4EC]' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
              >
                Under ₹199
              </button>

              <button
                onClick={() => setMaxPriceFilter(maxPriceFilter === '299' ? 'all' : '299')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === '299' ? 'bg-[#2C2C2C] text-[#FCE4EC]' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
              >
                Under ₹299
              </button>

              <button
                onClick={() => setMaxPriceFilter(maxPriceFilter === '499' ? 'all' : '499')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === '499' ? 'bg-[#2C2C2C] text-[#FCE4EC]' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
              >
                Under ₹499
              </button>

              <button
                onClick={() => setMaxPriceFilter(maxPriceFilter === '999' ? 'all' : '999')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === '999' ? 'bg-[#2C2C2C] text-[#FCE4EC]' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
              >
                Under ₹999
              </button>

              <button
                onClick={() => setMaxPriceFilter('all')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${maxPriceFilter === 'all' ? 'bg-[#C89B3C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#FCE4EC]'}`}
              >
                All Prices
              </button>
            </div>

            {/* Rating Filter Chips */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#C89B3C] fill-current" /> Rating:
              </span>

              <button
                onClick={() => setMinRatingFilter(minRatingFilter === 4.5 ? 0 : 4.5)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${minRatingFilter === 4.5 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-amber-100'}`}
              >
                4.5★ & above
              </button>

              <button
                onClick={() => setMinRatingFilter(minRatingFilter === 4.0 ? 0 : 4.0)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all ${minRatingFilter === 4.0 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-amber-100'}`}
              >
                4.0★ & above
              </button>
            </div>

          </div>

          {/* Main Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-gray-100 font-montserrat text-xs">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchParams({});
              }}
              className={`px-4 py-1.5 rounded-full font-semibold shrink-0 transition-all ${selectedCategory === 'all' ? 'bg-[#2C2C2C] text-[#FCE4EC] shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-[#FCE4EC]'}`}
            >
              All Items ({products.length})
            </button>

            {NAVIGATION_TREE.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchParams({ category: cat.id });
                }}
                className={`px-4 py-1.5 rounded-full font-semibold shrink-0 transition-all ${selectedCategory === cat.id ? 'bg-[#C89B3C] text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-[#FCE4EC]'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Mobile Slide-out Filter Drawer Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex justify-end lg:hidden animate-in fade-in">
            <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col font-poppins">
              
              <div className="p-4 bg-[#2C2C2C] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#D4AF7F]" />
                  <h3 className="font-serif-luxury font-bold text-base">Category & Price Filters</h3>
                </div>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 hover:text-[#D4AF7F]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-6 text-xs">
                
                {/* Category Selection */}
                <div>
                  <h4 className="font-montserrat font-bold uppercase tracking-wider text-[#2C2C2C] mb-2.5">
                    Category
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setSelectedCategory('all'); setSearchParams({}); }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-[#C89B3C] text-white font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      All Categories ({products.length})
                    </button>
                    {NAVIGATION_TREE.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setSearchParams({ category: cat.id }); }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-[#C89B3C] text-white font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-montserrat font-bold uppercase tracking-wider text-[#2C2C2C] mb-2.5">
                    Price Range
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMaxPriceFilter('199')}
                      className={`py-2 rounded-xl text-center border font-semibold ${maxPriceFilter === '199' ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'border-gray-200'}`}
                    >
                      Under ₹199
                    </button>
                    <button
                      onClick={() => setMaxPriceFilter('299')}
                      className={`py-2 rounded-xl text-center border font-semibold ${maxPriceFilter === '299' ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'border-gray-200'}`}
                    >
                      Under ₹299
                    </button>
                    <button
                      onClick={() => setMaxPriceFilter('499')}
                      className={`py-2 rounded-xl text-center border font-semibold ${maxPriceFilter === '499' ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'border-gray-200'}`}
                    >
                      Under ₹499
                    </button>
                    <button
                      onClick={() => setMaxPriceFilter('all')}
                      className={`py-2 rounded-xl text-center border font-semibold ${maxPriceFilter === 'all' ? 'bg-[#C89B3C] text-white border-[#C89B3C]' : 'border-gray-200'}`}
                    >
                      All Prices
                    </button>
                  </div>
                </div>

                {/* Discounts & Flash Sale */}
                <div>
                  <h4 className="font-montserrat font-bold uppercase tracking-wider text-[#2C2C2C] mb-2.5">
                    Offers & Availability
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyFlashSale}
                        onChange={(e) => setOnlyFlashSale(e.target.checked)}
                        className="w-4 h-4 accent-[#C89B3C] rounded"
                      />
                      <span>⚡ Flash Sale Items Only</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 accent-[#C89B3C] rounded"
                      />
                      <span>In Stock Items Only</span>
                    </label>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-montserrat font-bold uppercase tracking-wider text-[#2C2C2C] mb-2.5">
                    Customer Rating
                  </h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setMinRatingFilter(4.5)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between border ${minRatingFilter === 4.5 ? 'bg-amber-500 text-white font-bold border-amber-500' : 'border-gray-200'}`}
                    >
                      <span>4.5★ & above</span>
                      {minRatingFilter === 4.5 && <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setMinRatingFilter(4.0)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between border ${minRatingFilter === 4.0 ? 'bg-amber-500 text-white font-bold border-amber-500' : 'border-gray-200'}`}
                    >
                      <span>4.0★ & above</span>
                      {minRatingFilter === 4.0 && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold font-montserrat"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 bg-[#2C2C2C] text-[#FCE4EC] py-3 rounded-xl font-bold font-montserrat uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Product Cards Grid — Uniform cropping & 2 per row on Mobile */}
        {selectedCategory === 'gift-sets' && !currentSubcategory ? (
          /* When Gift Sets is clicked without choosing a subcategory, only show the CANVAS & FLOWERS choice cards above */
          <div className="py-8 text-center text-xs text-gray-500 font-montserrat font-medium bg-white/60 rounded-3xl border border-[#FCE4EC]">
            ☝️ Please select <strong className="text-[#C89B3C]">CANVAS</strong> or <strong className="text-[#F48FB1]">FLOWERS</strong> above to view curated gift items.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-[#FCE4EC]">
            <div className="w-16 h-16 bg-[#FCE4EC] rounded-full flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#2C2C2C]">No Products Found</h3>
            <p className="text-xs text-gray-500">Try adjusting your subcategory filter, price chip, or search query.</p>
            <button
              onClick={resetAllFilters}
              className="bg-[#2C2C2C] text-[#FCE4EC] font-montserrat font-bold text-xs px-6 py-2.5 rounded-full uppercase shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Quick Add Product Card (Visible for Store Owner / Admin) */}
            <Link
              to="/admin"
              className="group border-2 border-dashed border-[#C89B3C]/50 hover:border-[#C89B3C] bg-gradient-to-b from-[#FFF9F5] to-white rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all hover:shadow-xl cursor-pointer min-h-[300px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C89B3C]/10 text-[#C89B3C] flex items-center justify-center text-2xl font-bold mb-3 group-hover:scale-110 group-hover:bg-[#C89B3C] group-hover:text-white transition-all shadow-xs">
                <Plus className="w-7 h-7" />
              </div>
              <h4 className="font-serif-luxury font-bold text-sm text-[#2C2C2C] group-hover:text-[#C89B3C] transition-colors">
                + Add New Product
              </h4>
              <p className="text-[11px] text-gray-500 font-poppins mt-1">
                Add item to {activeSubcategoryObj ? activeSubcategoryObj.name : activeCategoryObj ? activeCategoryObj.name : 'Catalog'}
              </p>
              <span className="mt-4 bg-[#2C2C2C] text-[#FCE4EC] group-hover:bg-[#C89B3C] group-hover:text-black text-[10px] font-montserrat font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-colors shadow-xs">
                Open Admin Portal →
              </span>
            </Link>
          </div>
        )}

        {/* Catalog Item Counter Footer */}
        <div className="mt-12 text-center text-xs text-gray-400 font-montserrat">
          {selectedCategory === 'gift-sets' && !currentSubcategory 
            ? "Showing Gift Collections (CANVAS & FLOWERS)"
            : `Displaying ${filteredProducts.length} of ${products.length} total items in Sparkle @ KKV collection.`
          }
        </div>

      </div>
    </div>
  );
};
