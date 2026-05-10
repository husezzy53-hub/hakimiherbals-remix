
import React from 'react';
import { X, Star } from 'lucide-react';
import ReviewForm from './ReviewForm';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-hakimi-forest/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-hakimi-cream rounded-5xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border border-hakimi-sage/20">
        <div className="bg-hakimi-forest p-8 text-hakimi-cream flex justify-between items-center relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-hakimi-terracotta/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-black tracking-tight">The Hakimi Experience</h2>
            <p className="text-hakimi-sage font-medium text-sm">Help others discover the power of nature</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 bg-white max-h-[75vh] overflow-y-auto no-scrollbar">
          <ReviewForm onSuccess={onClose} />
        </div>

        <div className="p-4 bg-hakimi-cream/50 border-t border-hakimi-sage/10 text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-hakimi-sage">
            <Star className="w-3 h-3 fill-current text-hakimi-terracotta" />
            Every Reflection Matters
            <Star className="w-3 h-3 fill-current text-hakimi-terracotta" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
