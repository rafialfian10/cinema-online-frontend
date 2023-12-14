"use client";

// components next
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// components react
import { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Rating } from "primereact/rating";

// contexts
import { AuthContext } from "@/contexts/authContext";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { MovieValues } from "@/types/movie";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// -----------------------------------------

interface IdParamsProps {
  params: { id: string };
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function DetailMovie({ params }: IdParamsProps) {
  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  // context check auth
  const { userCheckAuth, setUserCheckAuth } = useContext(AuthContext);

  const router = useRouter();

  // state movie
  const [movie, setMovie] = useState<MovieValues | null>(null);

  // state transaction by user login
  const [userTransaction, setUserTransaction] = useState<any[]>([]);

  // state average rating
  const [averageRating, setAverageRating] = useState<number>(0);

  // fetch movie
  async function fetchMovie(id: string) {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/movie/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const movieData = await response.json();
      setMovie(movieData.data);
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  }

  // fetch user transaction by login
  async function fetchUserTransaction() {
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
        throw new Error("Failed to fetch data user transaction");
      }

      const userTransactionData = await response.json();

      const dataTransaction = userTransactionData.data?.map(
        (userTransaction: any) => ({
          movieId: userTransaction?.movie?.id,
          status: userTransaction?.status,
        })
      );

      setUserTransaction(dataTransaction);
    } catch (error) {
      console.error("Error fetching data user transaction:", error);
    }
  }

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
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

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
      const movieAlreadyOwned = userTransaction.some((transaction) => {
        return (
          transaction.movieId === data.movieId &&
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
        const response = await API.post(`/transaction`, formData, config);

        if (response.data.status === 200) {
          (window as any).snap.pay(response.data.data.token, {
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
              fetchUserTransaction();
              window.location.replace(`/`);
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
              router.push(`/pages/users/detail-movie/${params.id}`);
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
              router.push(`/pages/users/detail-movie/${params.id}`);
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
              router.push(`/pages/users/detail-movie/${params.id}`);
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
    fetchMovie(params.id);
    if (status === "authenticated") {
      fetchUserTransaction();
    }
  }, [params.id, status]);

  useEffect(() => {
    if (movie?.rating && Array.isArray(movie.rating)) {
      const totalRating = movie.rating.reduce(
        (acc, curr) => acc + curr.star,
        0
      );
      const averageRating = totalRating / movie.rating.length;
      setAverageRating(averageRating);
    }
  }, [movie]);

  return (
    <section>
      <div className="w-full mt-20 px-4 md:px-10 lg:px-20 pb-10">
        <div className="px-28 max-md:px-0">
          <div className="mb-5 flex justify-between items-center">
            <div className="flex flex-col">
              <p className="mb-2 text-[#D2D2D2] font-extrabold text-3xl max-md:text-2xl max-sm:text-base">
                {movie?.title}
              </p>
              <div className="flex flex-row items-center">
                <Rating
                  value={averageRating}
                  className="text-[#ffe234]"
                  stars={5}
                  cancel={false}
                  readOnly={true}
                />
                {isNaN(averageRating) || averageRating === 0 ? (
                  <p className="ml-3 font-medium text-white">0.0 Rates</p>
                ) : (
                  <p className="ml-3 font-medium text-white">
                    {averageRating.toFixed(1)} Rates
                  </p>
                )}
              </div>
            </div>
            {userCheckAuth?.premi?.status !== true ? (
              <button
                type="button"
                className="w-40 max-md:w-28 max-sm:w-16 p-3 max-md:p-1 text-base max-sm:text-xs bg-[#CD2E71] text-[#D2D2D2] font-bold rounded-md"
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
          {userCheckAuth?.premi?.status !== true ? (
            <div>
              <div className="mb-1 flex justify-between">
                <p className="text-sm max-md:text-xs text-justify text-[#D2D2D2]">
                  Release date :{" "}
                  {moment(movie?.releaseDate).format("DD MMMM YYYY")}
                </p>
                <p className="text-lg max-md:text-xs text-justify text-[#D2D2D2]">
                  Trailer
                </p>
              </div>
              <video
                src={movie?.trailer}
                controls
                className="w-full shadow-md shadow-gray-700"
              />
            </div>
          ) : (
            <div>
              <div className="mb-1 flex justify-between">
                <p className="text-sm max-md:text-xs text-justify text-[#D2D2D2]">
                  Release date :{" "}
                  {moment(movie?.releaseDate).format("DD MMMM YYYY")}
                </p>
                <p className="text-lg max-md:text-xs text-justify text-[#D2D2D2]">
                  Full Movie
                </p>
              </div>
              <video
                src={movie?.fullMovie}
                controls
                className="w-full shadow-md shadow-gray-700"
              />
            </div>
          )}

          <div className="flex flex-row flex-wrap">
            {movie?.category.map((cat: any) => (
              <p
                className="mr-1 mt-3 text-lg font-bold text-[#D2D2D2]"
                key={cat?.id}
              >
                {cat?.name}
              </p>
            ))}
          </div>
          <p className="my-1 text-lg max-md:text-base font-bold text-[#CD2E71]">
            Rp.{" "}
            {movie?.price.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 mb-5 text-base max-md:text-sm text-justify text-[#D2D2D2]">
            {movie?.description}
          </p>
        </div>
      </div>
    </section>
  );
}
