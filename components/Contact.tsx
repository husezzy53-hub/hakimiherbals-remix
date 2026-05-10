
import React from 'react';
import { Phone, User, MapPin, MessageCircle } from 'lucide-react';
import { BUSINESS_OWNERS, CONTACT_NUMBERS, DELIVERY_AREAS } from '../constants';

const Contact: React.FC = () => {
  const handleWhatsAppClick = (number: string) => {
    const cleanNumber = number.replace(/[^0-9+]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-hakimi-forest text-hakimi-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-hakimi-sage/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-hakimi-terracotta/5 blur-[100px] rounded-full -ml-48 -mb-48"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-hakimi-terracotta font-black tracking-[0.3em] uppercase text-xs">Get in Touch</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black mt-4 mb-6">Contact Details</h2>
            <div className="w-20 h-1 bg-hakimi-terracotta mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Owners Section */}
            <div className="bg-white/5 backdrop-blur-md rounded-4xl p-8 border border-white/10 hover:border-hakimi-sage/30 transition-all group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-hakimi-sage/20 rounded-2xl flex items-center justify-center text-hakimi-sage group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Business Owners</h3>
              </div>
              <ul className="space-y-4">
                {BUSINESS_OWNERS.map((owner, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-lg font-medium text-hakimi-cream/80 translate-x-0 hover:translate-x-2 transition-transform cursor-default">
                    <div className="w-1.5 h-1.5 bg-hakimi-terracotta rounded-full"></div>
                    {owner}
                  </li>
                ))}
              </ul>
            </div>

            {/* General Info Section */}
            <div className="bg-white/5 backdrop-blur-md rounded-4xl p-8 border border-white/10 hover:border-hakimi-sage/30 transition-all group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-hakimi-terracotta/20 rounded-2xl flex items-center justify-center text-hakimi-terracotta group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold">General Contacts</h3>
              </div>
              <div className="space-y-4">
                {CONTACT_NUMBERS.map((contact, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleWhatsAppClick(contact.number)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-hakimi-terracotta transition-all group/item"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black uppercase tracking-widest text-hakimi-sage group-hover/item:text-white/70">{contact.name}</span>
                      <span className="text-lg font-bold">{contact.number}</span>
                    </div>
                    <MessageCircle className="w-5 h-5 text-hakimi-terracotta group-hover/item:text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Areas Section */}
          <div className="mt-12 bg-white/5 backdrop-blur-md rounded-4xl p-8 border border-white/10 hover:border-hakimi-sage/30 transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-hakimi-sage/20 rounded-2xl flex items-center justify-center text-hakimi-sage">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Area Wise Orders</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DELIVERY_AREAS.map((area, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleWhatsAppClick(area.phone)}
                  className="flex flex-col items-start p-6 rounded-3xl bg-white/5 hover:bg-hakimi-sage transition-all group/area"
                >
                  <span className="text-xs font-black uppercase tracking-widest text-hakimi-terracotta group-hover/area:text-white/70 mb-1">{area.name}</span>
                  <span className="text-lg font-bold mb-4">{area.phone}</span>
                  <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-hakimi-sage group-hover/area:text-white transition-colors">
                    Order Now <MessageCircle className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <p className="text-hakimi-sage font-medium italic opacity-60">
              Transforming traditional healing into modern wellness.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
