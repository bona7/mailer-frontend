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
          console.log("✅ Clerk JWT 전송 (전체):");
          console.log(token);
        } else {
          console.warn("⚠️ Clerk 토큰이 없습니다. 로그인 필요.");
        }
      } else {
        console.warn("⚠️ Clerk가 로드되지 않았습니다.");
      }
    } catch (error) {
      console.error("❌ Clerk 토큰 가져오기 실패:", error);
    }

    // Add user_id query parameter for test_auth
    const userId = localStorage.getItem("user_id");
    if (userId) {
      // URL에 이미 쿼리 파라미터가 있는지 확인
      const separator = config.url.includes("?") ? "&" : "?";
      config.url = `${config.url}${separator}user_id=${userId}`;
      console.log("📤 요청 URL:", config.baseURL + config.url);
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
