/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// components next
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// components react
import { useState, useEffect, useContext, useCallback } from "react";

// components redux
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { createTransaction, fetchTransactionByUser } from "@/redux/features/transactionSlice";

// contexts
import { AuthContext } from "@/contexts/authContext";

// types
import { UserAuth } from "@/types/userAuth";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper/modules";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// style swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// -------------------------------------------------

interface MoviesProps {
  movies: any[];
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function Swipers({ movies }: MoviesProps) {
  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  // context check auth
  const { userCheckAuth, setUserCheckAuth } = useContext(AuthContext);

  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  const transactions = useAppSelector(
    (state: RootState) => state.transactionSlice.transactions
  );

  useEffect(() => {
    if (status === "authenticated" && userAuth?.data?.token) {
      dispatch(fetchTransactionByUser({ session, status }));
    }
  }, []);
  
  const router = useRouter();

  // state width window
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // handle resize window
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  // function show login
  const showLogin = () => {
    let token = localStorage.getItem("token");
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

  // handle buy movie
  const handleBuy = async (movie: any, e: any) => {
    e.preventDefault();
    try {
      const data: any = {
        movieId: movie?.id,
        buyerId: userCheckAuth?.id,
        price: movie?.price,
      };

      const formData = new FormData();
      formData.append("movie_id", data.movieId);
      formData.append("buyer_id", data.buyerId);
      formData.append("price", data.price);

      // Check if the movieId already exists in userTransaction
      const movieAlreadyOwned = transactions.some((transaction) => {
        return (
          transaction.movie_id === data.movieId &&
          (transaction.status === "success" ||
            transaction.status === "approved")
        );
      });

      if (movieAlreadyOwned) {
        toast.error("You already have this movie!", {
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

      if (userAuth?.data?.role === "admin") {
        toast.error("Admin is not allowed to make transactions!", {
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
        router.push("/pages/admin/list-movie");
        return;
      } else {
        const response = await dispatch(
          createTransaction({ formData, session })
        );
          
        if (response.payload && response.payload.status === 200) {
          (window as any).snap.pay(response.payload.data.token, {
            onSuccess: function (result: any) {
              toast.success(
                "Thank you for buying this film, please wait 1x24 hours because your transaction is in process",
                {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  style: { marginTop: "65px" },
                }
              );
              dispatch(fetchTransactionByUser({ session, status }))
              window.location.replace(
                `/pages/users/profile-user/${userCheckAuth?.id}`
              );
            },
            onPending: function (result: any) {
              toast.warning("please make payment first", {
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
            },
            onError: function (result: any) {
              toast.error("cancel transaction successfully", {
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
            },
            onClose: function () {
              toast.error("cancel transaction successfully", {
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
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = process.env
      .MIDTRANS_CLIENT_KEY_TRANSACTION_MOVIE as string;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full mx-auto mt-20 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={30}
        centeredSlides={true}
        navigation
        className="max-sm:w-full"
        style={{ maxWidth: "90vw" }}
      >
        {movies?.map((movie: any) => {
          return (
            <SwiperSlide
              key={movie?.id}
              className="px-16 pt-5 pb-10 max-md:px-10 max-sm:p-0 w-full h-full"
            >
              <div className="w-full relative rounded-lg">
                <Image
                  src={movie?.thumbnail}
                  alt={movie?.title}
                  width={500}
                  height={0}
                  className="w-full h-full object-cover overflow-hidden rounded-lg shadow-md shadow-gray-700"
                  priority={true}
                />
                <div className="w-2/3 max-md:w-full top-12 max-md:top-3 px-10 max-md:px-5 max-sm:px-10 absolute flex flex-col">
                  <p className="mb-3 max-md:mb-1 max-sm:mb-0 text-4xl max-md:text-2xl max-sm:text-lg font-extrabold text-[#A52620]">
                    {movie?.title}
                  </p>
                  <div className="flex flex-wrap">
                    {movie?.category.map((category: any) => {
                      return (
                        <p
                          key={category?.id}
                          className="text-lg max-md:text-base max-sm:text-xs mr-2 font-bold text-[#D2D2D2]"
                        >
                          {category?.name},
                        </p>
                      );
                    })}
                  </div>
                  <p className="mb-3 max-md:mb-2 text-lg max-md:text-base max-sm:text-xs font-bold text-[#CD2E71]">
                    Rp.{" "}
                    {movie?.price.toLocaleString("id-ID", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  {windowWidth > 768 ? (
                    <p className="mb-3 max-md:mb-1 text-base max-md:text-sm max-sm:text-xs text-[#D2D2D2]">
                      {movie?.description}
                    </p>
                  ) : windowWidth > 640 ? (
                    <p className=" mb-3 max-md:mb-1 text-base max-md:text-sm max-sm:text-xs text-[#D2D2D2]">
                      {movie?.description.length > 100
                        ? `${movie?.description.slice(0, 100)}...`
                        : movie?.description}
                    </p>
                  ) : (
                    ""
                  )}
                  {userCheckAuth?.premi?.status !== true ? (
                    <button
                      type="button"
                      className="w-40 max-md:w-28 p-3 max-md:p-1 text-sm max-md:text-base max-sm:text-xs bg-[#CD2E71] text-[#D2D2D2] font-bold rounded-md"
                      onClick={(e) => {
                        handleBuy(movie, e);
                        showLogin();
                      }}
                    >
                      Buy Now
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
