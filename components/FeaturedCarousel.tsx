
import React, { useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedCarouselProps {
  products: Product[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Approximately one card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group px-0 md:px-4">
      {/* Navigation Buttons - Hidden on mobile as it's no longer a carousel there */}
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-hakimi-sage/20 p-4 rounded-full shadow-xl text-hakimi-forest opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 hover:bg-hakimi-sage hover:text-white -ml-2 md:-ml-8 items-center justify-center"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-hakimi-sage/20 p-4 rounded-full shadow-xl text-hakimi-forest opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 hover:bg-hakimi-sage hover:text-white -mr-2 md:-mr-8 items-center justify-center"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 
          Container behavior:
          - Mobile: flex-col (vertical stack)
          - MD+: flex-row with horizontal scroll and snap
      */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-col md:flex-row gap-6 md:gap-8 md:overflow-x-auto md:snap-x md:snap-mandatory pb-12 pt-6 px-4 md:px-4 no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map(product => (
          <div key={product.id} className="w-full md:min-w-[340px] md:max-w-[340px] snap-center">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* Mobile-only footer hint */}
      <div className="md:hidden text-center mt-2">
        <p className="text-[10px] font-black text-hakimi-sage uppercase tracking-[0.2em] opacity-40">
          Scroll for more exclusives
        </p>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
