
import { CartItem, CustomerDetails } from '../types';
import { OWNER_PHONE_NUMBER, DELIVERY_AREAS } from '../constants';

export const generateWhatsAppLink = (customer: CustomerDetails, items: CartItem[], total: number): string => {
  let message = `*New Order from Hakimi Herbals*\n\n`;
  message += `*Customer Details:*\n`;
  message += `Name: ${customer.name}\n`;
  message += `Phone: ${customer.whatsapp}\n`;
  message += `Area: ${customer.area}\n`;
  
  if (customer.email) {
    message += `Email: ${customer.email}\n`;
  }
  
  if (customer.address) {
    message += `Address: ${customer.address}\n`;
  }
  
  message += `\n*Order Summary:*\n`;
  items.forEach(item => {
    message += `- ${item.name} x ${item.quantity} : Rs. ${item.price * item.quantity}\n`;
  });
  
  message += `\n*Total Amount: Rs. ${total}*`;
  
  // Determine target phone number
  const selectedArea = DELIVERY_AREAS.find(a => a.name === customer.area);
  const targetPhone = selectedArea ? selectedArea.phone.replace(/[^0-9+]/g, '') : OWNER_PHONE_NUMBER;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
};
