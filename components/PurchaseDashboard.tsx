
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setHistoryOpen, clearHistory } from '../store/historySlice';
import { addToCart } from '../store/cartSlice';
import { X, Calendar, Package, Receipt, ArrowRight, Trash2 } from 'lucide-react';

const PurchaseDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { orders, isOpen } = useSelector((state: RootState) => state.history);

  if (!isOpen) return null;

  const handleReorder = (items: any[]) => {
    items.forEach(item => dispatch(addToCart(item)));
    dispatch(setHistoryOpen(false));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-end">
      <div 
        className="absolute inset-0 bg-hakimi-forest/80 backdrop-blur-md animate-fade-in" 
        onClick={() => dispatch(setHistoryOpen(false))} 
      />
      
      <div className="relative w-full max-w-2xl h-full bg-hakimi-cream shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-white border-b border-hakimi-forest/5 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-black text-hakimi-forest leading-tight">Your Harvests</h2>
            <p className="text-hakimi-sage text-xs font-black uppercase tracking-widest mt-1">Personal Purchase History</p>
          </div>
          <button 
            onClick={() => dispatch(setHistoryOpen(false))}
            className="p-3 hover:bg-hakimi-cream rounded-2xl text-gray-400 hover:text-hakimi-forest transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-24 h-24 bg-white rounded-5xl flex items-center justify-center mb-6 shadow-inner">
                <Package className="w-10 h-10 text-hakimi-sage/30" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-hakimi-forest">No harvests yet</h3>
              <p className="text-gray-500 mt-2 max-w-xs leading-relaxed">
                Your future orders will be recorded here for you to track and reorder with ease.
              </p>
              <button 
                onClick={() => dispatch(setHistoryOpen(false))}
                className="mt-8 px-8 py-4 bg-hakimi-forest text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-transform"
              >
                Browse The Apothecary
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div key={idx} className="bg-white rounded-[2.5rem] border border-hakimi-forest/5 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-hakimi-cream rounded-2xl flex items-center justify-center text-hakimi-sage">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-hakimi-sage uppercase tracking-widest">Ordered On</p>
                        <p className="font-bold text-hakimi-forest">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="px-6 py-2 bg-hakimi-forest text-white rounded-full text-sm font-black text-center">
                      Rs. {order.total}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center bg-hakimi-cream rounded-lg text-[10px] font-black text-hakimi-sage">
                            {item.quantity}
                          </span>
                          <span className="font-semibold text-hakimi-forest">{item.name}</span>
                        </div>
                        <span className="text-gray-400">Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-hakimi-forest/5 flex items-center justify-between">
                    <button 
                      onClick={() => handleReorder(order.items)}
                      className="flex items-center gap-2 text-hakimi-terracotta font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all"
                    >
                      Repeat This Order <ArrowRight className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Receipt className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Invoice Saved</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-8 text-center">
                <button 
                  onClick={() => { if(confirm('Clear all local history?')) dispatch(clearHistory()) }}
                  className="flex items-center gap-2 mx-auto text-[9px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear History Permanentely
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {orders.length > 0 && (
          <div className="p-8 bg-hakimi-forest text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-hakimi-sage text-[10px] font-black uppercase tracking-[0.2em]">Lifetime Harvests</span>
              <span className="text-hakimi-sage text-[10px] font-black uppercase tracking-[0.2em]">Total Investment</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-serif font-black">{orders.length} <span className="text-sm font-sans font-medium text-hakimi-sage">Orders</span></div>
              <div className="text-3xl font-serif font-black">Rs. {orders.reduce((acc, curr) => acc + curr.total, 0)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseDashboard;
