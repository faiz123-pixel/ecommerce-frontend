import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userApi } from "../../api/api";
import Sidebar from "./Sidebar";

function Users() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  // 🔥 Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await userApi.get("");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 Update Only
  const onSubmit = async (data) => {
    if (!editId) {
      alert("Please select a user to edit");
      return;
    }

    try {
      await userApi.put(`/${editId}`, data);

      setEditId(null);
      reset();
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Edit
  const handleEdit = (user) => {
    setEditId(user.id);

    setValue("firstName", user.firstName);
    setValue("email", user.email);
    setValue("phone", user.phone);
  };

  // 🔥 Activate / Deactivate
  const toggleStatus = async (user) => {
    const confirmAction = window.confirm("Are you sure?");
    if (!confirmAction) return;

    try {
      if (user.status) {
        await userApi.put(`/deactivate/${user.id}`);
      } else {
        await userApi.put(`/activate/${user.id}`);
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Delete (optional)
  const handleDelete = async (id) => {
    const confirmAction = window.confirm("Delete this user?");
    if (!confirmAction) return;

    try {
      await userApi.delete(`/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <div className="container-fluid">
          <h1>User Management</h1>

          {/* 🔥 Form (Update Only) */}
          <form onSubmit={handleSubmit(onSubmit)} className="form-grid">

            <input
              {...register("firstName", { required: true })}
              placeholder="Name"
              disabled={!editId}
            />

            <input
              {...register("email", { required: true })}
              placeholder="Email"
              disabled={!editId}
            />

            <input
              {...register("phone")}
              placeholder="Phone"
              disabled={!editId}
            />

            <button type="submit" className="btn-primary" disabled={!editId}>
              Update User
            </button>

            {editId && (
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setEditId(null);
                  reset();
                }}
              >
                Cancel
              </button>
            )}
          </form>

          {/* 🔥 Table */}
          <h2>User Dashboard</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.firstName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>

                  <td>
                    {u.status ? (
                      <span className="status-active">Active</span>
                    ) : (
                      <span className="status-inactive">Inactive</span>
                    )}
                  </td>

                  <td>{u.orders ? u.orders.length : 0}</td>

                  <td>
                    <button
                      onClick={() => handleEdit(u)}
                      className="btn-edit"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleStatus(u)}
                      className="btn-delete"
                    >
                      {u.status ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDelete(u.id)}
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
}

export default Users;