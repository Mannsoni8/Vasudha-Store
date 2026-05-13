const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Admin
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
  });
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Admin
router.delete('/:publicId', protect, adminOnly, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(`vasudha-store/products/${req.params.publicId}`);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
