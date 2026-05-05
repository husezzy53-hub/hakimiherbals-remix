
import React, { useState } from 'react';
import { ShoppingBag, Search, X, ClipboardList } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleCart } from '../store/cartSlice';
import { toggleHistory } from '../store/historySlice';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onLogoClick }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-[110] glass border-b border-hakimi-forest/5 h-20 md:h-24 transition-all duration-300">
      <div className="container mx-auto px-4 h-full flex items-center justify-between gap-6">
        
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 group cursor-pointer flex-shrink-0"
          onClick={onLogoClick}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-sm border border-hakimi-sage/10 transition-transform duration-500 group-hover:scale-105">
            <img 
              src="https://res.cloudinary.com/dmutdtyen/image/upload/v1767862413/HAkimi_Herbal_LOGO_pmtqf9.jpg" 
              alt="Hakimi Logo" 
              className="h-12 md:h-16 w-auto object-cover"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-xl font-serif font-black text-hakimi-forest tracking-tight leading-none">
              Hakimi
            </h1>
            <span className="text-[9px] font-extrabold text-hakimi-terracotta uppercase tracking-[0.2em] mt-1">
              Herbal Products
            </span>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-grow max-w-lg hidden md:block relative">
          <div className="group relative">
            <input 
              type="text" 
              placeholder="Search for remedies, oils, herbs..." 
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full bg-hakimi-forest/5 border border-transparent focus:border-hakimi-sage/20 focus:bg-white px-12 py-3 rounded-2xl outline-none transition-all font-medium text-hakimi-forest text-sm placeholder:text-gray-400"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hakimi-sage group-focus-within:text-hakimi-terracotta transition-colors" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-3 rounded-2xl bg-hakimi-forest/5 text-hakimi-forest"
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => dispatch(toggleHistory())}
            className="p-3 text-hakimi-forest hover:bg-hakimi-forest/5 rounded-2xl transition-all flex items-center gap-2 group"
          >
            <ClipboardList className="w-5 h-5 group-hover:text-hakimi-terracotta transition-colors" />
            <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest">Orders</span>
          </button>
          
          <button 
            onClick={() => dispatch(toggleCart())}
            className="relative p-3 bg-hakimi-forest text-white rounded-2xl hover:bg-hakimi-terracotta transition-all shadow-xl shadow-hakimi-forest/10 active:scale-95 flex items-center gap-3 px-5 group"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-widest">Bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 bg-white text-hakimi-terracotta text-[10px] font-black flex items-center justify-center rounded-full shadow-lg border-2 border-hakimi-forest group-hover:border-hakimi-terracotta transition-colors">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 w-full p-4 bg-white border-b border-hakimi-sage/10 animate-fade-in shadow-xl">
          <div className="relative">
            <input 
              autoFocus
              type="text" 
              placeholder="Search botanical collection..." 
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full bg-hakimi-cream px-12 py-4 rounded-xl outline-none text-hakimi-forest font-semibold text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hakimi-sage" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
