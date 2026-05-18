import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { couponsApi } from "../../api/api";

const CouponDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch Coupons
  const fetchCoupons = async () => {
    try {
      const res = await couponsApi.get("");
      setCoupons(res.data);
    } catch (error) {
      console.error("Error fetching coupons", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Submit Form
  const onSubmit = async (data) => {
    const payload = {
      couponCode: data.couponCode,
      couponDiscountType: data.couponDiscountType,
      discountValue: Number(data.discountValue),
      validFrom: data.validFrom,
      validTo: data.validTo,
      usageLimit: Number(data.usageLimit),
      status: true,
    };

    try {
      if (editId) {
        await couponsApi.put(`/${editId}`, payload);
        setEditId(null);
      } else {
        await couponsApi.post("", payload);
      }

      fetchCoupons();
      reset();
    } catch (error) {
      console.error("Error saving coupon", error);
    }
  };

  // Edit Coupon
  const handleEdit = (coupon) => {
    setValue("couponCode", coupon.couponCode);
    setValue("couponDiscountType", coupon.couponDiscountType);
    setValue("discountValue", coupon.discountValue);

    setValue(
      "validFrom",
      coupon.validFrom?.slice(0, 16)
    );

    setValue(
      "validTo",
      coupon.validTo?.slice(0, 16)
    );

    setValue("usageLimit", coupon.usageLimit);

    setEditId(coupon.id);
  };

  // Activate / Deactivate
  const toggleStatus = async (coupon) => {
    const confirmAction = window.confirm(
      "Are you sure?"
    );

    if (!confirmAction) return;

    try {
      if (coupon.status) {
        await couponsApi.put(
          `/deactivate/${coupon.id}`
        );
      } else {
        await couponsApi.put(
          `/activate/${coupon.id}`
        );
      }

      fetchCoupons();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // Delete Coupon
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this coupon?"
    );

    if (!confirmDelete) return;

    try {
      await couponsApi.delete(`/${id}`);
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon", error);
    }
  };

  return (
    <div className="main-content">
      <div className="container-fluid">

        <h1>Coupon Management</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-grid"
        >

          {/* Coupon Code */}
          <input
            {...register("couponCode", {
              required: "Coupon code required",
            })}
            placeholder="Coupon Code"
          />

          {/* Discount Type */}
          <select
            {...register("couponDiscountType", {
              required: true,
            })}
          >
            <option value="">
              Select Discount Type
            </option>

            <option value="PERCENTAGE">
              Percentage
            </option>

            <option value="FIXEDAMOUNT">
              Fixed Amount
            </option>
          </select>

          {/* Discount Value */}
          <input
            type="number"
            step="0.01"
            {...register("discountValue", {
              required: true,
            })}
            placeholder="Discount Value"
          />

          {/* Valid From */}
          <input
            type="datetime-local"
            {...register("validFrom", {
              required: true,
            })}
          />

          {/* Valid To */}
          <input
            type="datetime-local"
            {...register("validTo", {
              required: true,
            })}
          />

          {/* Usage Limit */}
          <input
            type="number"
            {...register("usageLimit")}
            placeholder="Usage Limit"
          />

          <button
            type="submit"
            className="btn-primary"
          >
            {editId
              ? "Update Coupon"
              : "Add Coupon"}
          </button>

          {/* Cancel Edit */}
          {editId && (
            <button
              type="button"
              onClick={() => {
                reset();
                setEditId(null);
              }}
              className="btn-delete"
            >
              Cancel
            </button>
          )}
        </form>

        {/* DASHBOARD */}
        <h2>Coupon Dashboard</h2>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Usage Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {coupons.length === 0 ? (
              <tr>
                <td colSpan="8">
                  No Coupons Found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id}>

                  <td>{coupon.couponCode}</td>

                  <td>
                    {coupon.couponDiscountType}
                  </td>

                  <td>
                    {coupon.discountValue}
                  </td>

                  <td>
                    {new Date(
                      coupon.validFrom
                    ).toLocaleString()}
                  </td>

                  <td>
                    {new Date(
                      coupon.validTo
                    ).toLocaleString()}
                  </td>

                  <td>{coupon.usageLimit}</td>

                  <td>
                    {coupon.status ? (
                      <span className="status-active">
                        Active
                      </span>
                    ) : (
                      <span className="status-inactive">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        handleEdit(coupon)
                      }
                      className="btn-edit"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        toggleStatus(coupon)
                      }
                      className="btn-delete"
                    >
                      {coupon.status
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          coupon.id
                        )
                      }
                      className="btn-delete"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponDashboard;