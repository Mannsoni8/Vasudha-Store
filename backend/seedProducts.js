/**
 * Seed database with sample products:
 *   node seedProducts.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

const products = [
  // ── SAREES ──────────────────────────────────────────
  {
    name: 'Kanjivaram Silk Saree - Royal Crimson',
    description: 'Exquisite Kanjivaram silk saree with intricate zari work and traditional temple border. A masterpiece from the looms of Tamil Nadu, perfect for weddings and grand celebrations.',
    price: 12999,
    discountPrice: 10499,
    category: 'Sarees',
    fabric: 'Silk',
    color: ['Crimson', 'Gold'],
    size: ['Free Size'],
    stock: 15,
    isFeatured: true,
    tags: ['kanjivaram', 'silk', 'wedding', 'bridal', 'zari'],
    images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' }],
  },
  {
    name: 'Banarasi Georgette Saree - Midnight Blue',
    description: 'Luxurious Banarasi georgette saree with intricate brocade work and gold zari weaving. Light yet elegant, ideal for festive occasions.',
    price: 8499,
    discountPrice: 6999,
    category: 'Sarees',
    fabric: 'Georgette',
    color: ['Midnight Blue', 'Gold'],
    size: ['Free Size'],
    stock: 20,
    isFeatured: true,
    tags: ['banarasi', 'georgette', 'festive', 'zari'],
    images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80' }],
  },
  {
    name: 'Chiffon Printed Saree - Blush Garden',
    description: 'Lightweight chiffon saree with delicate floral print and embroidered border. Perfect for parties and daytime events.',
    price: 2999,
    discountPrice: 2199,
    category: 'Sarees',
    fabric: 'Chiffon',
    color: ['Blush Pink', 'Ivory'],
    size: ['Free Size'],
    stock: 35,
    isFeatured: false,
    tags: ['chiffon', 'floral', 'casual', 'party'],
    images: [{ url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80' }],
  },
  {
    name: 'Linen Handloom Saree - Earthy Ochre',
    description: 'Handwoven linen saree with natural vegetable dyes and handblock print. Sustainable, breathable and perfect for everyday elegance.',
    price: 3499,
    discountPrice: 0,
    category: 'Sarees',
    fabric: 'Linen',
    color: ['Ochre', 'Off White'],
    size: ['Free Size'],
    stock: 12,
    isFeatured: false,
    tags: ['linen', 'handloom', 'sustainable', 'handblock'],
    images: [{ url: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=600&q=80' }],
  },
  {
    name: 'Cotton Chanderi Saree - Sage Elegance',
    description: 'Delicate Chanderi cotton saree with subtle sheen and intricate woven motifs. A perfect blend of tradition and comfort for the modern woman.',
    price: 4299,
    discountPrice: 3599,
    category: 'Sarees',
    fabric: 'Chanderi',
    color: ['Sage Green', 'Gold'],
    size: ['Free Size'],
    stock: 18,
    isFeatured: true,
    tags: ['chanderi', 'cotton', 'elegant', 'lightweight'],
    images: [{ url: 'https://images.unsplash.com/photo-1614886137163-c3c80a0a7b26?w=600&q=80' }],
  },

  // ── KURTIS ──────────────────────────────────────────
  {
    name: 'Anarkali Kurti - Marigold Bloom',
    description: 'Floor-length Anarkali kurti in pure cotton with intricate block-print detailing and embroidered yoke. Flared silhouette for a regal look.',
    price: 1899,
    discountPrice: 1499,
    category: 'Kurtis',
    fabric: 'Cotton',
    color: ['Marigold', 'Ivory'],
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
    isFeatured: true,
    tags: ['anarkali', 'cotton', 'blockprint', 'festive'],
    images: [{ url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80' }],
  },
  {
    name: 'A-Line Printed Kurti - Indigo Dreams',
    description: 'Straight-cut A-line kurti with dabu hand block print. Versatile everyday wear that pairs perfectly with leggings, palazzos or jeans.',
    price: 999,
    discountPrice: 799,
    category: 'Kurtis',
    fabric: 'Cotton',
    color: ['Indigo', 'White'],
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 80,
    isFeatured: false,
    tags: ['aline', 'dabu', 'everyday', 'casual'],
    images: [{ url: 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=600&q=80' }],
  },
  {
    name: 'Georgette Embroidered Kurti - Rose Mist',
    description: 'Flowy georgette kurti with exquisite thread embroidery and scalloped hem. Perfect for festive lunches and evening gatherings.',
    price: 2299,
    discountPrice: 1899,
    category: 'Kurtis',
    fabric: 'Georgette',
    color: ['Dusty Rose', 'Silver'],
    size: ['S', 'M', 'L', 'XL'],
    stock: 30,
    isFeatured: false,
    tags: ['georgette', 'embroidery', 'festive', 'party'],
    images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80' }],
  },

  // ── LEHENGAS ────────────────────────────────────────
  {
    name: 'Bridal Lehenga Set - Ruby Royale',
    description: 'Opulent bridal lehenga in heavy silk with hand-embroidered zardozi work on the blouse and border. Comes as a complete 3-piece set with dupatta.',
    price: 35999,
    discountPrice: 29999,
    category: 'Lehengas',
    fabric: 'Silk',
    color: ['Ruby Red', 'Gold'],
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 8,
    isFeatured: true,
    tags: ['bridal', 'zardozi', 'wedding', 'lehenga', 'heavy'],
    images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' }],
  },
  {
    name: 'Party Wear Lehenga - Peacock Teal',
    description: 'Stunning party-wear lehenga in peacock teal with mirror work and gota patti detailing. Lightweight yet festive, ideal for weddings and receptions.',
    price: 9999,
    discountPrice: 7999,
    category: 'Lehengas',
    fabric: 'Net',
    color: ['Peacock Teal', 'Silver'],
    size: ['S', 'M', 'L', 'XL'],
    stock: 12,
    isFeatured: true,
    tags: ['party', 'mirror work', 'gota patti', 'reception'],
    images: [{ url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80' }],
  },
  {
    name: 'Navratri Garba Lehenga - Vibrant Orange',
    description: 'Colourful ghagra choli set for Navratri and Garba. Features traditional bandhani print with mirror embellishments and a flared skirt for free movement.',
    price: 3499,
    discountPrice: 2799,
    category: 'Lehengas',
    fabric: 'Cotton',
    color: ['Orange', 'Red', 'Gold'],
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 40,
    isFeatured: false,
    tags: ['navratri', 'garba', 'bandhani', 'ghagra'],
    images: [{ url: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=600&q=80' }],
  },

  // ── DUPATTAS ────────────────────────────────────────
  {
    name: 'Phulkari Dupatta - Punjab Heritage',
    description: 'Vibrant Phulkari dupatta hand-embroidered by artisans from Punjab. Geometric floral patterns in silk thread on cotton base. A cultural treasure.',
    price: 1599,
    discountPrice: 1299,
    category: 'Dupattas',
    fabric: 'Cotton',
    color: ['Magenta', 'Multi'],
    size: ['Free Size'],
    stock: 25,
    isFeatured: false,
    tags: ['phulkari', 'punjab', 'embroidered', 'handmade'],
    images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80' }],
  },
  {
    name: 'Banarasi Silk Dupatta - Gold Brocade',
    description: 'Exquisite Banarasi silk dupatta with gold zari brocade throughout. A perfect complement to any traditional ensemble — lehenga, suit or anarkali.',
    price: 2499,
    discountPrice: 1999,
    category: 'Dupattas',
    fabric: 'Silk',
    color: ['Ivory', 'Gold'],
    size: ['Free Size'],
    stock: 20,
    isFeatured: false,
    tags: ['banarasi', 'zari', 'brocade', 'dupatta'],
    images: [{ url: 'https://images.unsplash.com/photo-1614886137163-c3c80a0a7b26?w=600&q=80' }],
  },

  // ── BLOUSES ─────────────────────────────────────────
  {
    name: 'Heavily Embroidered Blouse - Golden Garden',
    description: 'Intricately embroidered blouse with thread and sequin work. Back-neck design with hook closure. Pairs beautifully with silk sarees.',
    price: 2999,
    discountPrice: 2499,
    category: 'Blouses',
    fabric: 'Silk',
    color: ['Gold', 'Ivory'],
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 22,
    isFeatured: false,
    tags: ['blouse', 'embroidered', 'sequin', 'wedding'],
    images: [{ url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80' }],
  },
  {
    name: 'Backless Designer Blouse - Midnight Shimmer',
    description: 'Contemporary designer blouse with deep back-neck, embellished straps and shimmer fabric. Perfect for festive sarees and lehengas.',
    price: 1899,
    discountPrice: 1599,
    category: 'Blouses',
    fabric: 'Net',
    color: ['Midnight Blue', 'Silver'],
    size: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 15,
    isFeatured: false,
    tags: ['backless', 'designer', 'modern', 'festive'],
    images: [{ url: 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=600&q=80' }],
  },

  // ── SETS ────────────────────────────────────────────
  {
    name: 'Salwar Suit Set - Mughal Garden',
    description: 'Elegant 3-piece salwar suit with embroidered kurta, matching churidar and dupatta. Rich floral embroidery inspired by Mughal garden motifs.',
    price: 5499,
    discountPrice: 4499,
    category: 'Sets',
    fabric: 'Georgette',
    color: ['Peach', 'Gold'],
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 18,
    isFeatured: true,
    tags: ['salwar suit', '3-piece', 'mughal', 'embroidery'],
    images: [{ url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80' }],
  },
  {
    name: 'Patiala Suit Set - Royal Turquoise',
    description: 'Vibrant Patiala suit with phulkari yoke detailing, flowy Patiala salwar and complementing dupatta. Comfortable yet festive.',
    price: 2799,
    discountPrice: 2299,
    category: 'Sets',
    fabric: 'Cotton',
    color: ['Turquoise', 'Multi'],
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 30,
    isFeatured: false,
    tags: ['patiala', 'phulkari', 'punjabi', 'festive'],
    images: [{ url: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=600&q=80' }],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await Product.countDocuments();
  if (existing >= products.length) {
    console.log(`ℹ️  ${existing} products already in DB. Skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  await Product.insertMany(products);
  console.log(`✅ ${products.length} products seeded successfully!`);
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
