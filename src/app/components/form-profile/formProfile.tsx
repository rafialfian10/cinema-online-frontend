"use client";

// components react
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// api
import { API } from "@/app/api/api";

// types
import { ProfileValues } from "@/types/profile";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//--------------------------------------------------------

interface FormProfileProps {
  user: any;
}

export default function FormProfile({ user }: FormProfileProps) {
  // error
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
  } = useForm<ProfileValues>();

  useEffect(() => {
    setValue("username", user?.username);
    setValue("email", user?.email);
    setValue("gender", user?.gender);
    setValue("phone", user?.phone);
    setValue("address", user?.address);
    setValue("photo", user?.photo);
  }, [user, setValue]);

  const onSubmit: SubmitHandler<ProfileValues> = async (data) => {
    // console.log('data', data);
    const formData = new FormData();
    formData.append("username", data?.username);
    formData.append("email", data?.email);
    formData.append("gender", data?.gender);
    formData.append("phone", data?.phone.toLocaleString());
    formData.append("address", data?.address);

    try {
      const res = await API.patch(`/user/${user?.id}`, formData);
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

  const onError = () => {
    console.log("Update profile failed");
  };

  return (
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
            {...register("username", { required: errorMessages.username })}
          />
        </div>
        {errors.username ? (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        ) : (
          ""
        )}
      </div>

      <div className="col-span-full mb-2">
        <label htmlFor="email" className="text-base font-bold text-[#CD2E71]">
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
          <p className="text-xs text-red-500">{errors.email.message}</p>
        ) : (
          ""
        )}
      </div>

      <div className="col-span-full mb-2">
        <label htmlFor="gender" className="text-base font-bold text-[#CD2E71]">
          Gender
        </label>
        <div className="relative flex items-center">
          <select
            id="gender"
            className="block w-full bg-transparent rounded-md shadow-sm outline-none border-none text-[#616161] placeholder:text-[#616161] ring-0 focus:ring-0 sm:text-sm sm:leading-6"
            {...register("gender")}
          >
            <option value="pria" className="bg-black">
              Pria
            </option>
            <option value="wanita" className="bg-black">
              Wanita
            </option>
          </select>
        </div>
      </div>

      <div className="col-span-full mb-2">
        <label htmlFor="phone" className="text-base font-bold text-[#CD2E71]">
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
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="col-span-full mb-2">
        <label htmlFor="address" className="text-base font-bold text-[#CD2E71]">
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
  );
}
