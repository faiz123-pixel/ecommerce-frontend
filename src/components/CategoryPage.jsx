import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./CategoryPage.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Submit (Add / Update)
  const onSubmit = (data) => {
    const trimmedData = {
      categoryName: data.categoryName.trim(),
      description: data.description?.trim(),
    };

    if (editId !== null) {
      // Update
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editId ? { ...cat, ...trimmedData } : cat
        )
      );
      setEditId(null);
    } else {
      // Create
      const newCategory = {
        id: Date.now(),
        ...trimmedData,
        status: true,
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    reset();
  };

  // Edit
  const handleEdit = (cat) => {
    setValue("categoryName", cat.categoryName);
    setValue("description", cat.description);
    setEditId(cat.id);
  };

  // Activate / Deactivate (with confirm)
  const toggleStatus = (id) => {
    const confirmAction = window.confirm("Are you sure?");
    if (!confirmAction) return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, status: !cat.status } : cat
      )
    );
  };

  return (
    <div className="container">
      <h2>Category Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Category Name */}
        <div>
          <input
            type="text"
            placeholder="Category Name"
            {...register("categoryName", {
              required: "Category name is required",
              validate: (value) =>
                value.trim() !== "" || "Cannot be empty",
              minLength: {
                value: 3,
                message: "Minimum 3 characters required",
              },
            })}
          />
          {errors?.categoryName && (
            <p className="error">{errors.categoryName.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <input
            type="text"
            placeholder="Description"
            {...register("description", {
              maxLength: {
                value: 300,
                message: "Max 300 characters allowed",
              },
            })}
          />
          {errors?.description && (
            <p className="error">{errors.description.message}</p>
          )}
        </div>

        {/* Buttons */}
        <button type="submit">
          {editId ? "Update Category" : "Add Category"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              reset();
              setEditId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      {categories.length === 0 ? (
        <p style={{ textAlign: "center" }}>No categories found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Products</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.categoryName}</td>
                <td>{cat.description}</td>
                <td>{cat.productCount}</td>
                <td className={cat.status ? "active" : "inactive"}>
                  {cat.status ? "Active" : "Inactive"}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-edit"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-toggle"
                    onClick={() => toggleStatus(cat.id)}
                  >
                    {cat.status ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryPage;