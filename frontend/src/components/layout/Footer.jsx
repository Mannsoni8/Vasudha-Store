import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

export default function Footer() {
  return (
    <footer className="bg-maroon-900 text-cream-200 mt-16">
      {/* Ornament strip */}
      <div className="h-1 bg-gradient-to-r from-maroon-800 via-gold-500 to-maroon-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                <span className="text-white font-display text-xl font-bold">व</span>
              </div>
              <div>
                <p className="font-display text-white text-xl font-semibold">Vasudha Store</p>
                <p className="font-hindi text-gold-400 text-xs">वसुधा स्टोर</p>
              </div>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed">
              Celebrating the timeless elegance of Indian craftsmanship — handpicked sarees, kurtis, and lehengas for every occasion.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-maroon-800 rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors">
                <FiInstagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-maroon-800 rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors">
                <FiFacebook size={16} />
              </a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors text-sm font-bold">
                W
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-white font-semibold text-lg mb-4">Shop By</h4>
            <ul className="space-y-2 text-sm">
              {['Sarees', 'Kurtis', 'Lehengas', 'Dupattas', 'Blouses', 'Sets'].map((c) => (
                <li key={c}>
                  <Link to={`/products?category=${c}`} className="text-cream-300 hover:text-gold-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-display text-white font-semibold text-lg mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              {[['My Orders', '/orders'], ['Cart', '/cart'], ['Login', '/login']].map(([l, to]) => (
                <li key={l}><Link to={to} className="text-cream-300 hover:text-gold-400 transition-colors">{l}</Link></li>
              ))}
              <li><a href="#" className="text-cream-300 hover:text-gold-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="text-cream-300 hover:text-gold-400 transition-colors">Shipping Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-white font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-cream-300">
                <FiMapPin size={15} className="mt-0.5 text-gold-400 shrink-0" />
                123, Fabric Lane, Textile Market, Surat, Gujarat - 395003
              </li>
              <li>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-cream-300 hover:text-gold-400 transition-colors">
                  <FiPhone size={15} className="text-gold-400" /> +91 9462062626
                </a>
              </li>
              <li>
                <a href="mailto:hello@vasudhastore.com" className="flex items-center gap-2 text-cream-300 hover:text-gold-400 transition-colors">
                  <FiMail size={15} className="text-gold-400" /> smann3803@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-5 bg-maroon-800/60 rounded-xl p-3">
              <p className="text-xs text-cream-300 mb-1">We accept</p>
              <div className="flex gap-2 flex-wrap">
                {['COD', 'UPI', 'Cards', 'NetBanking'].map((m) => (
                  <span key={m} className="bg-maroon-700 text-cream-200 text-xs px-2 py-0.5 rounded">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-maroon-800 py-4 text-center text-xs text-cream-400">
        © {new Date().getFullYear()} Vasudha Store. Made with ❤️ in India.
      </div>
    </footer>
  );
}
