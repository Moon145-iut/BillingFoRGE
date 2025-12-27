import axios from 'axios';

const PRODUCTION_BACKEND_URL = 'https://billingforge.onrender.com';

const normalizedEnvBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');

const resolveBaseUrl = () => {
  if (normalizedEnvBaseUrl) {
    return normalizedEnvBaseUrl;
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }

  const host = window.location.hostname;
  const isVercelHost = host === 'billing-fo-rge-frontend.vercel.app' || host.endsWith('.vercel.app');

  if (isVercelHost) {
    return PRODUCTION_BACKEND_URL;
  }

  return window.location.origin;
};

const baseURL = resolveBaseUrl();

if (!normalizedEnvBaseUrl) {
  // eslint-disable-next-line no-console
  console.warn('[coreApi] Falling back to derived API base URL:', baseURL);
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const session = localStorage.getItem('adminSession');
  if (session) {
    config.headers['x-admin-session'] = session;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminSession');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
