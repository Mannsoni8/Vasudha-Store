import { useState, useEffect, useRef } from 'react';
import { productAPI } from '../utils/api';

// ── useDebounce ─────────────────────────────────────
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// ── useProducts ─────────────────────────────────────
export const useProducts = (params = {}) => {
  const [products, setProducts]     = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    productAPI.getAll(params)
      .then(({ data }) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') setError(err.response?.data?.message || 'Failed to load products');
      })
      .finally(() => setLoading(false));

    return () => abortRef.current?.abort();
  }, [JSON.stringify(params)]);

  return { products, pagination, loading, error };
};

// ── useProduct ──────────────────────────────────────
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productAPI.getOne(id)
      .then(({ data }) => setProduct(data.product))
      .catch((err) => setError(err.response?.data?.message || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error, setProduct };
};

// ── useLocalStorage ─────────────────────────────────
export const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial; }
    catch { return initial; }
  });
  const set = (v) => { setValue(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [value, set];
};
