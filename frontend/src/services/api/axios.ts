import axios from 'axios';

const normalizedEnvBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '');
const fallbackBaseUrl =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

if (!normalizedEnvBaseUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    '[coreApi] VITE_API_BASE_URL is not defined. Falling back to window.origin/localhost.',
  );
}

const baseURL = normalizedEnvBaseUrl || fallbackBaseUrl;

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
