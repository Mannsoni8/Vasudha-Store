import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiAward } from 'react-icons/fi';
import { useProducts } from '../hooks';
import ProductCard from '../components/common/ProductCard';
import { SkeletonGrid } from '../components/common';

const CATEGORIES = [
  { name: 'Sarees',   emoji: '🥻', desc: 'Silk, Cotton, Banarasi & more',   color: 'from-maroon-800 to-maroon-950',  badge: 'Bestseller' },
  { name: 'Kurtis',  emoji: '👘', desc: 'Casual, Festive & Printed styles',  color: 'from-gold-700 to-gold-900',      badge: 'New Arrivals' },
  { name: 'Lehengas',emoji: '💃', desc: 'Bridal, Festive & Party Wear',      color: 'from-maroon-700 to-maroon-900',  badge: 'Wedding Season' },
  { name: 'Dupattas',emoji: '🧣', desc: 'Phulkari, Banarasi & Silk',        color: 'from-gold-600 to-maroon-800',    badge: null },
  { name: 'Blouses', emoji: '✨', desc: 'Embroidered & Designer Blouses',    color: 'from-maroon-900 to-maroon-950',  badge: null },
  { name: 'Sets',    emoji: '👗', desc: 'Salwar Suits, Patiala & more',      color: 'from-gold-800 to-maroon-900',    badge: 'Popular' },
];

const FEATURES = [
  { icon: FiTruck,    title: 'Free Delivery',    desc: 'On orders above ₹999' },
  { icon: FiShield,   title: 'Authentic Fabrics', desc: 'Handpicked & verified' },
  { icon: FiRefreshCw,title: 'Easy Returns',     desc: '7-day hassle-free' },
  { icon: FiAward,    title: 'Premium Quality',  desc: '100% satisfaction' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', city: 'Jaipur', rating: 5, text: 'The Kanjivaram saree I ordered was absolutely stunning. Perfect for my daughter\'s wedding!' },
  { name: 'Meera K.', city: 'Mumbai', rating: 5, text: 'Quick delivery and the quality exceeded my expectations. Will definitely order again.' },
  { name: 'Anita R.', city: 'Delhi',  rating: 5, text: 'Beautiful lehenga for Navratri, so many compliments! The fabric is really soft and comfortable.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { products: featured, loading: fl } = useProducts({ featured: 'true', limit: 8 });
  const { products: newArr,   loading: nl } = useProducts({ sort: 'popular', limit: 8 });

  return (
    <div className="animate-fade-in">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] bg-maroon-900 flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-950/60 via-transparent to-maroon-800/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="font-hindi text-gold-400 text-lg sm:text-xl mb-3 animate-slide-up">स्वागतम् — Welcome</p>
            <h1
              className="font-display text-4xl sm:text-5xl md:text-7xl text-white font-bold leading-tight mb-5 sm:mb-6 animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Elegance in<br />
              <span className="text-gold-shimmer">Every Thread</span>
            </h1>
            <p
              className="text-cream-200 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              Discover our handcrafted collection of authentic Indian clothing — where tradition meets timeless style.
            </p>
            <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <button onClick={() => navigate('/products')} className="btn-gold flex items-center gap-2 text-sm sm:text-base px-5 sm:px-6">
                Shop Collection <FiArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/products?category=Sarees')}
                className="btn-outline border-cream-200 text-cream-100 hover:bg-cream-100 hover:text-maroon-900 text-sm sm:text-base px-5 sm:px-6"
              >
                Explore Sarees
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mt-10 sm:mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {[['500+', 'Products'], ['10K+', 'Happy Customers'], ['100%', 'Authentic']].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-gold-400 text-xl sm:text-2xl font-bold">{n}</p>
                  <p className="text-cream-300 text-xs tracking-wide">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="fill-cream-50 w-full" preserveAspectRatio="none" height="50">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── Feature Strip ────────────────────────────── */}
      <section className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-maroon-100 rounded-full flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-maroon-700" />
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500 hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Cards (all 6) ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-gold-600 font-semibold tracking-widest text-xs uppercase mb-2">Browse By Category</p>
          <h2 className="section-title">Shop Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {CATEGORIES.map(({ name, emoji, desc, color, badge }) => (
            <button
              key={name}
              onClick={() => navigate(`/products?category=${name}`)}
              className={`relative bg-gradient-to-br ${color} text-white rounded-xl sm:rounded-2xl p-5 sm:p-7 text-left overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              {badge && (
                <span className="absolute top-3 right-3 bg-gold-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              <div className="absolute -right-3 -bottom-3 text-6xl sm:text-8xl opacity-15 group-hover:opacity-25 transition-opacity">
                {emoji}
              </div>
              <span className="text-3xl sm:text-4xl mb-3 block">{emoji}</span>
              <h3 className="font-display text-lg sm:text-xl font-semibold mb-1">{name}</h3>
              <p className="text-cream-200 text-xs sm:text-sm leading-snug">{desc}</p>
              <div className="mt-3 sm:mt-4 flex items-center gap-1 text-gold-300 text-xs sm:text-sm font-semibold">
                Shop Now <FiArrowRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-14">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-gold-600 font-semibold tracking-widest text-xs uppercase mb-1">Handpicked For You</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <button
            onClick={() => navigate('/products?featured=true')}
            className="flex items-center gap-1 sm:gap-1.5 text-maroon-800 font-semibold text-xs sm:text-sm hover:text-maroon-600 transition-colors"
          >
            View All <FiArrowRight size={13} />
          </button>
        </div>
        {fl
          ? <SkeletonGrid count={8} />
          : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )
        }
      </section>

      {/* ── Newest / Popular ──────────────────────────── */}
      <section className="bg-cream-100 py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <p className="text-gold-600 font-semibold tracking-widest text-xs uppercase mb-1">Trending Now</p>
              <h2 className="section-title">Most Popular</h2>
            </div>
            <button
              onClick={() => navigate('/products?sort=popular')}
              className="flex items-center gap-1 sm:gap-1.5 text-maroon-800 font-semibold text-xs sm:text-sm hover:text-maroon-600 transition-colors"
            >
              See All <FiArrowRight size={13} />
            </button>
          </div>
          {nl
            ? <SkeletonGrid count={8} />
            : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {newArr.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )
          }
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="text-center mb-8">
          <p className="text-gold-600 font-semibold tracking-widest text-xs uppercase mb-2">Customer Love</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map(({ name, city, rating, text }) => (
            <div key={name} className="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: rating }).map((_, i) => (
                  <FiStar key={i} size={14} className="text-gold-500 fill-gold-500" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-maroon-100 rounded-full flex items-center justify-center text-maroon-800 font-bold text-sm">
                  {name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{name}</p>
                  <p className="text-xs text-gray-500">{city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WhatsApp CTA ──────────────────────────────── */}
      <section className="bg-maroon-800 py-12 sm:py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="font-hindi text-gold-400 text-lg sm:text-xl mb-2">✨ विशेष ऑफर ✨</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-3 sm:mb-4">
            Order via WhatsApp &amp; Get<br />
            <span className="text-gold-400">Exclusive Discounts!</span>
          </h2>
          <p className="text-cream-200 text-sm sm:text-base mb-6 sm:mb-8">
            Share your requirements directly and our team will assist you personally.
          </p>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919462062626'}?text=${encodeURIComponent('Hello! I want to place an order from Vasudha Store 🌸')}`}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp inline-flex text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
          >
            <span className="text-xl">💬</span> Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
