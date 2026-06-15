import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response?.data?.message || "";

    if (errorMessage.includes("Bad credentials")) {
      return Promise.reject(error);
    }
    // 🛠️ Əgər gələn xəta 403 Forbidden-dirsə (Yəni başqa tabda USER-lə girmisən və admin panelini yeniləyirsən)
    if (error.response && error.response.status === 403) {
      console.warn("Bu endpoint üçün rolunuz çatmır! Giriş səhifəsinə yönləndirilirsiniz...");
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (
      (error.response && error.response.status === 401) ||
      errorMessage.includes("Jwt") ||
      errorMessage.includes("token") ||
      errorMessage.includes("Malformed")
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const res = await axios.post('http://localhost:8080/api/auth/refresh', {
              refreshToken: refreshToken,
            });
            if (res.status === 200) {
              const newAccessToken = res.data.accessToken;
              localStorage.setItem('accessToken', newAccessToken);
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return API(originalRequest);
            }
          }
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ƏN KRİTİK HİSSƏ: Bu sətirin tam olaraq aşağıda yazıldığından əmin ol!
export default API;