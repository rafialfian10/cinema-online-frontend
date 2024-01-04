"use client";

// components next
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

// components react
import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, SubmitHandler } from "react-hook-form";

// types
import { UserAuth } from "@/types/userAuth";
import { LoginValues } from "@/types/login";

// redux
// import { logIn } from '@/redux/features/authSlice';
// import { useAppSelector, AppDispatch } from '@/redux/store';
// import { useDispatch, } from 'react-redux';

// alert
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// svg
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
library.add(faEye, faEyeSlash);

// styles
import styles from "./login.module.css";

// image
import github from "@/assets/img/github.png";
//--------------------------------------------------------------------

export interface LoginProps {
  modalLogin: boolean;
  setModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalLogin: () => void;
  openModalRegister: () => void;
}

export default function Login({
  modalLogin,
  setModalLogin,
  closeModalLogin,
  openModalRegister,
}: LoginProps) {
  // session
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;

  const router = useRouter();

  // state password visible
  const [passwordVisible, setPasswordVisible] = useState(false);

  // state alert toast 2
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // handle modal register
  const handleModalRegister = () => {
    closeModalLogin();
    openModalRegister();
  };

  // error message
  const errorMessages = {
    email: "Email is required",
    password: "Password is required",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginValues>();

  // handle submit login
  const onSubmit: SubmitHandler<LoginValues> = async (data, e) => {
    e?.preventDefault();
    const result = signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      if (callback?.error) {
        toast.error("Login Failed!, wrong email or password", {
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
        return;
      }

      if (callback?.ok) {
        // alert 1
        toast.success("Login Successfully!", {
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

        //  alert 2
        setModalLogin(false);
        setShowSuccessToast(true);
        reset();
        router.push("/");
      }
    });
  };

  const onError = () => {
    console.log("Login failed");
  };

  useEffect(() => {
    if (showSuccessToast) {
      setTimeout(() => {
        toast.success(`Wellcome ${user?.data?.username}`, {
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

        // Setelah toast kedua muncul, atur showSuccessToast menjadi false lagi
        setShowSuccessToast(false);
      }, 4000);
    }
  }, [showSuccessToast, user?.data?.username]);

  return (
    <section>
      <Transition appear show={modalLogin} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalLogin}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0D0D0D] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="bg-[#0D0D0D] text-2xl font-bold text-center text-[#CD2E71]"
                  >
                    Login
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className="border-b border-gray-900/10 pb-8">
                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="col-span-full">
                          <div className="relative flex items-center">
                            <input
                              type="email"
                              id="email"
                              autoComplete="off"
                              placeholder="Email"
                              className="block w-full bg-[#3E3E3E] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#3E3E3E] sm:text-sm sm:leading-6"
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
                      </div>
                    </div>

                    <div className="col-span-full">
                      <button
                        type="submit"
                        className="w-full px-3 py-1.5 rounded-md shadow-sm bg-[#CD2E71] hover:opacity-80 text-[#D2D2D2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Login
                      </button>
                    </div>
                    <div className="col-span-full mt-2 text-center">
                      <span className="text-sm text-[#D2D2D2]">
                        Don't have an account ?{" "}
                        <button type="button" onClick={handleModalRegister}>
                          Click Here
                        </button>
                      </span>
                    </div>
                  </form>

                  <p className="w-full mt-5 mb-2 text-center text-[#D2D2D2]">
                    or sign in with
                  </p>
                  <Link
                    href="/api/auth/signin"
                    className="w-full bg-[#3E3E3E] rounded-md p-1.5 flex justify-center items-center hover:opacity-80"
                  >
                    <Image src={github} alt="github" className="w-7 h-7 mr-2" />
                    <span>Sign In with Github</span>
                  </Link>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </section>
  );
}
