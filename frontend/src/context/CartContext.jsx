import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]       = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch { /* silent */ }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1, size, color) => {
    if (!user) { toast.error('Please login to add items to cart'); return false; }
    setLoading(true);
    try {
      const { data } = await cartAPI.add({ productId, quantity, size, color });
      setCart(data.cart);
      toast.success('Added to cart! 🛍️');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.update(itemId, quantity);
      setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    try {
      const { data } = await cartAPI.remove(itemId);
      setCart(data.cart);
      toast.success('Item removed');
    } catch {
      toast.error('Remove failed');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [] });
    } catch { /* silent */ }
  }, []);

  const cartCount  = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const cartTotal  = cart.items?.reduce((acc, i) => {
    const price = i.product?.discountPrice || i.product?.price || 0;
    return acc + price * i.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, cartTotal, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
