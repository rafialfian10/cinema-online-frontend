/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// components next
import Image from "next/image";
import { useSession } from "next-auth/react";

// components react
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// components
import AuthAdmin from "@/app/components/auth-admin/authAdmin";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { AddMovieValues } from "@/types/addMovie";

// alert
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// styles
import styles from "./update-movie.module.css";
//--------------------------------------------------------------------

export interface UpdateMovieProps {
  modalUpdateMovie: boolean;
  setModalUpdateMovie: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalUpdateMovie: () => void;
  dataMovie: any;
  fetchMovies: () => void;
}

function UpdateMovie({
  modalUpdateMovie,
  setModalUpdateMovie,
  closeModalUpdateMovie,
  dataMovie,
  fetchMovies,
}: UpdateMovieProps) {
  // session
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;

  // state categories
  const [categories, setCategories] = useState<any[]>([]);

  // fetch categories
  async function fetchCategories() {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    if (modalUpdateMovie) {
      fetchMovies();
      fetchCategories();
    }
  }, [modalUpdateMovie, dataMovie]);

  // error message
  const errorMessages = {
    title: "Title is required",
    releaseDate: "Release date is required",
    category: "Category is required",
    price: "Price is required",
    link: "Link is required",
    description: "Description is required",
    thumbnail: "Thumbnail is required",
    trailer: "Trailer is required",
    fullMovie: "Full movie is required",
  };

  // handle update movie
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddMovieValues>({
    defaultValues: {
      category: dataMovie?.category.map((category: any) => category.id) || [],
    },
  });

  useEffect(() => {
    if (dataMovie) {
      setValue("title", dataMovie?.title);
      if (dataMovie?.release_date) {
        const date = new Date(dataMovie?.release_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        setValue("releaseDate", formattedDate);
      }
      // setValue('category', dataMovie?.category);
      setValue("price", dataMovie?.price);
      setValue("link", dataMovie?.link);
      setValue("description", dataMovie?.description);
      setValue("thumbnail", dataMovie?.thumbnail);
      setValue("trailer", dataMovie?.trailer);
      setValue("fullMovie", dataMovie?.full_movie);
      setValue("selectAll", false);
    }
  }, [dataMovie, setValue]);

  const onSubmit: SubmitHandler<AddMovieValues> = async (data) => {
    // console.log('data', data);
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + user?.data?.token,
      },
    };

    const formData = new FormData();
    formData.append("title", data?.title);
    formData.append("release_date", data?.releaseDate);
    const categoryId = data?.category.map(Number);
    formData.append("category_id", JSON.stringify(categoryId));
    formData.append("price", data.price.toString());
    formData.append("link", data.link);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail[0]);
    formData.append("trailer", data.trailer[0]);
    formData.append("full_movie", data.fullMovie[0]);

    try {
      const res = await API.patch(`/movie/${dataMovie?.id}`, formData, config);
      if (res.status === 200) {
        toast.success("Movie successfully updated!", {
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
        setModalUpdateMovie(false);
        fetchMovies();
        reset();
      }
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Movie failed updated!", {
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
    console.log("Add Movie failed");
  };

  // handle delete thumbnail
  const handleDeleteThumbnail = async (e: any) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
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
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + user?.data?.token,
            },
          };
          const res = await API.delete(
            `/movie/${dataMovie?.id}/thumbnail`,
            config
          );
          if (res.status === 200) {
            toast.success("Thumbnail successfully deleted!", {
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
            setModalUpdateMovie(false);
            fetchMovies();
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Thumbnail failed to delete!", {
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

  // handle delete trailer
  const handleDeleteTrailer = async (e: any) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
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
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + user?.data?.token,
            },
          };
          const res = await API.delete(
            `/movie/${dataMovie?.id}/trailer`,
            config
          );
          if (res.status === 200) {
            toast.success("Trailer successfully deleted!", {
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
            setModalUpdateMovie(false);
            fetchMovies();
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Trailer failed to delete!", {
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

  // handle delete full movie
  const handleDeleteFullMovie = async (e: any) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
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
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + user?.data?.token,
            },
          };
          const res = await API.delete(
            `/movie/${dataMovie?.id}/full_movie`,
            config
          );
          if (res.status === 200) {
            toast.success("Full movie successfully deleted!", {
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
            setModalUpdateMovie(false);
            fetchMovies();
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Full movie failed to delete!", {
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
      <Transition appear show={modalUpdateMovie} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModalUpdateMovie}
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
                <Dialog.Panel className="w-full max-w-md md:max-w-4xl transform overflow-hidden rounded-2xl bg-[#0D0D0D] p-6 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    encType="multipart/form-data"
                  >
                    <p className="w-full font-bold text-2xl text-[#D2D2D2]">
                      Update Movie
                    </p>
                    <div className="border-b border-gray-900/10 pb-8">
                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="title"
                            className="text-base text-[#D2D2D2]"
                          >
                            Title
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              id="title"
                              autoComplete="off"
                              className="block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6"
                              {...register("title", {
                                required: errorMessages.title,
                              })}
                            />
                          </div>
                          {errors.title ? (
                            <p className="mt-1 text-red-500">
                              {errors.title.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="release_date"
                            className="text-base text-[#D2D2D2]"
                          >
                            Release Date
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="date"
                              id="release_date"
                              autoComplete="off"
                              className="block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6"
                              {...register("releaseDate", {
                                required: errorMessages.releaseDate,
                              })}
                            />
                          </div>
                          {errors.releaseDate ? (
                            <p className="mt-1 text-red-500">
                              {errors.releaseDate.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="category"
                            className="text-base text-[#D2D2D2]"
                          >
                            Category
                          </label>
                          <div className="relative mt-2 flex items-start">
                            <div className="mr-5 flex flex-col flex-wrap h-28">
                              {categories?.map((category) => {
                                const isChecked = dataMovie?.category.some(
                                  (idCategory: { id: number }) =>
                                    idCategory.id == category.id
                                );
                                return (
                                  <div
                                    className="flex items-center mb-3"
                                    key={category.id}
                                  >
                                    <input
                                      type="checkbox"
                                      id={category.name}
                                      className="w-5 h-5 bg-[#535252] text-[#CD2E71] focus:ring-[#CD2E71] rounded"
                                      value={category.id}
                                      defaultChecked={isChecked}
                                      {...register("category", {
                                        required: {
                                          value: true,
                                          message: errorMessages.category,
                                        },
                                      })}
                                    />
                                    <label
                                      htmlFor={category.name}
                                      className="ml-2 mr-5 text-[#D2D2D2]"
                                    >
                                      {category.name}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {errors.category ? (
                            <p className="text-red-500">
                              {errors.category.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="price"
                            className="text-base text-[#D2D2D2]"
                          >
                            Price
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              id="price"
                              autoComplete="off"
                              className="block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6"
                              {...register("price", {
                                required: errorMessages.price,
                                validate: (value) => {
                                  if (isNaN(value)) {
                                    return "Price must be a valid number";
                                  }
                                  if (value < 1) {
                                    return "Price must be greater than 1";
                                  }
                                  return true;
                                },
                              })}
                            />
                          </div>
                          {errors.price ? (
                            <p className="mt-1 text-red-500">
                              {errors.price.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="link"
                            className="text-base text-[#D2D2D2]"
                          >
                            Link
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              id="link"
                              autoComplete="off"
                              className="block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6"
                              {...register("link", {
                                required: errorMessages.link,
                              })}
                            />
                          </div>
                          {errors.link ? (
                            <p className="mt-1 text-red-500">
                              {errors.link.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="description"
                            className="text-base text-[#D2D2D2]"
                          >
                            Description
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <textarea
                              id="description"
                              rows={3}
                              className="block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6"
                              defaultValue={""}
                              {...register("description", {
                                required: errorMessages.description,
                              })}
                            />
                          </div>
                          {errors.description ? (
                            <p className="mt-1 text-red-500">
                              {errors.description.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>

                        {dataMovie?.thumbnail &&
                        dataMovie?.thumbnail !==
                          "http://localhost:5000/uploads/thumbnail/" ? (
                          <div className="col-span-full">
                            <label
                              htmlFor="thumbnail"
                              className="text-base text-[#D2D2D2]"
                            >
                              Thumbnail
                            </label>
                            <div className="relative mt-2 flex justify-start items-end max-md:flex-col max-md:items-start">
                              <Image
                                src={dataMovie?.thumbnail}
                                alt={dataMovie?.title}
                                width={300}
                                height={300}
                                className="w-1/2 max-md:w-full mb-2 rounded-md shadow-md shadow-gray-700"
                              />
                              <button
                                type="button"
                                className="w-30 ml-5 max-md:ml-0 flex justify-center items-center rounded-lg text-[#D2D2D2] bg-[#3E3E3E] hover:opacity-80 px-2 py-1"
                                onClick={handleDeleteThumbnail}
                              >
                                <span className="w-5 h-5 mr-1 flex justify-center items-center text-[#D2D2D2] font-bold bg-red-500 rounded-full shadow-lg p-2">
                                  X
                                </span>{" "}
                                Delete Thumbnail
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-span-full">
                            <label
                              htmlFor="thumbnail"
                              className="text-base text-[#D2D2D2]"
                            >
                              Thumbnail
                            </label>
                            <div className="relative mt-2 items-center">
                              <input
                                type="file"
                                id="thumbnail"
                                className="w-full m-0 bg-[#535252] flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:text-[#D2D2D2] dark:file:bg-[#0D0D0D] dark:file:text-[#D2D2D2] ring-2 ring-inset ring-[#D2D2D2]"
                                {...register("thumbnail", {
                                  required: errorMessages.thumbnail,
                                })}
                                accept=".jpg,.jpeg,.png,.svg"
                              />
                              {errors.thumbnail ? (
                                <p className="mt-1 text-red-500">
                                  {errors.thumbnail.message}
                                </p>
                              ) : (
                                ""
                              )}
                              <p
                                className="mt-1 text-sm text-[#D2D2D2] dark:text-[#D2D2D2]"
                                id="file_input_help"
                              >
                                SVG, PNG, JPG, JPEG.
                              </p>
                            </div>
                          </div>
                        )}

                        {dataMovie?.trailer &&
                        dataMovie?.trailer !==
                          "http://localhost:5000/uploads/trailer/" ? (
                          <div className="col-span-full">
                            <label
                              htmlFor="trailer"
                              className="text-base text-[#D2D2D2]"
                            >
                              Trailer
                            </label>
                            <div className="relative mt-2 flex justify-start items-end max-md:flex-col max-md:items-start">
                              <video
                                src={dataMovie?.trailer}
                                controls
                                className="w-1/2 max-md:w-full mb-2 rounded-md shadow-md shadow-gray-700"
                              />
                              <button
                                type="button"
                                className="w-30 ml-5 max-md:ml-0 flex justify-center items-center rounded-lg text-[#D2D2D2] bg-[#3E3E3E] hover:opacity-80 px-2 py-1"
                                onClick={handleDeleteTrailer}
                              >
                                <span className="w-5 h-5 mr-1 flex justify-center items-center text-[#D2D2D2] font-bold bg-red-500 rounded-full shadow-lg p-2">
                                  X
                                </span>{" "}
                                Delete Trailer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-span-full">
                            <label
                              htmlFor="trailer"
                              className="text-base text-[#D2D2D2]"
                            >
                              Trailer
                            </label>
                            <div className="relative mt-2 items-center">
                              <input
                                type="file"
                                id="trailer"
                                className="w-full m-0 bg-[#535252] flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:text-[#D2D2D2] dark:file:bg-[#0D0D0D] dark:file:text-[#D2D2D2] ring-2 ring-inset ring-[#D2D2D2]"
                                {...register("trailer", {
                                  required: errorMessages.trailer,
                                })}
                                accept=".mp4,.mkv,.avi,.wmp"
                              />
                              {errors.trailer ? (
                                <p className="mt-1 text-red-500">
                                  {errors.trailer.message}
                                </p>
                              ) : (
                                ""
                              )}
                              <p
                                className="mt-1 text-sm text-[#D2D2D2] dark:text-[#D2D2D2]"
                                id="file_input_help"
                              >
                                MP4, MKV, AVI, WMP.
                              </p>
                            </div>
                          </div>
                        )}

                        {dataMovie?.full_movie &&
                        dataMovie?.full_movie !==
                          "http://localhost:5000/uploads/full_movie/" ? (
                          <div className="col-span-full">
                            <label
                              htmlFor="full-movie"
                              className="text-base text-[#D2D2D2]"
                            >
                              Full Movie
                            </label>
                            <div className="relative mt-2 flex justify-start items-end max-md:flex-col max-md:items-start">
                              <video
                                src={dataMovie?.full_movie}
                                controls
                                className="w-1/2 max-md:w-full mb-2 rounded-md shadow-md shadow-gray-700"
                              />
                              <button
                                type="button"
                                className="w-30 ml-5 max-md:ml-0 flex justify-center items-center rounded-lg text-[#D2D2D2] bg-[#3E3E3E] hover:opacity-80 px-2 py-1"
                                onClick={handleDeleteFullMovie}
                              >
                                <span className="w-5 h-5 mr-1 flex justify-center items-center text-[#D2D2D2] font-bold bg-red-500 rounded-full shadow-lg p-2">
                                  X
                                </span>{" "}
                                Delete Full Movie
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="col-span-full">
                            <label
                              htmlFor="full-movie"
                              className="text-base text-[#D2D2D2]"
                            >
                              Full Movie
                            </label>
                            <div className="relative mt-2 items-center">
                              <input
                                type="file"
                                id="full-movie"
                                className="w-full m-0 bg-[#535252] flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:text-[#D2D2D2] dark:file:bg-[#0D0D0D] dark:file:text-[#D2D2D2] ring-2 ring-inset ring-[#D2D2D2]"
                                {...register("fullMovie", {
                                  required: errorMessages.fullMovie,
                                })}
                                accept=".mp4,.mkv,.avi,.wmp"
                              />
                              {errors.fullMovie ? (
                                <p className="mt-1 text-red-500">
                                  {errors.fullMovie.message}
                                </p>
                              ) : (
                                ""
                              )}
                              <p
                                className="mt-1 text-sm text-[#D2D2D2] dark:text-[#D2D2D2]"
                                id="file_input_help"
                              >
                                MP4, MKV, AVI, WMP.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="submit"
                        className="w-200 px-3 py-1.5 rounded-md shadow-sm bg-[#CD2E71] hover:opacity-80 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Update Movie
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}

export default AuthAdmin(UpdateMovie);

async function getAllCategories() {
  const response = await fetch("http://localhost:5000/api/v1/categories", {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return await response.json();
}
