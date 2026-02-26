import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for professional error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
