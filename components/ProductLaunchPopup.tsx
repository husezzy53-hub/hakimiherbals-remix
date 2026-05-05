
import React, { useEffect, useState, useRef } from 'react';
import { X, Sparkles, CheckCircle2, Leaf, ChevronLeft, ChevronRight, Timer } from 'lucide-react';

interface ProductLaunchPopupProps {
  onShopNow?: () => void;
}

const ProductLaunchPopup: React.FC<ProductLaunchPopupProps> = ({ onShopNow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3); // Shortened to 3 seconds for direct access
  const autoTimerRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);
  const imageCycleRef = useRef<any>(null);

  const images = [
    "https://res.cloudinary.com/dmutdtyen/image/upload/v1770614384/single_body_spray_with_poch_ieo0ts.jpg",
    "https://res.cloudinary.com/dmutdtyen/image/upload/v1770614383/single_small_body_spray_vbrrdb.jpg",
    "https://res.cloudinary.com/dmutdtyen/image/upload/v1770614383/single_body_spray_in_a_poch_avilqb.jpg"
  ];

  // Added missing navigation functions to resolve reference errors
  const nextImg = () => {
    setCurrentImg((prev) => (prev + 1) % images.length);
  };

  const prevImg = () => {
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hakimi_launch_popup_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-action and Image Cycling logic
  useEffect(() => {
    if (isOpen) {
      // 3 second total display time before auto-navigation
      autoTimerRef.current = setTimeout(() => {
        handleShopNow();
      }, 3000);

      // Countdown visual
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);

      // Image cycling every 2 seconds
      imageCycleRef.current = setInterval(() => {
        nextImg();
      }, 2000);
    }

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (imageCycleRef.current) clearInterval(imageCycleRef.current);
    };
  }, [isOpen]);

  const handleShopNow = () => {
    setIsOpen(false);
    sessionStorage.setItem('hakimi_launch_popup_seen', 'true');
    
    // Clear all timers
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (imageCycleRef.current) clearInterval(imageCycleRef.current);

    if (onShopNow) {
      onShopNow();
    } else {
      const element = document.getElementById('collection');
      if (element) {
        // Use instant jump for "Direct" feel
        element.scrollIntoView({ behavior: 'auto' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop - now triggers direct navigation on click */}
      <div 
        className="absolute inset-0 bg-hakimi-forest/60 backdrop-blur-md animate-fade-in" 
        onClick={handleShopNow}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(27,43,28,0.3)] animate-fade-in-up border border-hakimi-sage/20 flex flex-col">
        
        {/* Auto-timer Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-hakimi-terracotta z-30 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 3) * 100}%` }} />

        {/* Top Visual Brand Bar */}
        <div className="h-2 bg-gradient-to-r from-hakimi-sage via-hakimi-terracotta to-hakimi-sage" />

        {/* Close button now also leads to Main Page */}
        <button 
          onClick={handleShopNow}
          className="absolute top-6 right-6 z-20 p-2 bg-white/90 backdrop-blur-sm hover:bg-hakimi-forest hover:text-white rounded-full transition-all text-hakimi-forest shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="relative w-full aspect-[16/10] bg-hakimi-cream overflow-hidden">
          <img 
            src={images[currentImg]} 
            alt="Hakimi Body Spray" 
            className="w-full h-full object-cover animate-fade-in transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
          
          {/* Image Navigation */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
            <button 
              onClick={(e) => { e.stopPropagation(); prevImg(); }}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-hakimi-forest" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextImg(); }}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5 text-hakimi-forest" />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImg ? 'bg-hakimi-forest w-8' : 'bg-white/50 w-1.5'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10 pt-6">
          <div className="flex flex-col items-center text-center">
            
            {/* Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-hakimi-terracotta/10 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-hakimi-terracotta" />
              <span className="text-[10px] font-black text-hakimi-terracotta uppercase tracking-[0.2em]">New Harvest Launch</span>
            </div>

            {/* Product Title */}
            <h2 className="text-3xl md:text-4xl font-serif font-black text-hakimi-forest leading-tight mb-3">
              Hakimi Herbal <br/>
              <span className="text-hakimi-sage italic font-normal">Body Spray</span>
            </h2>

            <p className="text-gray-500 font-medium leading-relaxed mb-6 max-w-sm text-sm">
              An essence of purity crafted for <span className="text-hakimi-forest font-bold">Shehrullah</span>. Experience nature-infused fragrance that lingers with spiritual grace.
            </p>

            {/* Features Grid */}
            <div className="w-full space-y-2.5 mb-8">
              <div className="flex items-center gap-3 p-3 bg-hakimi-cream rounded-2xl border border-hakimi-forest/5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-hakimi-sage shadow-sm">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-hakimi-forest uppercase tracking-wider">Pure Fragrance</p>
                  <p className="text-[11px] text-gray-400 font-medium">Free From Alcohol & Harmful Chemicals</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-hakimi-cream rounded-2xl border border-hakimi-forest/5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-hakimi-terracotta shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-hakimi-forest uppercase tracking-wider">Safe for daily use</p>
                  <p className="text-[11px] text-gray-400 font-medium">Gentle on skin, potent in essence</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={handleShopNow}
              className="w-full bg-hakimi-forest hover:bg-hakimi-terracotta text-white py-5 rounded-2xl font-black text-base shadow-2xl shadow-hakimi-forest/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-widest group relative overflow-hidden"
            >
              <span className="relative z-10">Shop Now</span>
              <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors relative z-10">
                <ChevronRight className="w-4 h-4" />
              </div>
              
              {/* Countdown overlay indicator */}
              <div className="absolute right-4 bottom-2 text-[8px] opacity-40 flex items-center gap-1">
                <Timer className="w-2 h-2" /> {timeLeft}s
              </div>
            </button>

            <p className="mt-4 text-[9px] font-black text-hakimi-sage uppercase tracking-[0.3em] opacity-40">
              Traditional Healing • Modern Purity
            </p>
          </div>
        </div>

        {/* Decorative corner leaves */}
        <Leaf className="absolute -bottom-6 -left-6 w-20 h-20 text-hakimi-sage/5 -rotate-12 pointer-events-none" />
      </div>
    </div>
  );
};

export default ProductLaunchPopup;
