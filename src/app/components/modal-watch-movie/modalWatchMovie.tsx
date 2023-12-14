"use client";

// components react
import { useState, useEffect, useContext, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";

// components
import ModalRating from "../modal-rating/modalRating";

// types
import { AuthContext } from "@/contexts/authContext";
// -----------------------------------------------

export interface ModalWatchMovieProps {
  modalWatchMovie: boolean;
  closeModalWatchMovie: () => void;
  dataMovie: any;
  fetchTransaction: () => void;
}

export default function ModalWatchMovie({
  modalWatchMovie,
  closeModalWatchMovie,
  dataMovie,
  fetchTransaction,
}: ModalWatchMovieProps) {
  // context check auth
  const { userCheckAuth, setUserCheckAuth } = useContext(AuthContext);

  // state user id
  const [usersId, setUsersId] = useState<number[]>([]);

  // state modal rating
  const [modalRating, setModalRating] = useState(false);

  function closeModalRating() {
    setModalRating(false);
  }

  useEffect(() => {
    if (dataMovie?.rating) {
      const usersId = dataMovie?.rating.map(
        (data: { user_id: number }) => data.user_id
      );
      setUsersId(usersId);
    }
  }, [dataMovie]);

  const userRated = usersId.includes(userCheckAuth?.id);

  return (
    <section>
      <ModalRating
        modalRating={modalRating}
        closeModalRating={closeModalRating}
        dataMovie={dataMovie}
        fetchTransaction={fetchTransaction}
      />
      <Transition appear show={modalWatchMovie} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModalWatchMovie}
        >
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
                <Dialog.Panel className="w-full max-w-md md:max-w-6xl transform overflow-hidden rounded-2xl bg-[#0D0D0D] p-6 text-left align-middle shadow-xl transition-all">
                  <div className="w-full mt-20 px-15 pb-10 max-md:px-10 max-sm:px-5">
                    <div className="px-28 max-md:px-0">
                      <div className="mb-5 flex justify-between items-center">
                        <p className="text-[#D2D2D2] font-extrabold text-3xl max-md:text-2xl max-sm:text-base">
                          {dataMovie?.title}
                        </p>
                        {!userRated ? (
                          <button
                            type="button"
                            className="w-40 max-md:w-28 max-sm:w-16 p-3 max-md:p-1 text-base max-sm:text-xs bg-[#CD2E71] text-[#D2D2D2] font-bold rounded-md"
                            onClick={() => {
                              setModalRating(true);
                            }}
                          >
                            Rating
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                      <p className="mb-1 text-sm max-md:text-xs text-justify text-[#D2D2D2]">
                        Release date :{" "}
                        {moment(dataMovie?.release_date).format("DD MMMM YYYY")}
                      </p>
                      <video
                        src={dataMovie?.full_movie}
                        controls
                        className="w-full shadow-md shadow-gray-700"
                      />
                      {/* <div className='flex flex-row flex-wrap'>
                              {dataMovie?.category.map((cat: any, i: number) => (
                                  <p className='mr-1 mt-3 text-lg font-bold text-[#D2D2D2]' key={i}>{cat?.name}</p>
                              ))}
                            </div> */}
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
