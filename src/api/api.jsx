import axios from "axios";

export const categoriesApi = axios.create({
  baseURL: "http://localhost:8080/categories",
});
export const productsApi = axios.create({
  baseURL: "http://localhost:8080/products",
});
export const loginApi = axios.create({
  baseURL: "http://localhost:8080/auth/login",
});
export const userApi = axios.create({
  baseURL: "http://localhost:8080/users",
});
export const ordersApi = axios.create({
  baseURL: "http://localhost:8080/orders",
});
export const paymentApi = axios.create({
  baseURL: "http://localhost:8080/payments",
});
export const cartApi = axios.create({
  baseURL: "http://localhost:8080/carts",
});
export const wishlistApi = axios.create({
  baseURL: "http://localhost:8080/wishlist",
});

const apis = [
  userApi,
  categoriesApi,
  productsApi,
  loginApi,
  ordersApi,
  paymentApi,
  cartApi,
  wishlistApi

];

apis.forEach((api) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
});