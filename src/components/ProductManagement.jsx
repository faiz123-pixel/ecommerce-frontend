import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./ProductManagement.css";
import { categoriesApi, productsApi } from "../api/api";
import Sidebar from "../pages/admin/Sidebar";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchProducts = async () => {
    try {
      const res = await productsApi.get("");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.get("");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      productName: data.productName,
      description: data.description,
      price: Number(data.price),
      SKU: data.SKU,
      inventoryCount: Number(data.inventoryCount),
      status: true,
      categoryId: {
        categoryId: Number(data.categoryId), 
      },
    };
    console.log(payload);

    try {
      if (editId) {
        await productsApi.put(`/${editId}`, payload);
        setEditId(null);
      } else {
        await productsApi.post("", payload);
      }

      fetchProducts();
      reset();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const handleEdit = (p) => {
    setValue("productName", p.productName);
    setValue("price", p.price);
    setValue("description", p.description);
    setValue("SKU", p.SKU);
    setValue("inventoryCount", p.inventoryCount);
    setValue("categoryId", p.categoryId?.categoryId);

    setEditId(p.productId);
  };


  const toggleStatus = async (p) => {
    const confirmAction = window.confirm("Are you sure?");
    if (!confirmAction) return;

    try {
      if (p.status) {
        await productsApi.put(`/deactivate/${p.productId}`);
      } else {
        await productsApi.put(`/activate/${p.productId}`);
      }

      fetchProducts();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await productsApi.delete(`/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  return (
    <>
    <Sidebar/>
    <div className="main-content">
    <div className="container-fluid">
      <h1>Product Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">

        <input {...register("productName", { required: true })} placeholder="Product Name" />

        <input {...register("price", { required: true })} placeholder="Price" />

        {/* Category Dropdown */}
        <select {...register("categoryId", { required: true })}>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <input {...register("SKU")} placeholder="SKU" />

        <input {...register("inventoryCount")} placeholder="Stock" />

        <textarea {...register("description")} placeholder="Description" />

        <button type="submit" className="btn-primary">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Table */}
      <h2>Product Dashboard</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.productId}>
              <td>{p.productName}</td>
              <td>{p.price}</td>
              <td>{p.categoryId?.categoryName}</td>
              <td>{p.inventoryCount}</td>

              <td>
                {p.status ? (
                  <span className="status-active">Active</span>
                ) : (
                  <span className="status-inactive">Inactive</span>
                )}
              </td>

              <td>
                <button onClick={() => handleEdit(p)} className="btn-edit">
                  Edit
                </button>

                <button onClick={() => toggleStatus(p)} className="btn-delete">
                  {p.status ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => handleDelete(p.productId)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
    </>
  );
};

export default ProductManagement;