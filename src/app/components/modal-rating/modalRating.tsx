"use client";

// components next
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// components react
import { useState, useContext, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Rating } from "primereact/rating";

// contexts
import { AuthContext } from "@/contexts/authContext";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ---------------------------------------------------

export interface ModalRatingProps {
  modalRating: boolean;
  closeModalRating: () => void;
  dataMovie: any;
  fetchTransaction: () => void;
}

export default function ModalRating({
  modalRating,
  closeModalRating,
  dataMovie,
  fetchTransaction,
}: ModalRatingProps) {
  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  // context check auth
  const { userCheckAuth, setUserCheckAuth } = useContext(AuthContext);

  const router = useRouter();

  // state rating
  const [rating, setRating] = useState<number>(0);

  // function show login
  const showLogin = () => {
    if (!userAuth?.data?.token) {
      toast.error("Please login first!", {
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
      router.push("/");
    }
  };

  const handleRating = async (e: any) => {
    e?.preventDefault();

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    const formData = new FormData();
    formData.append("star", String(rating));
    formData.append("movie_id", dataMovie?.id);
    formData.append("user_id", String(userCheckAuth?.id));

    try {
      const res = await API.post("/rating", formData, config);
      if (res.status === 200) {
        toast.success("Thank you for giving a rating!", {
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
        router.push("/pages/users/my-list-movie");
        fetchTransaction();
        closeModalRating();
      }
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Rating failed added!", {
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

  return (
    <section>
      <Transition appear show={modalRating} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalRating}>
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
                <Dialog.Panel className="w-full max-w-md md:max-w-2xl transform overflow-hidden rounded-2xl bg-[#0D0D0D] p-6 text-left align-middle shadow-xl transition-all">
                  <div className="w-full mt-20 px-15 pb-10 max-md:px-10 max-sm:px-5">
                    <div className="px-28 max-md:px-0">
                      <form>
                        <p className="mb-5 text-center font-extrabold text-[#D2D2D2] text-3xl max-md:text-2xl max-sm:text-base">
                          {dataMovie?.title}
                        </p>
                        <div className="mb-5 flex justify-center items-center">
                          <Rating
                            value={rating}
                            onChange={(e) => setRating(e.value ?? 0)}
                            className="text-[#ffe234]"
                            stars={5}
                            cancel={false}
                          />
                        </div>
                        {status !== "unauthenticated" ? (
                          <div className="flex justify-center">
                            <button
                              type="submit"
                              className="w-40 max-md:w-28 max-sm:w-22 p-3 max-md:p-1 text-base max-sm:text-xs bg-[#CD2E71] text-[#D2D2D2] font-bold rounded-md"
                              onClick={(e) => {
                                handleRating(e);
                                showLogin();
                              }}
                            >
                              Give Rating
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
