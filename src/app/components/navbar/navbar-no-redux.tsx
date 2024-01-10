/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// components next
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

// componets react
import { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

// api
import { API } from "@/app/api/api";

// components
import Register from "../register/registerForm";
import Login from "../login/loginForm";
import SearchHome from "../search-home/searchHome";
import ButtonPremium from "../button-premium/buttonPremium";
import ModalPremium from "../modal-premium/modalPremium";

// types
import { UserAuth } from "@/types/userAuth";

// alert
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// image
import icon from "@/assets/img/icon.png";
import defaultPhoto from "@/assets/img/user.png";
import listFilm from "@/assets/img/list-film.png";
import logout from "@/assets/img/logout.png";

// css
import "./navbar.module.css";
//---------------------------------------------------------------------

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  const router = useRouter();

  // state user
  const [user, setUser] = useState<any>();
  
  // state movies
  const [movies, setMovies] = useState<any[]>([]);

  // State search
  const [search, setSearch] = useState("");

  // state date
  const [date, setDate] = useState("");

  // state movie found
  const [moviesFound, setMoviesFound] = useState(true);

  // state register
  let [modalRegister, setModalRegister] = useState(false);

  // state login
  let [modalLogin, setModalLogin] = useState(false);

  // state premium
  let [modalPremium, setModalPremium] = useState(false);

  function openModalRegister() {
    setModalRegister(true);
  }

  function closeModalRegister() {
    setModalRegister(false);
  }

  function openModalLogin() {
    setModalLogin(true);
  }

  function closeModalLogin() {
    setModalLogin(false);
  }

  function openModalPremium() {
    setModalPremium(true);
  }

  function closeModalPremium() {
    setModalPremium(false);
  }

  // fetch user
  async function fetchUser() {
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

  // fetch data movies
  async function fetchMovies() {
    try {
      const moviesData = await getAllMovies();
      setMovies(moviesData.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchMovies();
  }, [session]);

  // handle search
  const handleSearchMovie = (event: any) => {
    setSearch(event.target.value);
    setMoviesFound(true);
  };

  // Filtered movie
  const filteredMovies = movies?.filter((movie: any) =>
    movie?.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (filteredMovies?.length === 0 && search !== "") {
      setMoviesFound(false);
    } else {
      setMoviesFound(true);
    }
  }, [filteredMovies, search]);

  // handle logout
  const handleLogout = async (e: any) => {
    e.preventDefault();
    Swal.fire({
      title: '<span style="color: white;">Logout</span>',
      html: '<span style="color: white;">Are you sure you want to log out?</span>',
      icon: "question",
      background: "#0D0D0D",
      showCancelButton: true,
      customClass: {
        confirmButton: "swal-button-width",
        cancelButton: "swal-button-width",
      },
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#0D0D0D",
      cancelButtonColor: "#CD2E71",
    }).then((result) => {
      if (result.isConfirmed) {
        // window.location.replace('/');
        toast.success("Logout Successfully!", {
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
        signOut();
      } else {
        Swal.close();
      }
    });
  };

  // function date
  const activatedDate = Date.parse(user?.premi?.activated_at || null);
  const expiredDate = Date.parse(user?.premi?.expired_at || null);

  useEffect(() => {
    if (!isNaN(activatedDate) && !isNaN(expiredDate)) {
      const millisecondsInSecond: number = 1000;
      const millisecondsInMinute: number = millisecondsInSecond * 60;
      const millisecondsInHour: number = millisecondsInMinute * 60;
      const millisecondsInDay: number = millisecondsInHour * 24;
      const millisecondsInMonth: number = millisecondsInDay * 30;
      const millisecondsInYear: number = millisecondsInDay * 365;

      const calculateTimeRemaining = async () => {
        const now: number = Date.now();
        const timeRemaining: number = expiredDate - now;

        if (timeRemaining <= 0) {
          clearInterval(interval);
          const res = await API.patch(`/premi_expired/${user?.premi?.id}`);
          if (res.status === 200) {
            fetchUser();
          }
        } else {
          const years: number = Math.floor(timeRemaining / millisecondsInYear);
          const months: number = Math.floor((timeRemaining % millisecondsInYear) / millisecondsInMonth);
          const days: number = Math.floor((timeRemaining % millisecondsInMonth) / millisecondsInDay);
          const hours: number = Math.floor((timeRemaining % millisecondsInDay) / millisecondsInHour);
          const minutes: number = Math.floor((timeRemaining % millisecondsInHour) / millisecondsInMinute);
          const seconds: number = Math.floor((timeRemaining % millisecondsInMinute) / millisecondsInSecond);

          let dateString: string = "";

          if (years > 0) {
            dateString += ` ${years} year,`;
          }
          if (months > 0) {
            dateString += ` ${months} month,`;
          }
          if (days > 0) {
            dateString += ` ${days} day,`;
          }
          if (hours > 0) {
            dateString += ` ${hours}:`;
          }
          if (minutes > 0) {
            dateString += ` ${minutes}:`;
          }
          if (seconds > 0) {
            dateString += ` ${seconds}`;
          }

          setDate(dateString);
        }
      };

      const interval = setInterval(calculateTimeRemaining, 1000);
      calculateTimeRemaining();

      return () => {
        clearInterval(interval);
      };
    } else {
      console.error("Date not found.");
    }
  }, [activatedDate, expiredDate]);

  return (
    <Fragment>
      <Disclosure as="nav" className="w-full fixed top-0 bg-[#0D0D0D] z-20">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 z-20">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="flex flex-1 items-center justify-between max-md:ml-14 pr-3 sm:pr-0 sm:items-center max-sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/">
                      <Image
                        src={icon}
                        alt="icon"
                        className="mr-10"
                        priority={true}
                      />
                    </Link>
                    <div className="hidden sm:block">
                      <div className="fixed top-3">
                        <SearchHome
                          id="search1"
                          filteredMovies={filteredMovies}
                          search={search}
                          handleSearchMovie={handleSearchMovie}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile dropdown & notification */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {status === "unauthenticated" ? (
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          className="h-10 w-100 flex justify-center items-center rounded p-5 bg-[#3E3E3E] hover:opacity-80 text-[#D2D2D2]"
                          onClick={openModalLogin}
                        >
                          Login
                        </button>
                        <button
                          type="button"
                          className="h-10 w-100 flex justify-center items-center rounded p-5 bg-[#CD2E71] hover:opacity-80 text-[#D2D2D2]"
                          onClick={openModalRegister}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  ) : userAuth?.data?.role === "user" ? (
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          className="relative w-7 h-7 flex justify-center items-center rounded-full bg-[#3E3E3E] text-[#D2D2D2] focus:outline-none focus:ring-1 focus:ring-[#D2D2D2] focus:ring-offset-1 focus:ring-offset-[#D2D2D2]"
                        >
                          <span className="absolute" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="w-5 h-5" aria-hidden="true" />
                        </button>

                        <Menu as="div" className="relative">
                          <div>
                            <Menu.Button className="w-10 h-10 relative flex rounded-full overflow-hidden">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              {user?.photo &&
                              user?.photo !==
                                "http://localhost:5000/uploads/photo/" ? (
                                <Image
                                  src={user?.photo}
                                  alt={user?.username ?? "User"}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                  priority={true}
                                />
                              ) : (
                                <Image
                                  src={defaultPhoto}
                                  alt={user?.username ?? "User"}
                                  width={40}
                                  height={50}
                                  className="p-1 rounded-full"
                                  priority={true}
                                />
                              )}
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 bg-[#0D0D0D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {user?.premi?.status !== false ? (
                                <></>
                              ) : (
                                <ButtonPremium
                                  openModalPremium={openModalPremium}
                                />
                              )}

                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href={`/pages/users/profile-user/${user?.id}`}
                                    className={classNames(
                                      active ? "hover:bg-[#313131]" : "",
                                      "block px-4 py-2 text-sm text-[#D2D2D2]"
                                    )}
                                  >
                                    Your Profile
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/users/my-list-movie"
                                    className={classNames(
                                      active ? "hover:bg-[#313131]" : "",
                                      "block px-4 py-2 text-sm text-[#D2D2D2]"
                                    )}
                                  >
                                    My Movie
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    className={classNames(
                                      active ? "hover:bg-[#313131]" : "",
                                      "w-full block px-4 py-2 text-start text-sm text-[#D2D2D2]"
                                    )}
                                    onClick={handleLogout}
                                  >
                                    Logout
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-3">
                        <Menu as="div" className="relative">
                          <div>
                            <Menu.Button className="w-10 h-10 relative flex rounded-full overflow-hidden">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              {user?.photo &&
                              user?.photo !==
                                "http://localhost:5000/uploads/photo/" ? (
                                <Image
                                  src={user?.photo}
                                  alt={user?.username ?? "Admin"}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                  priority={true}
                                />
                              ) : (
                                <Image
                                  src={defaultPhoto}
                                  alt={user?.username ?? "Admin"}
                                  width={40}
                                  height={40}
                                  priority={true}
                                />
                              )}
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 bg-[#0D0D0D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href={`/pages/admin/profile-admin/${user?.id}`}
                                    className={classNames(
                                      active ? "hover:bg-[#313131]" : "",
                                      "block px-4 py-2 text-sm text-[#D2D2D2]"
                                    )}
                                  >
                                    Your Profile
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/admin/list-movie"
                                    className={classNames(
                                      active ? "hover:bg-[#313131]" : "",
                                      "block px-4 py-2 text-sm text-[#D2D2D2]"
                                    )}
                                  >
                                    List Movie
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/admin/list-category"
                                    className={classNames(
                                      active ? "hover:bg-[#313131]" : "",
                                      "block px-4 py-2 text-sm text-[#D2D2D2]"
                                    )}
                                  >
                                    List Category
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/pages/admin/list-transaction"
                                    className={classNames(
                                      active ? "hover:bg-[#313131]" : "",
                                      "block px-4 py-2 text-sm text-[#D2D2D2]"
                                    )}
                                  >
                                    List Transaction
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    className={classNames(
                                      active ? "hover:bg-[#313131]" : "",
                                      "w-full block px-4 py-2 text-start text-sm text-[#D2D2D2]"
                                    )}
                                    onClick={handleLogout}
                                  >
                                    Logout
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              {status === "unauthenticated" ? (
                <div className="space-y-1 px-5 pb-3 pt-2 flex flex-col gap-1">
                  <button
                    type="button"
                    className="h-10 w-100 flex justify-center items-center rounded p-5 bg-[#3E3E3E] hover:opacity-80 text-[#D2D2D2]"
                    onClick={openModalLogin}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="h-10 w-100 flex justify-center items-center rounded p-5 bg-[#CD2E71] hover:opacity-80 text-[#D2D2D2]"
                    onClick={openModalRegister}
                  >
                    Register
                  </button>
                </div>
              ) : userAuth?.data?.role === "user" ? (
                <div className="space-y-1 px-5 pb-3 pt-2 flex flex-col gap-1">
                  {user?.premi?.status !== false ? (
                    <></>
                  ) : (
                    <ButtonPremium openModalPremium={openModalPremium} />
                  )}
                  <Link
                    href={`/pages/users/profile-user/${user?.id}`}
                    className="mb-1 px-2 text-[#D2D2D2] hover:bg-[#313131]"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/pages/users/my-list-movie"
                    className="mb-1 px-2 text-[#D2D2D2] hover:bg-[#313131]"
                  >
                    My Movie
                  </Link>
                  <button
                    className="mb-1 px-2 text-start text-[#D2D2D2] hover:bg-[#313131]"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1 px-5 pb-3 pt-2 flex flex-col gap-1">
                  <Link
                    href={`/pages/admin/profile-admin/${user?.id}`}
                    className="mb-1 px-2 text-[#D2D2D2] hover:bg-[#313131]"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/pages/admin/list-movie"
                    className="mb-1 px-2 text-[#D2D2D2] hover:bg-[#313131]"
                  >
                    List Movie
                  </Link>
                  <Link
                    href="/pages/admin/list-category"
                    className="mb-1 px-2 text-[#D2D2D2] hover:bg-[#313131]"
                  >
                    List Category
                  </Link>
                  <Link
                    href="/pages/admin/list-transaction"
                    className="mb-1 px-2 text-[#D2D2D2] hover:bg-[#313131]"
                  >
                    List Transaction
                  </Link>
                  <button
                    className="mb-1 px-2 text-start text-[#D2D2D2] hover:bg-[#313131]"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
              <SearchHome
                id="search2"
                filteredMovies={filteredMovies}
                search={search}
                handleSearchMovie={handleSearchMovie}
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Register
        modalRegister={modalRegister}
        closeModalRegister={closeModalRegister}
        openModalLogin={openModalLogin}
      />
      <Login
        modalLogin={modalLogin}
        setModalLogin={setModalLogin}
        closeModalLogin={closeModalLogin}
        openModalRegister={openModalRegister}
      />
      <ModalPremium
        modalPremium={modalPremium}
        fetchUser={fetchUser}
        setModalPremium={setModalPremium}
        closeModalPremium={closeModalPremium}
      />
    </Fragment>
  );
}

async function getAllMovies() {
  const response = await fetch("http://localhost:5000/api/v1/movies", {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return await response.json();
}
