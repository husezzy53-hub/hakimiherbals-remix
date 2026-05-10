
import React, { useEffect, useState } from 'react';
import { Star, User } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Review } from '../types';

interface ReviewListProps {
  onAddReview: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ onAddReview }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-12 h-12 border-4 border-hakimi-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 bg-hakimi-cream/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <div className="max-w-xl">
            <span className="text-hakimi-terracotta font-black tracking-[0.3em] uppercase text-xs">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-hakimi-forest mt-3 leading-tight">Wisdom from the Collective</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onAddReview}
              className="px-6 py-3 bg-hakimi-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-hakimi-forest/20 hover:bg-hakimi-sage transition-all active:scale-95"
            >
              The Hakimi Experience
            </button>
            <div className="flex font-black text-[10px] uppercase tracking-widest text-hakimi-sage items-center gap-2 opacity-60">
              <Star className="w-4 h-4 fill-current text-hakimi-terracotta" /> 
              Truly Natural Experiences
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-8 pb-12 -mx-4 px-4 snap-x">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="flex-shrink-0 w-80 md:w-96 bg-white rounded-5xl p-8 border border-hakimi-sage/10 shadow-sm snap-start flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-hakimi-cream rounded-2xl flex items-center justify-center text-hakimi-sage">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-hakimi-forest">{review.userName}</h4>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < review.rating ? 'text-hakimi-terracotta fill-current' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {review.comment && (
                <div className="relative mb-6">
                  <p className="text-hakimi-forest/80 font-medium italic leading-relaxed text-balance">
                    "{review.comment}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewList;
