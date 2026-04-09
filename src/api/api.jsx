import axios from "axios";

export const categoriesApi = axios.create({
  baseURL: "http://localhost:8080/categories",
});

export const productsApi = axios.create({
  baseURL: "http://localhost:8080/products",
});

