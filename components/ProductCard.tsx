
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Plus, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import ProductModal from './ProductModal';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasMultipleImages = product.images.length > 1;

  useEffect(() => {
    let interval: any;
    // Only auto-cycle if not being manually interacted with (hovered but no recent click)
    // For simplicity, we'll keep the auto-cycle but manual clicks will override the index
    if (isHovered && hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % product.images.length);
      }, 3000); // Slower cycle for better UX
    } else if (!isHovered) {
      setCurrentIdx(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, product.images.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const currentImage = product.images[currentIdx] || 'https://via.placeholder.com/600';

  return (
    <>
      <div 
        className="group relative flex flex-col h-full bg-white rounded-4xl border border-hakimi-forest/5 shadow-sm hover:shadow-2xl hover:shadow-hakimi-forest/10 transition-all duration-500 overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-hakimi-cream/30">
          <img 
            src={currentImage} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-[2s] scale-100 group-hover:scale-105"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-hakimi-forest/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-hakimi-forest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform flex items-center gap-2">
              <Maximize2 className="w-3 h-3" /> Quick Details
            </div>
          </div>

          {/* Carousel Controls (Visible on hover or if multiple images) */}
          {hasMultipleImages && (
            <>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={prevImage}
                  className="p-2 bg-white/90 backdrop-blur-md text-hakimi-forest rounded-xl shadow-lg hover:bg-hakimi-terracotta hover:text-white transition-all active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextImage}
                  className="p-2 bg-white/90 backdrop-blur-md text-hakimi-forest rounded-xl shadow-lg hover:bg-hakimi-terracotta hover:text-white transition-all active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentIdx ? 'bg-hakimi-terracotta w-6' : 'bg-white/60 w-1.5 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-hakimi-forest text-[9px] font-bold rounded-xl uppercase tracking-widest border border-hakimi-forest/5 shadow-sm">
              {product.category}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <div className="flex-grow space-y-2">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-hakimi-forest leading-tight group-hover:text-hakimi-terracotta transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-hakimi-forest/5">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-hakimi-sage uppercase tracking-widest mb-0.5">Price</span>
              <span className="text-xl font-serif font-black text-hakimi-forest">
                Rs. {product.price}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); dispatch(addToCart(product)); }}
              className="bg-hakimi-forest text-white h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-hakimi-terracotta transition-all shadow-lg active:scale-90"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
