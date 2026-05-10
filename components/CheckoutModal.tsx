
import React, { useState } from 'react';
import { X, Send, Loader2, Leaf, MapPin } from 'lucide-react';
import { CustomerDetails, CartItem, OrderData } from '../types';
import { generateWhatsAppLink } from '../services/whatsapp';
import { submitOrderToSheet } from '../services/googleSheets';
import { useDispatch } from 'react-redux';
import { clearCart, setCartOpen } from '../store/cartSlice';
import { addOrder } from '../store/historySlice';
import { DELIVERY_AREAS } from '../constants';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Star } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, items, total }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    whatsapp: '',
    address: '',
    email: '',
    area: DELIVERY_AREAS[0].name
  });
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData: OrderData = {
        customer: formData,
        items,
        total,
        date: new Date().toISOString()
      };

      // Background tasks (Fire-and-forget for speed)
      (async () => {
        try {
          if (!auth.currentUser) {
            const { signInAnonymously } = await import('firebase/auth');
            await signInAnonymously(auth);
          }
          await addDoc(collection(db, 'reviews'), {
            userName: formData.name,
            rating,
            comment: 'Standard Rating',
            status: 'approved',
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          console.warn('Post-checkout review save failed:', err);
        }
      })();

      // Start Sheet Submission in background
      submitOrderToSheet(orderData).catch(err => console.error('Sheet submission failed:', err));

      const link = generateWhatsAppLink(formData, items, total);
      dispatch(addOrder(orderData));
      
      // Instant WhatsApp redirection
      window.location.href = link;

      dispatch(clearCart());
      setIsSuccess(true);
    } catch (err) {
      console.error('Critical Checkout Error:', err);
      // Even if everything fails, try to get the user to WhatsApp
      const fallbackLink = generateWhatsAppLink(formData, items, total);
      window.location.href = fallbackLink;
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSuccess) {
      dispatch(setCartOpen(false));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-hakimi-forest/70 backdrop-blur-md transition-opacity" onClick={handleClose} />
      
      <div className="relative bg-hakimi-cream rounded-5xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-hakimi-sage/20">
        <div className="bg-hakimi-forest p-8 text-hakimi-cream flex justify-between items-center relative overflow-hidden">
          <Leaf className="absolute -left-4 -bottom-4 w-24 h-24 text-hakimi-sage/10 rotate-12" />
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-black tracking-tight">
              {isSuccess ? 'Order Placed!' : 'Final Step'}
            </h2>
            <p className="text-hakimi-sage font-medium text-sm">
              {isSuccess ? 'Tell us about your journey' : 'Secure your herbal harvest'}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 bg-white max-h-[70vh] overflow-y-auto no-scrollbar">
          {isSuccess ? (
            <div className="space-y-8 py-4">
              <div className="bg-hakimi-cream/50 p-8 rounded-3xl border border-hakimi-sage/10 text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-hakimi-sage/10 rounded-full flex items-center justify-center mx-auto text-hakimi-sage">
                  <Send className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-black text-hakimi-forest">Success!</h3>
                  <p className="text-gray-500 font-medium">Your harvest is ready. If WhatsApp didn't open automatically, please tap below.</p>
                </div>
                <button
                  onClick={() => window.location.href = generateWhatsAppLink(formData, items, total)}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-2xl font-black shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-3 transition-all uppercase tracking-widest"
                >
                  Open WhatsApp <Send className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleClose}
                  className="text-xs font-black uppercase tracking-widest text-hakimi-sage hover:text-hakimi-forest transition-colors"
                >
                  Return to Shop
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="bg-hakimi-cream/30 p-4 rounded-2xl border border-hakimi-sage/10">
                  <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-3 text-center">The Hakimi Experience</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`p-1 transition-all ${rating >= num ? 'text-amber-400 scale-110' : 'text-gray-200'}`}
                      >
                        <i className={`lucide-star w-8 h-8 ${rating >= num ? 'fill-current' : ''}`}><Star className="w-8 h-8" /></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3.5 rounded-2xl bg-hakimi-cream/50 border border-transparent focus:bg-white focus:border-hakimi-sage focus:ring-4 focus:ring-hakimi-sage/10 outline-none transition-all font-medium text-hakimi-forest"
                    placeholder="How shall we address you?"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-1.5 ml-1">WhatsApp Number</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-5 py-3.5 rounded-2xl bg-hakimi-cream/50 border border-transparent focus:bg-white focus:border-hakimi-sage focus:ring-4 focus:ring-hakimi-sage/10 outline-none transition-all font-medium text-hakimi-forest"
                    placeholder="For delivery updates..."
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-1.5 ml-1">Delivery Area</label>
                  <div className="relative">
                    <select
                      required
                      className="w-full px-5 py-3.5 rounded-2xl bg-hakimi-cream/50 border border-transparent focus:bg-white focus:border-hakimi-sage focus:ring-4 focus:ring-hakimi-sage/10 outline-none transition-all font-medium text-hakimi-forest appearance-none cursor-pointer"
                      value={formData.area}
                      onChange={e => setFormData({...formData, area: e.target.value})}
                    >
                      {DELIVERY_AREAS.map((area) => (
                        <option key={area.name} value={area.name}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-hakimi-sage">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="mt-1.5 ml-1 text-[9px] font-medium text-hakimi-sage italic">
                    Order will be sent to: {DELIVERY_AREAS.find(a => a.name === formData.area)?.phone}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-1.5 ml-1">Delivery Address <span className="text-hakimi-sage/60 font-medium normal-case">(Optional)</span></label>
                  <textarea
                    rows={3}
                    className="w-full px-5 py-3.5 rounded-2xl bg-hakimi-cream/50 border border-transparent focus:bg-white focus:border-hakimi-sage focus:ring-4 focus:ring-hakimi-sage/10 outline-none transition-all resize-none font-medium text-hakimi-forest"
                    placeholder="Where should nature's gifts go?"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-hakimi-terracotta hover:bg-hakimi-forest text-white py-5 rounded-2xl font-black shadow-lg shadow-hakimi-terracotta/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70 active:scale-[0.97] uppercase tracking-widest"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Preparing...
                    </>
                  ) : (
                    <>
                      Finalize on WhatsApp <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[9px] text-gray-400 mt-4 uppercase font-black tracking-widest">
                  A private order draft will be prepared for you.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
