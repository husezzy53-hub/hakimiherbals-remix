
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleCart, removeFromCart, updateQuantity } from '../store/cartSlice';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

const CartSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-hakimi-forest/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => dispatch(toggleCart())}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-hakimi-cream z-[70] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animation-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-hakimi-sage/10 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-hakimi-sage" />
            <h2 className="text-xl font-bold text-hakimi-forest">Your Harvest</h2>
            <span className="bg-hakimi-sage/10 text-hakimi-sage text-xs px-2 py-1 rounded-full font-bold uppercase tracking-tighter">
              {items.length} items
            </span>
          </div>
          <button 
            onClick={() => dispatch(toggleCart())}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <div className="bg-white p-8 rounded-full shadow-inner">
                <ShoppingBag className="w-12 h-12 text-hakimi-sage/40" />
              </div>
              <p className="text-hakimi-forest font-medium">Your basket is empty.</p>
              <button 
                onClick={() => dispatch(toggleCart())}
                className="text-hakimi-terracotta font-bold hover:underline uppercase text-sm tracking-widest"
              >
                Explore The Wild
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 group bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={item.images[0] || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-hakimi-forest line-clamp-1">{item.name}</h3>
                    <p className="text-sm font-bold text-hakimi-sage">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-hakimi-cream rounded-lg p-1 px-2 border border-hakimi-sage/5">
                      <button 
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                        className="p-1 hover:text-hakimi-terracotta transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-hakimi-forest">{item.quantity}</span>
                      <button 
                         onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        className="p-1 hover:text-hakimi-sage transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-gray-300 hover:text-hakimi-terracotta p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 border-t border-hakimi-sage/10 bg-white space-y-6">
            <div className="flex justify-between items-center text-xl font-black text-hakimi-forest">
              <span>Total Investment</span>
              <span>Rs. {total}</span>
            </div>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-hakimi-terracotta hover:bg-hakimi-forest text-white py-5 rounded-2xl font-bold shadow-xl shadow-hakimi-terracotta/20 transition-all transform active:scale-[0.98] uppercase tracking-widest"
            >
              Complete Order
            </button>
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        total={total}
      />
    </>
  );
};

export default CartSidebar;
