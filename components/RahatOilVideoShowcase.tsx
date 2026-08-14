import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2, ShoppingBag, Wind, Flame, Droplets, RotateCcw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Product } from '../types';

interface RahatOilVideoShowcaseProps {
  product?: Product;
  onOpenProductModal?: (product: Product) => void;
}

// Key storyboard frames from the Rahat Oil video
const VIDEO_SCENES = [
  {
    id: 1,
    time: "0:00 - 0:02",
    title: "Back & Knee Discomfort Relief",
    desc: "Targeted soothing comfort for daily stiffness, back aches, and joint fatigue.",
    image: "https://res.cloudinary.com/dmutdtyen/image/upload/v1770618869/RaHAT_OIL_kmfh5z.jpg",
    badge: "Instant Comfort"
  },
  {
    id: 2,
    time: "0:02 - 0:04",
    title: "100% Herbal Dropper Extraction",
    desc: "4 to 5 drops of concentrated botanical oil with pure camphor crystals & cooling mint.",
    image: "https://res.cloudinary.com/dmutdtyen/image/upload/v1770618876/RAHAT_OIL_BACK_gib3ef.jpg",
    badge: "Herbal Purity"
  },
  {
    id: 3,
    time: "0:04 - 0:06",
    title: "Quick-Absorbing Deep Massage",
    desc: "Smoothly warms muscles, improves circulation, and eases stiffness without greasy residue.",
    image: "https://res.cloudinary.com/dmutdtyen/image/upload/v1770618869/RaHAT_OIL_kmfh5z.jpg",
    badge: "Fast Absorption"
  },
  {
    id: 4,
    time: "0:06 - 0:09",
    title: "Aromatic Vapor & Total Relaxation",
    desc: "Refreshing natural vapors open nasal passages and help you breathe freely and relax.",
    image: "https://res.cloudinary.com/dmutdtyen/image/upload/v1770618876/RAHAT_OIL_BACK_gib3ef.jpg",
    badge: "Mind & Body Calm"
  }
];

