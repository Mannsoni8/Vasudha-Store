import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload, FiX, FiArrowLeft } from 'react-icons/fi';
import { productAPI } from '../../utils/api';
import { CATEGORIES, FABRICS, SIZES } from '../../utils/helpers';
import toast from 'react-hot-toast';

const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'White', 'Black', 'Cream', 'Maroon', 'Gold', 'Navy', 'Teal', 'Magenta'];

const EMPTY = {
  name: '', description: '', price: '', discountPrice: '',
  category: 'Sarees', fabric: '', stock: '',
  color: [], size: [], tags: '', isFeatured: false,
};

export default function AdminProductForm() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const isEdit      = Boolean(id);

  const [form,     setForm]     = useState(EMPTY);
  const [images,   setImages]   = useState([]);   // { file, preview } or { url, publicId }
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load existing product
  useEffect(() => {
    if (!isEdit) return;
    productAPI.getOne(id).then(({ data }) => {
      const p = data.product;
      setForm({
        name: p.name, description: p.description,
        price: p.price, discountPrice: p.discountPrice || '',
        category: p.category, fabric: p.fabric || '',
        stock: p.stock, color: p.color || [],
        size: p.size || [], tags: p.tags?.join(', ') || '',
        isFeatured: p.isFeatured,
      });
      setImages(p.images.map(img => ({ url: img.url, publicId: img.publicId, existing: true })));
    }).catch(() => toast.error('Product not found'))
      .finally(() => setFetching(false));
  }, [id]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleArr = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val],
    }));
  };

  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImgs].slice(0, 5));
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      toast.error('Please fill name, price and stock'); return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, v.join(','));
        else fd.append(k, v);
      });

      // Append new image files
      images.filter(i => i.file).forEach(i => fd.append('images', i.file));

      // Send existing image URLs
      const existingImgs = images.filter(i => i.existing).map(i => ({ url: i.url, publicId: i.publicId }));
      fd.append('existingImages', JSON.stringify(existingImgs));

      if (isEdit) {
        await productAPI.update(id, fd);
        toast.success('Product updated! ✅');
      } else {
        await productAPI.create(fd);
        toast.success('Product created! 🌸');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-maroon-800 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-gray-500 text-sm">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Section title="Basic Information">
          <div className="space-y-4">
            <Field label="Product Name *">
              <input name="name" value={form.name} onChange={handle} className="input-field" placeholder="e.g. Kanjivaram Silk Saree in Royal Blue" required />
            </Field>
            <Field label="Description *">
              <textarea name="description" value={form.description} onChange={handle} rows={4} className="input-field resize-none" placeholder="Describe fabric, design, occasion, care instructions..." required />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category *">
                <select name="category" value={form.category} onChange={handle} className="input-field">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Fabric">
                <select name="fabric" value={form.fabric} onChange={handle} className="input-field">
                  <option value="">Select Fabric</option>
                  {FABRICS.map(f => <option key={f}>{f}</option>)}
                </select>
              </Field>
            </div>
          </div>
        </Section>

        {/* Pricing */}
        <Section title="Pricing & Stock">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (₹) *">
              <input name="price" type="number" value={form.price} onChange={handle} className="input-field" placeholder="1299" min={0} required />
            </Field>
            <Field label="Discount Price (₹)">
              <input name="discountPrice" type="number" value={form.discountPrice} onChange={handle} className="input-field" placeholder="999" min={0} />
            </Field>
            <Field label="Stock *">
              <input name="stock" type="number" value={form.stock} onChange={handle} className="input-field" placeholder="50" min={0} required />
            </Field>
          </div>
          {form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
            <p className="text-green-600 text-xs font-semibold mt-1">
              ✅ {Math.round(((form.price - form.discountPrice) / form.price) * 100)}% discount will be shown
            </p>
          )}
        </Section>

        {/* Variants */}
        <Section title="Colors & Sizes">
          <Field label="Available Colors">
            <div className="flex flex-wrap gap-2 mt-1">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => toggleArr('color', c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                    form.color.includes(c) ? 'border-maroon-600 bg-maroon-100 text-maroon-800' : 'border-gray-200 text-gray-600 hover:border-maroon-300'
                  }`}
                >{c}</button>
              ))}
            </div>
          </Field>
          <Field label="Available Sizes" className="mt-4">
            <div className="flex flex-wrap gap-2 mt-1">
              {SIZES.map(s => (
                <button key={s} type="button" onClick={() => toggleArr('size', s)}
                  className={`w-16 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                    form.size.includes(s) ? 'border-maroon-600 bg-maroon-800 text-white' : 'border-gray-200 text-gray-600 hover:border-maroon-300'
                  }`}
                >{s}</button>
              ))}
            </div>
          </Field>
        </Section>

        {/* Images */}
        <Section title="Product Images (max 5)">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-cream-100 border-2 border-cream-200">
                <img src={img.preview || img.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <FiX size={12} />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 rounded">Main</span>}
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-[4/5] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-maroon-400 hover:bg-maroon-50 transition-all">
                <FiUpload size={20} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Add Photo</span>
                <input type="file" accept="image/*" multiple onChange={handleImageFiles} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">First image is the main product photo. Max 5MB per image.</p>
        </Section>

        {/* Extra */}
        <Section title="Additional Details">
          <Field label="Tags (comma separated)">
            <input name="tags" value={form.tags} onChange={handle} className="input-field" placeholder="wedding, silk, bridal, festive" />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer mt-4">
            <div className={`w-11 h-6 rounded-full transition-all relative ${form.isFeatured ? 'bg-maroon-700' : 'bg-gray-300'}`}
              onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isFeatured ? 'left-6' : 'left-1'}`} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">Feature this product</p>
              <p className="text-xs text-gray-500">Shown on homepage featured section</p>
            </div>
          </label>
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline px-8">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 sm:flex-none px-10 flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : (
              isEdit ? '✅ Update Product' : '🌸 Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-display font-semibold text-gray-700 mb-4 text-base border-b border-gray-100 pb-2">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
