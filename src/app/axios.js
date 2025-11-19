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
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    };

    console.error("API Error:", errorDetails);

    // Network error (CORS, server down, etc.)
    if (!error.response) {
      console.error("Network Error - Server might be down or CORS issue");
      console.error("Full URL:", error.config?.baseURL + error.config?.url);
    }

    if (error.response?.status === 401) {
      console.error("Unauthorized - redirecting to login");
      // You can add redirect logic here if needed
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  },
);

export default instance;