export const RahatOilVideoShowcase: React.FC<RahatOilVideoShowcaseProps> = ({ product, onOpenProductModal }) => {
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const timerRef = useRef<any>(null);

  const fallbackProduct: Product = product || {
    id: 4,
    name: "Rahat Oil - Massage Oil",
    price: 400,
    description: "Its refreshing aroma opens nasal passages, helping you breathe freely and helps in Daily body aches",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1770618869/RaHAT_OIL_kmfh5z.jpg",
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1770618876/RAHAT_OIL_BACK_gib3ef.jpg"
    ],
    category: "Featured"
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSceneIdx(prev => (prev + 1) % VIDEO_SCENES.length);
      }, 3000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleAddToCart = () => {
    dispatch(addToCart(fallbackProduct));
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
  };

  const currentScene = VIDEO_SCENES[currentSceneIdx];

  return (
    <section id="rahat-oil-showcase" className="py-16 md:py-24 bg-gradient-to-b from-hakimi-cream via-[#F5EFE6] to-hakimi-cream relative overflow-hidden">
      {/* Decorative botanical glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-hakimi-sage/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-hakimi-terracotta/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-hakimi-forest/10 border border-hakimi-forest/15 text-hakimi-forest text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-hakimi-terracotta animate-spin-slow" />
            Official Remedy Showcase
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-hakimi-forest tracking-tight">
            Herbal Rahat Oil <span className="text-hakimi-terracotta">Benefits</span>
          </h2>
          <p className="text-gray-600 mt-4 text-base md:text-lg font-medium leading-relaxed">
            Your Everyday Massage Companion — Specially formulated with natural camphor, refreshing mint, and warming ginger to bring targeted comfort to back, knee, and muscular fatigue.
          </p>
        </div>

        {/* Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left: Video Player Card */}
          <div className="lg:col-span-7 bg-hakimi-forest text-white rounded-[2.5rem] p-4 md:p-6 shadow-2xl shadow-hakimi-forest/25 relative overflow-hidden border border-hakimi-sage/20">
            
            {/* Cinematic Video Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-black flex items-center justify-center group shadow-inner">
              
              {/* Active Scene Backdrop */}
              <img 
                src={currentScene.image} 
                alt={currentScene.title}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 transition-all duration-1000 transform group-hover:scale-105"
              />
              
              {/* Dark subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

              {/* Scene Badge Overlay */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-hakimi-sage text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {currentScene.badge}
                </span>
                <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                  {currentScene.time}
                </span>
              </div>

              {/* Center Play / Pause Indicator */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-20 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all transform active:scale-95 hover:scale-110 shadow-2xl"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 md:w-8 md:h-8 fill-white" />
                ) : (
                  <Play className="w-7 h-7 md:w-8 md:h-8 fill-white translate-x-0.5" />
                )}
              </button>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
                <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-md">
                  {currentScene.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-200 line-clamp-2 mt-1 drop-shadow">
                  {currentScene.desc}
                </p>
              </div>
            </div>

            {/* Video Controls & Scene Track Bar */}
            <div className="mt-4 pt-3 flex flex-col gap-3">
              {/* Progress Scene Selectors */}
              <div className="grid grid-cols-4 gap-2">
                {VIDEO_SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-2 rounded-full transition-all duration-500 relative overflow-hidden ${
                      idx === currentSceneIdx 
                        ? 'bg-hakimi-terracotta ring-2 ring-hakimi-terracotta/40' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                    title={scene.title}
                  />
                ))}
              </div>

              {/* Bottom Action Strip */}
              <div className="flex items-center justify-between text-xs text-gray-300 px-1 pt-1">
                <div className="flex items-center gap-3 font-semibold">
                  <span className="text-hakimi-sage uppercase tracking-wider text-[11px]">
                    Scene {currentSceneIdx + 1} of 4
                  </span>
                  <span>•</span>
                  <span>Massage & Breathe Freely</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
                  >
                    {isPlaying ? "Pause Demo" : "Play Demo"}
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
                    title={isMuted ? "Sound Off" : "Sound On"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Key Benefits & Purchase Box */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Benefits Feature Cards */}
            <div className="space-y-3.5">
              
              <div className="bg-white p-4 md:p-5 rounded-3xl border border-hakimi-sage/20 shadow-sm flex items-start gap-4 hover:border-hakimi-sage/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200/60">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-hakimi-forest text-base">Back & Knee Comfort</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-0.5 leading-relaxed">
                    Warming herbal penetration calms everyday body stiffness, joint fatigue, and back tightness quickly.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-3xl border border-hakimi-sage/20 shadow-sm flex items-start gap-4 hover:border-hakimi-sage/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 border border-teal-200/60">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-hakimi-forest text-base">Opens Nasal Passages</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-0.5 leading-relaxed">
                    Invigorating natural vapors of pure mint and herbal essences help you breathe deeply and refresh mental clarity.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-3xl border border-hakimi-sage/20 shadow-sm flex items-start gap-4 hover:border-hakimi-sage/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200/60">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-hakimi-forest text-base">Natural Botantical Infusion</h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-0.5 leading-relaxed">
                    Crafted with natural Camphor crystals (*Kafoor*), soothing Field Mint, and warming Ginger roots in pure oil.
                  </p>
                </div>
              </div>

            </div>

            {/* Quick How-To-Use Banner */}
            <div className="bg-hakimi-forest/5 rounded-2xl p-4 border border-hakimi-forest/10 flex items-center justify-between text-xs text-hakimi-forest">
              <span className="font-bold flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-hakimi-terracotta" />
                Application Ritual:
              </span>
              <span className="font-medium text-gray-700">
                Apply 4–5 drops • Massage gently in circular motions
              </span>
            </div>

            {/* Price & Order CTA Card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-hakimi-forest/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-hakimi-terracotta">
                    Pure Herbal Remedy
                  </span>
                  <h3 className="text-2xl font-serif font-black text-hakimi-forest">
                    Rahat Oil
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block line-through">Rs. 500</span>
                  <span className="text-3xl font-black text-hakimi-forest">
                    Rs. 400
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-hakimi-forest hover:bg-hakimi-terracotta text-white py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-hakimi-forest/20 flex items-center justify-center gap-2.5 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Order Rahat Oil
                </button>
                {onOpenProductModal && (
                  <button
                    onClick={() => onOpenProductModal(fallbackProduct)}
                    className="bg-hakimi-cream hover:bg-hakimi-sage/20 text-hakimi-forest py-4 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors border border-hakimi-forest/10"
                  >
                    View Details
                  </button>
                )}
              </div>

              {addedToCartToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rahat Oil added to your basket!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default RahatOilVideoShowcase;
