
import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // Fix: Use any for the timer reference to avoid NodeJS.Timeout namespace errors in browser environments
  const autoPlayRef = useRef<any>(null);

  const hasMultipleImages = product.images.length > 1;

  // Auto-cycling logic
  useEffect(() => {
    if (isOpen && hasMultipleImages) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isOpen, hasMultipleImages, product.id]); // Re-run if product changes

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % product.images.length);
    }, 2000); // Cycle every 2 seconds
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  if (!isOpen) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    onClose();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopAutoPlay(); // Stop auto-play on manual interaction
    setCurrentIdx((prev) => (prev + 1) % product.images.length);
    startAutoPlay(); // Restart to maintain timing
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopAutoPlay();
    setCurrentIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
    startAutoPlay();
  };

  const selectImage = (index: number) => {
    stopAutoPlay();
    setCurrentIdx(index);
    startAutoPlay();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-hakimi-forest/90 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl h-full md:h-auto max-h-screen md:max-h-[90vh] md:rounded-5xl overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-fade-in-up">
        
        {/* Left: Product Images Gallery */}
        <div 
          className="w-full lg:w-[55%] bg-hakimi-cream/40 relative flex items-center justify-center min-h-[40vh] lg:min-h-0 p-6 lg:p-12 overflow-hidden"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          {/* Mobile Back Button */}
          <button 
            onClick={onClose} 
            className="absolute top-6 left-6 z-30 lg:hidden p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-xl active:scale-90 transition-transform"
          >
            <X className="w-5 h-5 text-hakimi-forest" />
          </button>

          {/* Image Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-hakimi-forest hover:text-white text-hakimi-forest transition-all active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-hakimi-forest hover:text-white text-hakimi-forest transition-all active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              key={`${product.id}-${currentIdx}`}
              src={product.images[currentIdx] || 'https://via.placeholder.com/1200'} 
              className="max-w-full max-h-[35vh] lg:max-h-full object-contain drop-shadow-2xl animate-fade-in transition-all duration-700"
              alt={`${product.name} - View ${currentIdx + 1}`}
            />
          </div>

          {/* Gallery Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3">
              <div className="px-3 py-1 bg-hakimi-forest/10 rounded-full text-[10px] font-black text-hakimi-forest uppercase tracking-widest backdrop-blur-sm">
                {currentIdx + 1} / {product.images.length}
              </div>
              <div className="flex justify-center gap-2">
                {product.images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => selectImage(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${i === currentIdx ? 'bg-hakimi-forest w-10' : 'bg-hakimi-forest/20 w-2 hover:bg-hakimi-forest/40'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-[45%] p-8 lg:p-14 flex flex-col overflow-y-auto bg-white rounded-t-4xl md:rounded-t-none">
          <div className="flex justify-between items-start mb-6">
            <span className="px-4 py-1.5 bg-hakimi-terracotta/10 text-hakimi-terracotta text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {product.category}
            </span>
            <button onClick={onClose} className="hidden lg:block p-2 hover:bg-hakimi-cream rounded-full transition-colors text-gray-300 hover:text-hakimi-forest">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-serif font-black text-hakimi-forest mb-4 leading-tight">
            {product.name}
          </h2>
          
          <div className="text-2xl lg:text-3xl font-serif font-black text-hakimi-sage mb-8">
            Rs. {product.price}
          </div>

          <div className="space-y-8 flex-grow">
            <div>
              <h4 className="text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-3 opacity-40">The Essence</h4>
              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                {product.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 lg:p-5 rounded-3xl bg-hakimi-cream border border-hakimi-forest/5">
                <p className="text-[9px] font-bold text-hakimi-sage uppercase tracking-widest mb-1">Purity</p>
                <p className="font-bold text-hakimi-forest text-sm lg:text-base">Hand-Crafted</p>
              </div>
              <div className="p-4 lg:p-5 rounded-3xl bg-hakimi-cream border border-hakimi-forest/5">
                <p className="text-[9px] font-bold text-hakimi-sage uppercase tracking-widest mb-1">Ethos</p>
                <p className="font-bold text-hakimi-forest text-sm lg:text-base">Sustainable</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-hakimi-forest/5 space-y-6 pb-8 md:pb-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-hakimi-forest">Quantity</span>
              <div className="flex items-center gap-6 bg-hakimi-cream p-2 px-4 rounded-2xl">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  className="p-1 hover:text-hakimi-terracotta transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-lg w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)} 
                  className="p-1 hover:text-hakimi-sage transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-hakimi-forest hover:bg-hakimi-terracotta text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-hakimi-forest/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-widest"
            >
              <ShoppingBag className="w-5 h-5" /> Add To Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
