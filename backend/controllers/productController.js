const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all products with search, filter, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Fabric filter
    if (req.query.fabric) {
      query.fabric = req.query.fabric;
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Sort
    let sortBy = { createdAt: -1 };
    if (req.query.sort === 'price-low') sortBy = { price: 1 };
    if (req.query.sort === 'price-high') sortBy = { price: -1 };
    if (req.query.sort === 'popular') sortBy = { soldCount: -1 };
    if (req.query.sort === 'rating') sortBy = { rating: -1 };

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortBy).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, fabric, color, size, stock, isFeatured, tags } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push({ url: file.path, publicId: file.filename });
      });
    }

    // Support JSON body image URLs too
    if (req.body.images) {
      const bodyImages = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
      bodyImages.forEach((img) => images.push(img));
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      category,
      fabric,
      color: typeof color === 'string' ? color.split(',').map((c) => c.trim()) : color,
      size: typeof size === 'string' ? size.split(',').map((s) => s.trim()) : size,
      stock: Number(stock),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      tags: typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : tags,
      images,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
      updateData.images = [...product.images, ...newImages];
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.discountPrice) updateData.discountPrice = Number(updateData.discountPrice);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (typeof updateData.color === 'string') updateData.color = updateData.color.split(',').map((c) => c.trim());
    if (typeof updateData.size === 'string') updateData.size = updateData.size.split(',').map((s) => s.trim());

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if already reviewed
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };
