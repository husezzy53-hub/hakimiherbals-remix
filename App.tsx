
import React, { useEffect, useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import FeaturedCarousel from './components/FeaturedCarousel';
import AdminPanel from './components/AdminPanel';
import PurchaseDashboard from './components/PurchaseDashboard';
import ProductModal from './components/ProductModal';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { fetchProducts } from './store/productsSlice';
import { setHistoryOpen } from './store/historySlice';
import { Settings, MessageSquare, ArrowUp, RotateCcw } from 'lucide-react';
import { OWNER_PHONE_NUMBER } from './constants';
import { Product } from './types';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [highlightedProduct, setHighlightedProduct] = useState<Product | null>(null);
  
  // Splash Screen States
  const [showSplash, setShowSplash] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    
    const timer = setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, 950);

    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch]);

  useEffect(() => {
    if (minimumTimeElapsed && !loading) {
      setSplashExiting(true);
      const exitTimer = setTimeout(() => {
        setShowSplash(false);
      }, 300);
      return () => clearTimeout(exitTimer);
    }
  }, [minimumTimeElapsed, loading]);

  const categories = useMemo<string[]>(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    const uniqueCats = Array.from(new Set(cats)) as string[];
    return ['All', ...uniqueCats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' ? true : p.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const featuredProducts = products.filter(p => p.category === 'Featured');

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSplash) {
    return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-hakimi-cream ${splashExiting ? 'animate-splash-exit' : ''}`}>
        <div className="relative flex flex-col items-center max-w-sm px-8 text-center">
          <div className="relative mb-6 opacity-0 animate-logo-reveal">
            <div className="absolute -inset-4 bg-hakimi-sage/10 blur-2xl rounded-full"></div>
            <img 
              src="https://res.cloudinary.com/dmutdtyen/image/upload/v1767862413/HAkimi_Herbal_LOGO_pmtqf9.jpg" 
              alt="Hakimi Logo" 
              className="relative w-32 md:w-44 h-auto object-contain rounded-[2.5rem] shadow-2xl border border-hakimi-sage/10"
            />
          </div>
          <div className="opacity-0 animate-text-reveal flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-serif font-black text-hakimi-forest leading-none tracking-tight">
              Hakimi Herbal
            </h1>
            <span className="mt-2.5 px-6 py-2 bg-hakimi-terracotta text-white text-[10px] md:text-xs font-black uppercase tracking-[0.4em] rounded-full shadow-lg shadow-hakimi-terracotta/20">
              Products
            </span>
            <p className="mt-8 text-[9px] font-black text-hakimi-sage uppercase tracking-[0.2em] opacity-40">
              Opening Apothecary...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hakimi-cream flex-col p-8 text-center animate-fade-in">
        <h2 className="text-3xl font-serif font-black text-hakimi-forest">Nature is Restoring</h2>
        <p className="text-gray-600 mt-2 max-w-xs">We couldn't reach the herbal archive.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-10 py-4 bg-hakimi-forest text-white rounded-2xl font-black uppercase tracking-widest text-xs"
        >
          Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-hakimi-sage selection:text-white bg-hakimi-cream animate-fade-in">
      <Navbar 
        onSearch={setSearchQuery} 
        onLogoClick={resetFilters}
      />
      <CartSidebar />
      <PurchaseDashboard />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      
      {highlightedProduct && (
        <ProductModal 
          product={highlightedProduct} 
          isOpen={!!highlightedProduct} 
          onClose={() => setHighlightedProduct(null)} 
        />
      )}
      
      <main className="flex-grow">
        <Hero />
        
        {featuredProducts.length > 0 && searchQuery === '' && (
          <section id="featured" className="py-20 bg-white relative overflow-hidden">
             <div className="container mx-auto px-4 relative z-10">
              <div className="mb-12 px-2">
                <span className="text-hakimi-terracotta font-black tracking-[0.3em] uppercase text-xs">Exclusives</span>
                <h2 className="text-4xl md:text-5xl font-serif font-black text-hakimi-forest mt-2">Wild Selection</h2>
              </div>
              <FeaturedCarousel products={featuredProducts} />
             </div>
          </section>
        )}

        <section id="collection" className="py-24 bg-hakimi-cream">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-hakimi-sage font-black tracking-[0.3em] uppercase text-xs">Our Apothecary</span>
                  <div className="px-2 py-0.5 bg-hakimi-forest/5 rounded-md text-[10px] font-bold text-hakimi-forest/40 uppercase tracking-tighter">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-black text-hakimi-forest leading-tight">Traditional Healing</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (cat === 'All') setSearchQuery('');
                    }}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                      selectedCategory === cat 
                      ? 'bg-hakimi-forest text-white border-hakimi-forest' 
                      : 'bg-white text-hakimi-sage border-hakimi-sage/10 hover:border-hakimi-sage/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="py-32 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-hakimi-forest/5 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-hakimi-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <RotateCcw className="w-6 h-6 text-hakimi-sage/40" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-hakimi-forest">No herbal products match your search</h3>
                <p className="text-gray-500 mt-2 font-medium">Try different keywords or browse our full collection.</p>
                <button 
                  onClick={resetFilters} 
                  className="mt-8 px-10 py-4 bg-hakimi-forest text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 mx-auto hover:bg-hakimi-terracotta transition-all active:scale-95 shadow-xl shadow-hakimi-forest/10"
                >
                  Show All Products
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
        {showBackToTop && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-4 bg-white shadow-2xl rounded-2xl text-hakimi-forest hover:bg-hakimi-forest hover:text-white transition-all border border-hakimi-sage/10 group"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
        <a 
          href={`https://wa.me/${OWNER_PHONE_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="p-5 bg-[#25D366] text-white rounded-3xl shadow-2xl hover:scale-110 transition-all active:scale-95 group relative"
        >
          <MessageSquare className="w-7 h-7" />
        </a>
      </div>

      <footer className="bg-hakimi-forest text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16 mb-20">
             <div className="lg:col-span-1">
                <h2 className="text-3xl font-serif font-black text-hakimi-cream mb-4">Hakimi</h2>
                <p className="text-gray-400 leading-relaxed font-medium">Preserving ancient wisdom for the modern spirit.</p>
             </div>
             <div>
               <h3 className="text-xs font-black text-hakimi-sage uppercase tracking-[0.3em] mb-8">Navigation</h3>
               <ul className="space-y-4 font-bold text-gray-400">
                 <li><button onClick={() => dispatch(setHistoryOpen(true))} className="hover:text-white transition-colors">Order History</button></li>
                 <li><button className="hover:text-white transition-colors">Bulk Orders</button></li>
               </ul>
             </div>
             <div>
               <h3 className="text-xs font-black text-hakimi-sage uppercase tracking-[0.3em] mb-8">Owner Access</h3>
               <button 
                 onClick={() => setIsAdminOpen(true)}
                 className="flex items-center gap-3 bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-hakimi-terracotta/30 transition-all text-left w-full"
               >
                 <Settings className="text-hakimi-terracotta" />
                 <div className="text-white font-bold text-sm">Management Portal</div>
               </button>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
