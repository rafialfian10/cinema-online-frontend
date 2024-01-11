"use client";

// components react
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, SubmitHandler } from "react-hook-form";

// components redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerUser } from "@/redux/features/userSlice.";

// types
import { RegisterValues } from "@/types/register";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// styles
import styles from "./register.module.css";

// svg
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
library.add(faEye, faEyeSlash);
// -----------------------------------------------------------------

export interface RegisterProps {
  modalRegister: boolean;
  closeModalRegister: () => void;
  openModalLogin: () => void;
}

export default function Register({
  modalRegister,
  closeModalRegister,
  openModalLogin,
}: RegisterProps) {
  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  // state password visible
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // handle modal login
  const handleModalLogin = () => {
    closeModalRegister();
    openModalLogin();
  };

  // error message
  const errorMessages = {
    username: "Username is required",
    email: "Email is required",
    password: "Password is required",
    cpassword: "Confirm password is required",
    passwordValidation:
      "Password must contain at least one uppercase and lowercase letter, one digit, and be at least 8 characters long.",
    passwordMatch: "The confirm password does not match the password",
  };

  // handle register
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<RegisterValues> = async (formData) => {
    try {
      const response = await dispatch(registerUser({ formData }));
      if (response.payload && response.payload.status === 200) {
        toast.success("Register successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { marginTop: "65px" },
        });
        handleModalLogin();
        reset();
      } else if (response.payload.status === 409) {
        toast.error("Username or email already exists.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { marginTop: "65px" },
        });
      } else {
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { marginTop: "65px" },
        });
      }
    } catch (error) {
      // console.log(error);
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: { marginTop: "65px" },
      });
    }
  };

  const onError = () => {
    console.log("Register failed");
  };

  return (
    <section>
      <Transition appear show={modalRegister} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalRegister}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#0D0D0D] bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0D0D0D] p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mt-5 bg-[#0D0D0D] text-2xl font-bold text-center text-[#CD2E71]"
                  >
                    Register
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                        <div className="col-span-full">
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              id="username"
                              autoComplete="off"
                              placeholder="Username"
                              className="block m-0 w-full bg-[#3E3E3E] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#3E3E3E] sm:text-sm sm:leading-6"
                              {...register("username", {
                                required: errorMessages.username,
                              })}
                            />
                          </div>
                          {errors.username ? (
                            <p className="mt-1 text-red-500 text-left text-sm">
                              {errors.username.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-span-full">
                          <div className="relative flex items-center">
                            <input
                              type="email"
                              id="email"
                              autoComplete="off"
                              placeholder="Email"
                              className="block m-0 w-full bg-[#3E3E3E] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#3E3E3E] sm:text-sm sm:leading-6"
                              {...register("email", {
                                required: errorMessages.email,
                              })}
                            />
                          </div>
                          {errors.email ? (
                            <p className="mt-1 text-red-500 text-left text-sm">
                              {errors.email.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-span-full">
                          <div className="relative flex items-center">
                            <input
                              type={passwordVisible ? "text" : "password"}
                              id="password"
                              autoComplete="off"
                              placeholder="Password"
                              className="block m-0 w-full bg-[#3E3E3E] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#3E3E3E] sm:text-sm sm:leading-6"
                              {...register("password", {
                                required: errorMessages.password,
                                pattern: {
                                  value:
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*.])[A-Za-z\d@$%^&*#.,]{8,}$/,
                                  message: errorMessages.passwordValidation,
                                },
                              })}
                            />
                            <span className={styles.eye_icon}>
                              {
                                <FontAwesomeIcon
                                  className="text-[#D2D2D2]"
                                  icon={passwordVisible ? "eye-slash" : "eye"}
                                  onClick={() =>
                                    setPasswordVisible(!passwordVisible)
                                  }
                                />
                              }
                            </span>
                          </div>
                          {errors.password ? (
                            <p className="mt-1 text-red-500 text-left text-sm">
                              {errors.password.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-span-full mb-1">
                          <div className="relative flex items-center">
                            <input
                              type={
                                confirmPasswordVisible ? "text" : "password"
                              }
                              id="cpassword"
                              autoComplete="off"
                              placeholder="Confirm Password"
                              className="block m-0 w-full bg-[#3E3E3E] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#3E3E3E] sm:text-sm sm:leading-6"
                              {...register("cpassword", {
                                required: errorMessages.cpassword,
                                validate: (value) =>
                                  value === watch("password") ||
                                  errorMessages.passwordMatch,
                              })}
                            />
                            <span className={styles.eye_icon}>
                              {
                                <FontAwesomeIcon
                                  className="text-[#D2D2D2]"
                                  icon={
                                    confirmPasswordVisible ? "eye-slash" : "eye"
                                  }
                                  onClick={() =>
                                    setConfirmPasswordVisible(
                                      !confirmPasswordVisible
                                    )
                                  }
                                />
                              }
                            </span>
                          </div>
                          {errors.cpassword ? (
                            <p className="mt-1 text-red-500 text-left text-sm">
                              {errors.cpassword.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <input
                        type="submit"
                        className="w-full px-3 py-1.5 rounded-md shadow-sm bg-[#CD2E71] hover:opacity-80 text-[#D2D2D2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                      />
                    </div>
                    <div className="col-span-full mt-2">
                      <p className="text-sm text-[#D2D2D2]">
                        Already have an account ?{" "}
                        <button type="button" onClick={handleModalLogin}>
                          {" "}
                          Click Here
                        </button>
                      </p>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
