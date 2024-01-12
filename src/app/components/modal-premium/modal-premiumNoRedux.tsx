/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// components next
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// components react
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useContext } from "react";

// contexts
import { AuthContext } from "@/contexts/authContext";

// api
import { API } from "@/app/api/api";

// type
import { UserAuth } from "@/types/userAuth";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// image
import icon from "@/assets/img/icon.png";
import attacment from "@/assets/img/attacment.png";
//--------------------------------------------------------------------

export interface ModalPremiumProps {
  modalPremium: boolean;
  fetchUser: () => void;
  setModalPremium: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalPremium: () => void;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function ModalPremium({
  modalPremium,
  fetchUser,
  setModalPremium,
  closeModalPremium,
}: ModalPremiumProps) {
  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  const router = useRouter();

  // context check auth
  const { userCheckAuth, setUserCheckAuth } = useContext(AuthContext);

  //handle premium
  const handlePremium = async (e: any) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };

      const dataPremi: any = {
        price: 150000,
      };

      const formData = new FormData();
      formData.append("price", dataPremi.price);

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
        const response = await API.patch(
          `/premi_user/${userCheckAuth?.premi?.id}`,
          formData,
          config
        );
        if (response.data.status === 200) {
          console.log(response);

          (window as any).snap.pay(response.data.data.token, {
            onSuccess: function (result: any) {
              toast.success("Thank you for subscribing to premium", {
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
              setModalPremium(false);
              fetchUser();
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
              setModalPremium(false);
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
              setModalPremium(false);
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
              setModalPremium(false);
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
      .MIDTRANS_CLIENT_KEY_TRANSACTION_PREMIUM as string;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

  return (
    <Transition appear show={modalPremium} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModalPremium}>
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
              <Dialog.Panel className="w-full max-w-md md:max-w-xl transform overflow-hidden rounded-2xl bg-[#0D0D0D] p-6 text-left align-middle shadow-xl transition-all">
                <div className="mb-5 flex justify-center rounded-md bg-[#0D0D0D]">
                  <Image src={icon} alt="icon" width={200} height={50} />
                </div>
                <p className="mb-3 text-xl font-bold text-[#D2D2D2]">
                  Upgrade premium
                </p>
                <p className="mb-3 text-[#D2D2D2]">Total : Rp. 150.000,00</p>
                <button
                  type="button"
                  className="w-full flex justify-center items-center rounded-md text-center px-4 py-2 text-md font-bold text-[#D2D2D2] bg-[#CD2E71] hover:opacity-80"
                  onClick={handlePremium}
                >
                  <Image
                    src={attacment}
                    alt="attacment"
                    width={30}
                    height={30}
                    priority={true}
                    className="mr-1"
                  />{" "}
                  Pay
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
