import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./CategoryPage.css";
import { categoriesApi } from "../api/api"; 

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

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.get("");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  const onSubmit = async (data) => {
    const payload = {
      categoryName: data.categoryName.trim(),
      description: data.description?.trim(),
      status: true,
    };

    try {
      if (editId !== null) {
        // ✅ Update
        await categoriesApi.put(`/${editId}`, payload);
        setEditId(null);
      } else {
        // ✅ Create
        await categoriesApi.post("", payload);
      }

      fetchCategories(); // refresh
      reset();
    } catch (error) {
      console.error("Error saving category", error);
    }
  };

  const handleEdit = (cat) => {
    setValue("categoryName", cat.categoryName);
    setValue("description", cat.description);
    setEditId(cat.categoryId);
  };


  const toggleStatus = async (cat) => {
    const confirmAction = window.confirm("Are you sure?");
    if (!confirmAction) return;

    try {
      if (cat.status) {
        await categoriesApi.put(`/deactivate/${cat.categoryId}`);
      } else {
        await categoriesApi.put(`/activate/${cat.categoryId}`);
      }

      fetchCategories();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };


  const handleDelete = async (id) => {
    const confirmAction = window.confirm("Delete this category?");
    if (!confirmAction) return;

    try {
      await categoriesApi.delete(`/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  return (
    <div className="container">
      <h2>Category Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
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
        </div>

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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.categoryId}>
                <td>{cat.categoryName}</td>
                <td>{cat.description}</td>
                <td className={cat.status ? "active" : "inactive"}>
                  {cat.status ? "Active" : "Inactive"}
                </td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-toggle"
                    onClick={() => toggleStatus(cat)}
                  >
                    {cat.status ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(cat.categoryId)}
                  >
                    Delete
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