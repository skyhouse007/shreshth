import axios from 'axios';
import { STORAGE_TOKEN } from '../utils/constants.js';

/** Normalize so requests hit `/api/...` even if env is `http://localhost:5000` without `/api`. */
function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (!raw) return '/api';
  let base = raw.replace(/\/+$/, '');
  if (!base.endsWith('/api')) base = `${base}/api`;
  return base;
}

const baseURL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);
