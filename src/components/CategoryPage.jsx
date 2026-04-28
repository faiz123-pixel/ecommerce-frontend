import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./CategoryPage.css";
import { categoriesApi, productsApi } from "../api/api";
import Sidebar from "../pages/admin/Sidebar";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryId, setNewCategoryId] = useState("");

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
    try {
      // If trying to deactivate
      if (cat.status) {
        const res = await productsApi.get(`/category/${cat.categoryId}`);

        if (res.data.length > 0) {
          // 🔥 Open modal instead of direct deactivate
          setSelectedCategory(cat);
          setShowModal(true);
          return;
        }

        await categoriesApi.put(`/deactivate/${cat.categoryId}`);
      } else {
        await categoriesApi.put(`/activate/${cat.categoryId}`);
      }

      fetchCategories();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleReassign = async () => {
    if (!newCategoryId) {
      alert("Please select a new category");
      return;
    }

    try {
      // 🔥 Move products
      await productsApi.put("/category/update", {
        oldCategoryId: selectedCategory.categoryId,
        newCategoryId: newCategoryId,
      });

      // 🔥 Deactivate old category
      await categoriesApi.put(`/deactivate/${selectedCategory.categoryId}`);

      setShowModal(false);
      setSelectedCategory(null);
      setNewCategoryId("");

      fetchCategories();
    } catch (error) {
      console.error("Error reassigning products", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmAction = window.confirm("Deactivate this category?");
    if (!confirmAction) return;

    try {
      await categoriesApi.put(`/deactivate/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  return (
    <>
      <Sidebar />

      <div className="category-main">
        <div className="container-fluid">
          <h2 className="mb-4">Category Management</h2>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div>
              <input
                type="text"
                placeholder="Category Name"
                {...register("categoryName", {
                  required: "Category name is required",
                  validate: (value) => value.trim() !== "" || "Cannot be empty",
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

            <button type="submit" className="btn-primary">
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
          <div className="table-wrapper">
            {categories.length === 0 ? (
              <p className="no-data">No categories found</p>
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

                      <td>
                        <span
                          className={`status ${
                            cat.status ? "active" : "inactive"
                          }`}
                        >
                          {cat.status ? "Active" : "Inactive"}
                        </span>
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

          {showModal && (
            <div className="modal d-block">
              <div className="modal-dialog">
                <div className="modal-content p-3">
                  <h5>Reassign Products</h5>
                  <p>This category has products. Select a new category.</p>

                  <select
                    className="form-control my-3"
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories
                      .filter(
                        (c) => c.categoryId !== selectedCategory?.categoryId,
                      )
                      .map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))}
                  </select>

                  <button className="btn btn-success" onClick={handleReassign}>
                    Reassign & Deactivate
                  </button>

                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
