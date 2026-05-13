// Format price in INR
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

// Discount percentage
export const discountPercent = (original, discounted) =>
  Math.round(((original - discounted) / original) * 100);

// Truncate text
export const truncate = (str, n = 60) => (str?.length > n ? str.slice(0, n) + '…' : str);

// Debounce
export const debounce = (fn, delay = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// WhatsApp order message builder
export const buildWhatsAppMessage = (items, total, address) => {
  const lines = items.map((i) => `• ${i.name} (${i.size || 'Free Size'}, Qty: ${i.quantity}) — ₹${i.price * i.quantity}`);
  return encodeURIComponent(
    `🌸 *New Order from Vasudha Store*\n\n` +
    lines.join('\n') +
    `\n\n*Total: ₹${total}*\n\n` +
    `📦 Deliver to:\n${address?.name}\n${address?.street}, ${address?.city}, ${address?.state} - ${address?.pincode}\n📞 ${address?.phone}`
  );
};

export const CATEGORIES = ['Sarees', 'Kurtis', 'Lehengas', 'Dupattas', 'Blouses', 'Sets'];
export const FABRICS    = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Banarasi', 'Chanderi', 'Net', 'Crepe', 'Other'];
export const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
export const SORT_OPTIONS = [
  { value: '',           label: 'Newest First' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'rating',     label: 'Top Rated' },
];
export const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export const STATUS_COLORS = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Confirmed:  'bg-blue-100 text-blue-800',
  Shipped:    'bg-purple-100 text-purple-800',
  Delivered:  'bg-green-100 text-green-800',
  Cancelled:  'bg-red-100 text-red-800',
};
