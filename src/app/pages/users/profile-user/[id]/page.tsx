"use client";

// components next
import Image from "next/image";
import { useSession } from "next-auth/react";

// components react
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import moment from "moment";

// components
import AuthUser from "@/app/components/auth-user/authUser";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { CheckAuthValues } from "@/types/checkAuth";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// image
import defaultPhoto from "@/assets/img/default-photo.png";
// ------------------------------------------------------------

interface ProfileProps {
  params: { id: string };
}

function ProfileUser({ params }: ProfileProps) {
  // const [user, transaction] = await Promise.all([getUsers(), getTransactions()])

  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  // state user
  const [user, setUser] = useState<any>();

  // state transactions
  const [transactions, setTransactions] = useState<any[]>([]);

  // fetch user
  async function fetchUserAuth() {
    if (status === "authenticated" && userAuth?.data?.token) {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      try {
        const response = await fetch(`http://localhost:5000/api/v1/user`, {
          cache: "no-store",
          headers: config.headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user auth");
        }

        const userData = await response.json();
        setUser(userData.data);
      } catch (error) {
        console.error("Error fetching user auth:", error);
      }
    }
  }

  // fetch transaction
  async function fetchTransaction() {
    if (status === "authenticated" && userAuth?.data?.token) {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/transactions_by_user`,
          {
            cache: "no-store",
            headers: config.headers,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const transactionsData = await response.json();
        setTransactions(transactionsData.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  }

  useEffect(() => {
    fetchUserAuth();
    fetchTransaction();
  }, [session]);

  // error message
  const errorMessages = {
    username: "Username is required",
    email: "Email is required",
    gender: "Gender is required",
    phone: "Phone is required",
    address: "Address is required",
  };

  // handle update user
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckAuthValues>();

  useEffect(() => {
    setValue("username", user?.username);
    setValue("email", user?.email);
    setValue("gender", user?.gender);
    setValue("phone", user?.phone);
    setValue("address", user?.address);
    setValue("photo", user?.photo);
  }, [user, setValue]);

  const onSubmit: SubmitHandler<CheckAuthValues> = async (data) => {
    // console.log('data', data);
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    const formData = new FormData();
    formData.append("username", data?.username);
    formData.append("email", data?.email);
    formData.append("gender", data?.gender);
    formData.append("phone", data?.phone.toLocaleString());
    formData.append("address", data?.address);

    try {
      const res = await API.patch(`/user/${user?.id}`, formData, config);
      if (res.status === 200) {
        toast.success("Profile successfully updated!", {
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
        fetchUserAuth();
      }
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Profile failed updated!", {
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

  // handle update photo
  const handleUpdatePhoto = async (event: any) => {
    const selectedFile = event.target.files && event.target.files[0];

    if (selectedFile) {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      const formData = new FormData();
      formData.append("photo", selectedFile);

      try {
        const res = await API.patch(`/user/${user?.id}`, formData, config);
        if (res.status === 200) {
          toast.success("Photo successfully updated!", {
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
          fetchUserAuth();
        }
      } catch (e) {
        console.log("API Error:", e);
        toast.error("Photo failed updated!", {
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
    }
  };

  const onError = () => {
    console.log("Update profile failed");
  };

  return (
    <section className="w-full min-h-screen mt-20 px-28 max-md:px-5">
      <p className="w-full font-bold text-2xl text-[#D2D2D2]">My Profile</p>
      <div className="h-full border-b border-gray-900/10">
        <div className="h-full mt-5 grid grid-cols-2 gap-5 max-md:grid-cols-1 max-sm:grid-cols-1">
          <div className="w-full flex flex-row">
            <div className="w-1/2 flex flex-col mr-5">
              <form encType="multipart/form-data">
                {user &&
                user?.photo && user?.photo !== "http://localhost:5000/uploads/photo/" ? (
                  <Image
                    src={user?.photo}
                    alt="photo-profile"
                    width={300}
                    height={300}
                    // layout="responsive"
                    // objectFit="cover"
                    className="rounded-md shadow-md shadow-gray-700"
                    priority={true}
                  />
                ) : (
                  <Image
                    src={defaultPhoto}
                    alt="photo-profile-default"
                    width={300}
                    height={300}
                    // layout="responsive"
                    // objectFit="cover"
                    className="rounded-md shadow-md shadow-gray-700"
                    priority={true}
                  />
                )}
                <div className="mt-5 relative">
                  <input
                    type="file"
                    id="photo"
                    className="w-full hidden absolute"
                    onChange={handleUpdatePhoto}
                  />
                  <button
                    type="button"
                    className="w-full absolute px-3 py-1.5 rounded-md shadow-sm text-[#D2D2D2] bg-[#CD2E71] hover:opacity-80"
                    onClick={() => {
                      const photo = document.getElementById("photo");
                      if (photo) {
                        photo.click();
                      }
                    }}
                  >
                    Change Photo Profile
                  </button>
                </div>
              </form>
            </div>

            <div className="w-1/2 flex flex-col">
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="col-span-full mb-5 text-start max-md:text-end">
                  <button
                    type="submit"
                    className="w-1/2 max-md:w-full px-2 py-1 rounded-md shadow-sm text-sm text-center text-[#D2D2D2] bg-[#CD2E71] hover:opacity-80"
                  >
                    Update Profile
                  </button>
                </div>

                <div className="col-span-full mb-2">
                  <label
                    htmlFor="username"
                    className="text-base font-bold text-[#CD2E71]"
                  >
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      id="username"
                      autoComplete="off"
                      placeholder="...."
                      className="block w-full bg-transparent rounded-md shadow-sm outline-none border-none text-[#616161] placeholder:text-[#616161] ring-0 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("username", {
                        required: errorMessages.username,
                      })}
                    />
                  </div>
                  {errors.username ? (
                    <p className="text-xs text-red-500">
                      {errors.username.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col-span-full mb-2">
                  <label
                    htmlFor="email"
                    className="text-base font-bold text-[#CD2E71]"
                  >
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      id="email"
                      autoComplete="off"
                      placeholder="...."
                      className="block w-full bg-transparent rounded-md shadow-sm outline-none border-none text-[#616161] placeholder:text-[#616161] ring-0 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("email", { required: errorMessages.email })}
                    />
                  </div>
                  {errors.email ? (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col-span-full mb-2">
                  <label
                    htmlFor="gender"
                    className="text-base font-bold text-[#CD2E71]"
                  >
                    Gender
                  </label>
                  <div className="relative flex items-center">
                    <select
                      id="gender"
                      className="block w-full bg-transparent rounded-md shadow-sm outline-none border-none text-[#616161] placeholder:text-[#616161] ring-0 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("gender")}
                    >
                      <option value="male" className="bg-black">
                        Male
                      </option>
                      <option value="female" className="bg-black">
                        Female
                      </option>
                    </select>
                  </div>
                </div>

                <div className="col-span-full mb-2">
                  <label
                    htmlFor="phone"
                    className="text-base font-bold text-[#CD2E71]"
                  >
                    Phone
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      id="phone"
                      autoComplete="off"
                      placeholder="...."
                      className="block w-full bg-transparent rounded-md shadow-sm outline-none border-none text-[#616161] placeholder:text-[#616161] ring-0 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("phone", {
                        minLength: {
                          value: 11,
                          message: "Minimum 11 characters are required",
                        },
                        maxLength: {
                          value: 12,
                          message: "Maximum 12 characters are allowed",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="col-span-full mb-2">
                  <label
                    htmlFor="address"
                    className="text-base font-bold text-[#CD2E71]"
                  >
                    Address
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      id="address"
                      autoComplete="off"
                      placeholder="...."
                      className="block w-full bg-transparent rounded-md shadow-sm outline-none border-none text-[#616161] placeholder:text-[#616161] ring-0 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("address")}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full max-md:mt-10">
            <p className="w-full mb-5 text-end font-bold text-2xl text-[#D2D2D2]">
              History Transaction
            </p>
            <div className="overflow-y-auto" style={{ height: "70vh" }}>
              {transactions?.map((transaction, i) => {
                return (
                  <div
                    className="mb-5 px-5 py-3 bg-[#6e1d3e] rounded-md"
                    key={i}
                  >
                    <p className="mb-3 text-xl font-bold text-[#D2D2D2]">
                      {transaction?.movie?.title}
                    </p>
                    <p className="text-base font-bold text-[#D2D2D2]">
                      {moment(transaction?.movie?.release_date).format(
                        "DD MMMM YYYY"
                      )}
                    </p>
                    <div className="flex flex-row justify-between items-center">
                      <p className="font-bold text-[#CD2E71]">
                        Total : Rp{" "}
                        {transaction?.movie?.price.toLocaleString("id-ID", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      {transaction?.status === "success" ||
                      transaction?.status === "approved" ? (
                        <p className="px-3 py-2 rounded-md font-bold text-[#D2D2D2] bg-[#00FF47]">
                          {transaction?.status}
                        </p>
                      ) : (
                        ""
                      )}
                      {transaction?.status === "pending" ? (
                        <p className="px-3 py-2 rounded-md font-bold text-[#D2D2D2] bg-[#daac41]">
                          {transaction?.status}
                        </p>
                      ) : (
                        ""
                      )}
                      {transaction?.status === "failed" ||
                      transaction?.status === "rejected" ? (
                        <p className="px-3 py-2 rounded-md font-bold text-[#D2D2D2] bg-[#fc4545]">
                          {transaction?.status}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthUser(ProfileUser);
