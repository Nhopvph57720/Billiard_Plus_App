import axios from "axios";
import * as SecureStore from "expo-secure-store"; // an toàn hơn AsyncStorage
import { API_URL } from "../constants/config";

const instance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Đọc token mỗi lần (hoặc cache trong biến cục bộ)
async function getAccessToken() {
  return await SecureStore.getItemAsync("accessToken");
}
async function getRefreshToken() {
  return await SecureStore.getItemAsync("refreshToken");
}

// Gắn Authorization
instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tự refresh khi 401
let isRefreshing = false;
let queue = [];
function flushQueue(err, token = null) {
  queue.forEach(p => (err ? p.reject(err) : p.resolve(token)));
  queue = [];
}

instance.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return axios(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const rt = await getRefreshToken();
        if (!rt) throw error;
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: rt });
        const newToken = res.data?.accessToken;
        if (newToken) {
          await SecureStore.setItemAsync("accessToken", newToken);
          flushQueue(null, newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return axios(original);
        }
        throw error;
      } catch (e) {
        flushQueue(e, null);
        // tuỳ ý: điều hướng về Login
        throw e;
      } finally {
        isRefreshing = false;
      }
    }
    throw error;
  }
);

export default instance;