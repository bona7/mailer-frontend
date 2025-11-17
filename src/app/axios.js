import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  async (config) => {
    // Get the token from the Clerk session
    try {
      if (window.Clerk) {
        const token = await window.Clerk.session?.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error getting Clerk token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      console.error("Unauthorized - redirecting to login");
      // You can add redirect logic here if needed
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  },
);

export default instance;
