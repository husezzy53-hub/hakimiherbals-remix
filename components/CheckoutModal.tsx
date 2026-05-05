
import React, { useState } from 'react';
import { X, Send, Loader2, Leaf } from 'lucide-react';
import { CustomerDetails, CartItem, OrderData } from '../types';
import { generateWhatsAppLink } from '../services/whatsapp';
import { submitOrderToSheet } from '../services/googleSheets';
import { useDispatch } from 'react-redux';
import { clearCart, setCartOpen } from '../store/cartSlice';
import { addOrder } from '../store/historySlice';

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
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData: OrderData = {
      customer: formData,
      items,
      total,
      date: new Date().toISOString()
    };

    // 1. Submit to Google Sheets (External)
    await submitOrderToSheet(orderData);

    // 2. Save to local history (Internal)
    dispatch(addOrder(orderData));

    // 3. Generate WhatsApp Link
    const link = generateWhatsAppLink(formData, items, total);

    // 4. Open WhatsApp
    window.open(link, '_blank');

    // 5. Cleanup
    setIsSubmitting(false);
    dispatch(clearCart());
    dispatch(setCartOpen(false));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-hakimi-forest/70 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-hakimi-cream rounded-5xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-hakimi-sage/20">
        <div className="bg-hakimi-forest p-8 text-hakimi-cream flex justify-between items-center relative overflow-hidden">
          <Leaf className="absolute -left-4 -bottom-4 w-24 h-24 text-hakimi-sage/10 rotate-12" />
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-black tracking-tight">Final Step</h2>
            <p className="text-hakimi-sage font-medium text-sm">Secure your herbal harvest</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white">
          <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default CheckoutModal;
