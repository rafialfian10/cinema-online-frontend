/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// components next
import Image from "next/image";
import { useSession } from "next-auth/react";

// components react
import { useState, useEffect } from "react";

// components redux
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";

// components
import ModalWatchMovie from "../../../components/modal-watch-movie/modalWatchMovie";
import AuthUser from "@/app/components/auth-user/authUser";

// types
import { UserAuth } from "@/types/userAuth";
import { fetchTransactionByUser } from "@/redux/features/transactionSlice";
import Loading from "@/app/loading";
// ---------------------------------------------

function MyListMovie() {
  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  const transactions = useAppSelector(
    (state: RootState) => state.transactionSlice.transactions
  );
  const loading = useAppSelector(
    (state: RootState) => state.transactionSlice.loading
  );

  useEffect(() => {
    if (status === "authenticated" && userAuth?.data?.token) {
      dispatch(fetchTransactionByUser({ session, status }));
    }
  }, []);

    // data movie
    const [dataMovie, setDataMovie] = useState<any>();

    // state modal watch movie
    const [modalWatchMovie, setModalWatchMovie] = useState(false);

  function closeModalWatchMovie() {
    setModalWatchMovie(false);
  }

  return (
    <section className="w-full min-h-screen mt-20 mb-20 md:mb-10 lg:mb-0">
      <ModalWatchMovie
        modalWatchMovie={modalWatchMovie}
        closeModalWatchMovie={closeModalWatchMovie}
        dataMovie={dataMovie}
        fetchTransaction={() =>
          dispatch(fetchTransactionByUser({ session, status }))
        }
      />
      <section className="w-full px-4 md:px-10 lg:px-20">
        <p className="w-full mb-5 font-bold text-2xl text-[#D2D2D2]">
          My List Movie
        </p>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {transactions?.map((transaction, i) => {
              {
                if (transaction?.status === "approved") {
                  return (
                    <div
                      key={i}
                      className="rounded-md overflow-hidden shadow-md shadow-gray-700"
                    >
                      <div className="w-full h-48">
                        <Image
                          src={transaction?.movie?.thumbnail}
                          alt={transaction?.movie?.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <p className="mb-2 text-xl font-bold tracking-tight text-[#D2D2D2] dark:text-[#D2D2D2]">
                          {transaction?.movie?.title}
                        </p>
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium bg-[#3E3E3E] text-center text-[#D2D2D2] rounded-md hover:opacity-80"
                          onClick={() => {
                            setModalWatchMovie(true);
                            setDataMovie(transaction?.movie);
                          }}
                        >
                          Watch movie
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                              fillRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                }
              }
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export default AuthUser(MyListMovie);
