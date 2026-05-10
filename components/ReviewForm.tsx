
import React, { useState } from 'react';
import { Star, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ReviewFormProps {
  onSuccess: () => void;
  initialName?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSuccess, initialName = '' }) => {
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'reviews'), {
        userName: userName || 'Natural Enthusiast',
        rating,
        comment: '',
        imageUrls: [],
        audioUrl: '',
        status: 'approved',
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit review', err);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 bg-hakimi-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-hakimi-sage" />
        </div>
        <h3 className="text-xl font-serif font-black text-hakimi-forest mb-1">Rating Shared</h3>
        <p className="text-sm text-gray-500 font-medium">Thank you for your feedback.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
      <div className="text-center">
        <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-6">How was your journey?</label>
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`p-2 transition-all duration-300 ${rating >= num ? 'text-hakimi-terracotta scale-125' : 'text-gray-200 hover:text-hakimi-sage/40'}`}
            >
              <Star className={`w-12 h-12 ${rating >= num ? 'fill-current' : ''}`} />
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs font-bold text-hakimi-sage uppercase tracking-widest opacity-60">
          {rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
        </p>
      </div>

      {!initialName && (
        <div className="max-w-xs mx-auto">
          <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-1.5 ml-1">Your Name</label>
          <input
            type="text"
            className="w-full px-5 py-3.5 rounded-2xl bg-hakimi-cream/50 border border-transparent focus:bg-white focus:border-hakimi-sage focus:ring-4 focus:ring-hakimi-sage/10 outline-none transition-all font-medium text-center"
            placeholder="A Natural Enthusiast"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-hakimi-forest hover:bg-hakimi-sage text-white py-5 rounded-2xl font-black shadow-lg shadow-hakimi-forest/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70 active:scale-[0.97] uppercase tracking-widest"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Archiving...
          </>
        ) : (
          <>
            Post Rating <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
