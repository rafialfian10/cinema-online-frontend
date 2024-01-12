"use client";

// components next
import { useSession } from "next-auth/react";

// component react
import { Menu } from "@headlessui/react";

// components redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteMovie } from "@/redux/features/movieSlice";

// types
import { UserAuth } from "@/types/userAuth";

// alert
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// css
import styles from "./button-delete-movie.module.css";
// ---------------------------------------------

interface MovieIdProps {
  movieId: number;
  fetchMovies: () => void;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ButtonDeleteMovie({
  movieId,
  fetchMovies,
}: MovieIdProps) {
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;

  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  // handle delete movie
  const handleDeleteMovie = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3E3E3E",
        cancelButtonColor: "#CD2E71",
        confirmButtonText: "Yes!",
        customClass: {
          popup: styles["swal2-popup"],
          title: styles["swal2-title"],
          icon: styles["swal2-icon"],
          confirmButton: styles["swal2-confirm"],
          cancelButton: styles["swal2-cancel"],
        },
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          const response = await dispatch(deleteMovie({ id, session }));
          if (response.payload && response.payload.status === 200) {
            toast.success("Movie successfully deleted!", {
              position: "top-right",
              autoClose: 3500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              style: { marginTop: "65px" },
            });
            fetchMovies();
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Movie failed to delete!", {
        position: "top-right",
        autoClose: 5000,
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
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          className={classNames(
            active
              ? "text-[#D2D2D2] bg-[#0D0D0D] hover:bg-[#212121]"
              : "text-[#D2D2D2]",
            "w-full text-left block px-4 py-2 text-sm"
          )}
          onClick={() => handleDeleteMovie(movieId)}
        >
          Delete Movie
        </button>
      )}
    </Menu.Item>
  );
}
