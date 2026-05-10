
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface HeroProps {
  onAddReview: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAddReview }) => {
  const products = useSelector((state: RootState) => state.products.items);
  const [current, setCurrent] = useState(0);

  const slides = products.slice(0, 5).map(product => ({
    id: product.id,
    title: product.name,
    subtitle: product.description,
    image: product.images[0] || 'https://via.placeholder.com/1200x600?text=Hakimi+Herbals',
    cta: "Shop The Harvest",
    targetId: "collection"
  }));

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const handleCtaClick = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[600px] md:h-[650px] w-full overflow-hidden bg-hakimi-forest">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] scale-100 group-hover:scale-110"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-hakimi-forest via-hakimi-forest/40 to-transparent" />
          
          <div className="absolute inset-0 flex items-center container mx-auto px-6 md:px-12">
            <div className="max-w-2xl text-hakimi-cream space-y-6">
              <span className="inline-block px-4 py-1.5 bg-hakimi-terracotta/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-hakimi-terracotta animate-fade-in-up">
                Seasonal Essentials
              </span>
              <h2 className="text-5xl md:text-7xl font-serif font-black leading-tight drop-shadow-sm text-balance animate-fade-in-up [animation-delay:200ms]">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl font-medium text-hakimi-cream/80 max-w-lg leading-relaxed line-clamp-2 animate-fade-in-up [animation-delay:400ms]">
                {slide.subtitle}
              </p>
              <div className="pt-4 flex flex-wrap gap-4 animate-fade-in-up [animation-delay:600ms]">
                <button 
                  onClick={() => handleCtaClick(slide.targetId)}
                  className="px-8 py-4 bg-white text-hakimi-forest hover:bg-hakimi-terracotta hover:text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl flex items-center gap-3"
                >
                  {slide.cta} <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={onAddReview}
                  className="px-8 py-4 bg-hakimi-forest/40 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-hakimi-forest font-bold rounded-2xl transition-all duration-300 shadow-xl flex items-center gap-3"
                >
                  Rate Website
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
          <button 
            onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modern Indicators */}
      <div className="absolute bottom-12 left-12 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === current ? 'bg-hakimi-terracotta w-12' : 'bg-white/20 w-3 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
