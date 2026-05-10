
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Review } from '../types';
import { Check, X, ShieldAlert, Star, Trash2, Calendar } from 'lucide-react';

const ReviewAdmin: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status });
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Missing or insufficient permissions. Are you logged in as admin?');
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to harvest this review out of existence?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  if (loading) return <div className="p-8 text-center"><ShieldAlert className="w-8 h-8 animate-spin mx-auto text-hakimi-sage" /></div>;

  const pending = reviews.filter(r => r.status === 'pending');
  const approved = reviews.filter(r => r.status === 'approved');

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-hakimi-sage/10 pb-4">
          <h3 className="text-xl font-serif font-black text-hakimi-forest flex items-center gap-2">
            Pending Approval ({pending.length})
          </h3>
          <span className="px-3 py-1 bg-hakimi-terracotta/10 text-hakimi-terracotta text-[10px] font-black uppercase tracking-widest rounded-full">Moderation Queue</span>
        </div>

        {pending.length === 0 ? (
          <p className="text-center py-12 text-gray-400 italic font-medium bg-white/50 rounded-3xl border-2 border-dashed border-hakimi-sage/20">The queue is empty. Nature is in balance.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pending.map((review) => (
              <div key={review.id} className="bg-white rounded-3xl p-6 border border-hakimi-sage/10 shadow-sm animate-fade-in-up">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-hakimi-terracotta fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-hakimi-forest">{review.userName}</span>
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(review.createdAt?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {review.comment && <p className="text-gray-700 italic text-sm">"{review.comment}"</p>}
                    
                    {/* Simplified View: No Audio or Photos */}
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => updateStatus(review.id!, 'approved')}
                      className="flex-grow flex items-center justify-center gap-2 px-6 py-3 bg-hakimi-forest text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-hakimi-sage transition-all"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => updateStatus(review.id!, 'rejected')}
                      className="flex-grow flex items-center justify-center gap-2 px-6 py-3 bg-white text-hakimi-terracotta border-2 border-hakimi-terracotta rounded-xl font-black text-xs uppercase tracking-widest hover:bg-hakimi-terracotta hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-hakimi-sage/10 pb-4">
          <h3 className="text-xl font-serif font-black text-hakimi-forest flex items-center gap-2">
            Approved Archive ({approved.length})
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approved.map((review) => (
            <div key={review.id} className="bg-white/50 rounded-3xl p-6 border border-hakimi-sage/10 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                   <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-hakimi-terracotta fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-hakimi-forest">{review.userName}</span>
                </div>
                <button 
                  onClick={() => deleteReview(review.id!)}
                  className="p-2 text-gray-300 hover:text-hakimi-terracotta transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {review.comment && <p className="text-gray-600 text-[11px] font-medium italic line-clamp-3">"{review.comment}"</p>}
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => updateStatus(review.id!, 'pending')}
                  className="text-[9px] font-black uppercase tracking-widest text-hakimi-sage hover:text-hakimi-forest"
                >
                  Move to Pending
                </button>
                <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">Approved</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewAdmin;
