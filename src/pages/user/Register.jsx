import React from "react";
import { useForm } from "react-hook-form";
import { userApi } from "../../api/api";

function Register() {

  const{
    register,
    handleSubmit,
    watch,
    formState:{errors},
  } = useForm();

  const password=watch("password");

  const onSubmit= async (data)=>{
    console.log(data);

    try{
    const response= await userApi.post("/register",data);
    console.log(response);
    alert("User registration completed");
    }catch(error)
    {
      alert("Somthin want Wrong");
    }

  }




  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg">
              {/* Header */}
              <div className="card-header bg-success text-white text-center py-4">
                <h3 className="fw-bold mb-0">Create Your EcoTrack Account</h3>
                <p className="mb-0 small">
                  Join us in building a greener future 🌱
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      {...register("firstName",{
                        required:"First name is required",
                        minLength:{value:2,message:"Minimum 2 characters are required",},
                      })}
                    />
                    {errors.firstName && <small className="text-danger">{errors.firstName.message}</small>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      {...register("lastName",{required:"last name is required",
                        minLength:{value:2,message:"Minimum 2 characters are required",},
                      })}
                    />
                    {errors.lastName && <small className="text-danger">{errors.lastName.message}</small>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter your Phone Number"
                      {...register("phone",{required:"Number is required",
                        minLength:{value:10,message:"Minimum 10 characters are required",},
                      })}
                    />
                    {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      {...register("email",{required:"Email is required",
                        pattern:{
                          value:/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
                          message:"Enter valid Email",
                        },
                        validate:async (value)=>{
                          try {
                            const response=await userApi.get(`/check-email?email=${value}`);
                            const exists=response.data;
                            return exists ? 'Email already exists':true;
                            
                          } catch (error) {
                            return "Somthing went wrong";
                          }
                        }
                      })}
                    />
                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Create a password"
                      {...register("password",{required:"Password is required",
                        pattern:{
                          value:/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
                          message: " Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.",
                        },
                      })}
                    />
                    {errors.password && <small className="text-danger">{errors.password.message}</small>}
                    {/* Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces. */}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-enter password"
                      {...register("confirmPassword",{
                        required:"Confirm password is required",
                        validate:(value)=>value===password || "password and confirm  password is not same"
                      })}
                    />
                    {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-success btn-lg">
                      Register
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-success fw-semibold">
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
