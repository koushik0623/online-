import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer = () => {
  const { brandInfo } = useShop();

  return (
    <footer className="bg-[#2C2C2C] text-white pt-16 pb-8 border-t-4 border-[#C89B3C] font-poppins relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gray-700/60 text-center font-montserrat text-xs">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-6 h-6 text-[#D4AF7F]" />
            <span className="font-bold text-[#FCE4EC]">Free Pan-India Delivery</span>
            <span className="text-[11px] text-gray-400 font-light">On all orders above ₹999</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#D4AF7F]" />
            <span className="font-bold text-[#FCE4EC]">100% Handcrafted</span>
            <span className="text-[11px] text-gray-400 font-light">Premium Anti-Tarnish Finish</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#D4AF7F]" />
            <span className="font-bold text-[#FCE4EC]">7 Days Easy Exchange</span>
            <span className="text-[11px] text-gray-400 font-light">Hassle-free guarantee</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Heart className="w-6 h-6 text-[#F48FB1]" />
            <span className="font-bold text-[#FCE4EC]">Luxury Velvet Box</span>
            <span className="text-[11px] text-gray-400 font-light">Boutique gift packaging</span>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12">
          
          {/* Brand Info Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF9F5]/10 border border-[#D4AF7F]/40 flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 text-[#C89B3C]" />
              </div>
              <div className="flex items-baseline gap-1 leading-none">
                <span className="font-serif-luxury text-3xl font-extrabold tracking-tight text-[#C89B3C] leading-none uppercase">
                  SPARKLE
                </span>
                <span className="font-poppins text-sm font-extrabold text-white lowercase leading-none">
                  @kkv
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-light leading-relaxed">
              {brandInfo.tagline} {brandInfo.secondaryTagline} Curated for modern women who love luxury, elegance, and statement fashion accessories.
            </p>

            <div className="space-y-2 text-xs text-gray-300 pt-2 font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF7F] shrink-0 mt-0.5" />
                <span>{brandInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF7F] shrink-0" />
                <span>{brandInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF7F] shrink-0" />
                <span>{brandInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-3 space-y-3 font-montserrat text-xs">
            <h4 className="text-[#D4AF7F] uppercase tracking-widest font-bold font-serif-luxury text-sm">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-gray-300 font-light">
              <li><Link to="/shop?category=earrings" className="hover:text-[#C89B3C] transition-colors">✨ Earrings & Kundan Jhumkas</Link></li>
              <li><Link to="/shop?category=hair-accessories" className="hover:text-[#C89B3C] transition-colors">🌸 Hair Clips & Plumeria Flowers</Link></li>
              <li><Link to="/shop?category=necklaces" className="hover:text-[#C89B3C] transition-colors">📿 Bridal Choker & Necklace Sets</Link></li>
              <li><Link to="/shop?category=chains" className="hover:text-[#C89B3C] transition-colors">⛓️ Anti-Tarnish Chains & Pendants</Link></li>
              <li><Link to="/shop?category=bracelets" className="hover:text-[#C89B3C] transition-colors">💎 Chain & Kada Bracelets</Link></li>
              <li><Link to="/shop?category=bangles" className="hover:text-[#C89B3C] transition-colors">🔱 Kemp & Antique Bangles</Link></li>
              <li><Link to="/shop?category=gift-sets" className="hover:text-[#C89B3C] text-[#D4AF7F] font-semibold transition-colors">🎁 Luxury Festive Gift Sets</Link></li>
            </ul>
          </div>

          {/* Customer Care Care */}
          <div className="md:col-span-3 space-y-3 font-montserrat text-xs">
            <h4 className="text-[#D4AF7F] uppercase tracking-widest font-bold font-serif-luxury text-sm">
              Customer Support
            </h4>
            <ul className="space-y-2 text-gray-300 font-light">
              <li><Link to="/dashboard" className="hover:text-[#C89B3C] transition-colors">Track Your Order</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#C89B3C] transition-colors">My Account & Saved Addresses</Link></li>
              <li><Link to="/admin" className="text-[#C89B3C] font-bold hover:underline flex items-center gap-1">🛡️ Admin Portal (Add Products & Orders)</Link></li>
              <li><a href="#about" className="hover:text-[#C89B3C] transition-colors">About <strong className="text-[#C89B3C] uppercase">SPARKLE</strong> <span className="text-white lowercase text-[10px]">@kkv</span></a></li>
              <li><a href="#exchange" className="hover:text-[#C89B3C] transition-colors">7 Days Exchange Policy</a></li>
              <li><a href="#care" className="hover:text-[#C89B3C] transition-colors">Jewelry Care Guide</a></li>
            </ul>
          </div>

          {/* Connect & Payment Badges */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[#D4AF7F] uppercase tracking-widest font-bold font-serif-luxury text-sm font-montserrat">
              Safe Payments
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-montserrat">
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-[#FCE4EC] font-bold">PhonePe</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-[#FCE4EC] font-bold">Google Pay</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-[#FCE4EC] font-bold">Paytm</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-[#FCE4EC] font-bold">SuperMoney</span>
            </div>

            <div className="pt-2">
              <span className="text-xs text-gray-400 font-poppins block mb-1">Follow Our Journey</span>
              <a
                href={brandInfo.socials.instagramUrl || "https://www.instagram.com/sparklekkvoffical?igsh=MW8ydzIza3oybmM2aQ=="}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#D4AF7F] hover:text-[#FCE4EC] hover:underline flex items-center gap-1.5 transition-colors"
              >
                {brandInfo.socials.instagram}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 font-poppins gap-4">
          <p>© {new Date().getFullYear()} <strong className="text-[#C89B3C] font-extrabold uppercase">SPARKLE</strong> <span className="text-white font-extrabold lowercase text-[10px]">@kkv</span>. All Rights Reserved. Luxury Accessories Brand.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a href="#sitemap" className="hover:underline">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
