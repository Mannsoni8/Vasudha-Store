const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Sarees', 'Kurtis', 'Lehengas', 'Dupattas', 'Blouses', 'Sets'],
    },
    fabric: {
      type: String,
      enum: ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Banarasi', 'Chanderi', 'Net', 'Crepe', 'Other'],
    },
    color: [{ type: String }],
    size: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] }],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
