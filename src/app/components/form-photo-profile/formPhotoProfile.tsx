"use client";

// components next
import Image from "next/image";

// components react
import { useState, useEffect, Suspense } from "react";

// component
import { getUser } from "@/libs/user";

// api
import { API } from "@/app/api/api";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// image
import defaultPhoto from "@/assets/img/default-photo.png";
// ---------------------------------------------------------------

interface FormPhotoProfileProps {
  user: any;
}

export default function FormPhotoProfile({ user }: FormPhotoProfileProps) {
  // handle update photo
  const handleUpdatePhoto = async (event: any) => {
    const selectedFile = event.target.files && event.target.files[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      try {
        const res = await API.patch(`/user/${user?.id}`, formData);
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
          // fetchUser();
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

  return (
    <form encType="multipart/form-data">
      {user && user?.photo !== "http://localhost:5000/uploads/photo/" ? (
        <Suspense
          fallback={
            <div className="text-white text-2xl bg-red-800">Loading image</div>
          }
        >
          <Image
            src={user?.photo}
            alt="photo-profile"
            layout="responsive"
            width={300}
            height={300}
            className="rounded-md shadow-md shadow-gray-700"
          />
        </Suspense>
      ) : (
        <Image
          src={defaultPhoto}
          alt="photo-profile"
          layout="responsive"
          width={300}
          height={300}
          className="rounded-md shadow-md shadow-gray-700"
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
  );
}
