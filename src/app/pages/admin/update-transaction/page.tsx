"use client";

// components next
import { useSession } from "next-auth/react";
import Image from "next/image";

// components react
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import moment from "moment";

// components redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateTransaction } from "@/redux/features/transactionSlice";

// components
import AuthAdmin from "@/app/components/auth-admin/authAdmin";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";

// alert
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// styles
import styles from "./update-transaction.module.css";

// image
import icon from "@/assets/img/icon.png";
//--------------------------------------------------------------------

export interface UpdateTransactionProps {
  modalUpdateTransaction: boolean;
  setModalUpdateTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalUpdateTransaction: () => void;
  dataTransaction: any;
  fetchTransactions: () => void;
}

function UpdateTransaction({
  dataTransaction,
  modalUpdateTransaction,
  setModalUpdateTransaction,
  closeModalUpdateTransaction,
  fetchTransactions,
}: UpdateTransactionProps) {
  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  // handle approve transaction
  const handleApprove = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("status", "approved");

    try {
      const response = await dispatch(
        updateTransaction({ formData, id: dataTransaction?.id, session })
      );

      if (response.payload && response.payload.status === 200) {
        toast.success("Transaction successfully approved!", {
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
        fetchTransactions();
        setModalUpdateTransaction(false);
      }
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Transaction failed approved!", {
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

  // handle reject transaction
  const handleReject = async (e: any) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Are you sure to reject this transaction?",
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append("status", "rejected");

          const response = await dispatch(
            updateTransaction({ formData, id: dataTransaction?.id, session })
          );

          if (response.payload && response.payload.status === 200) {
            toast.success("Transaction successfully rejected!", {
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
            fetchTransactions();
            setModalUpdateTransaction(false);
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Transaction failed to rejected!", {
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
      <Transition appear show={modalUpdateTransaction} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModalUpdateTransaction}
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
                <Dialog.Panel className="w-full max-w-md md:max-w-4xl my-16 transform overflow-hidden rounded-2xl bg-[#0D0D0D] p-6 text-left align-middle shadow-xl transition-all">
                  <form>
                    <div className="mb-5 flex justify-between">
                      <p className="w-full font-bold text-2xl text-[#D2D2D2]">
                        Status Transaction
                      </p>
                      <Image src={icon} alt="icon" width={200} height={50} />
                    </div>

                    <div className="flex justify-end">
                      {dataTransaction?.status === "success" ||
                      dataTransaction?.status === "approved" ? (
                        <p className="w-200 px-3 py-2 rounded-md text-center font-bold text-[#D2D2D2] bg-[#00FF47]">
                          {dataTransaction?.status}
                        </p>
                      ) : (
                        ""
                      )}
                      {dataTransaction?.status === "pending" ? (
                        <p className="w-200 px-3 py-2 rounded-md text-center font-bold text-[#D2D2D2] bg-[#daac41]">
                          {dataTransaction?.status}
                        </p>
                      ) : (
                        ""
                      )}
                      {dataTransaction?.status === "failed" ||
                      dataTransaction?.status === "rejected" ? (
                        <p className="w-200 px-3 py-2 rounded-md text-center font-bold text-[#D2D2D2] bg-[#fc4545]">
                          {dataTransaction?.status}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="w-full mb-10 overflow-x-auto">
                      <table className="w-full text-sm font-light">
                        <thead className="border-b bg-[#0D0D0D] font-medium">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                            >
                              Username
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                            >
                              Gender
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                            >
                              Phone
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                            >
                              Address
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr className="border-b bg-[#232323] font-medium">
                            <td
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] text-center"
                            >
                              {dataTransaction?.buyer?.username}
                            </td>
                            <td
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] text-center"
                            >
                              {dataTransaction?.buyer?.gender}
                            </td>
                            <td
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] text-center"
                            >
                              {dataTransaction?.buyer?.phone}
                            </td>
                            <td
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] text-center"
                            >
                              {dataTransaction?.buyer?.address}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="w-full mb-10 overflow-x-auto">
                      <table className="w-full text-sm font-light">
                        <thead className="border-b bg-[#0D0D0D] font-medium">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-4 text-[#D2D2D2] font-bold text-center"
                            >
                              Title
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                            >
                              Release&nbsp;Date
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                            >
                              Genre
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                            >
                              Price
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr className="border-b bg-[#232323] font-medium">
                            <td
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] text-center"
                            >
                              {dataTransaction?.movie?.title}
                            </td>
                            <td
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] text-center"
                            >
                              {moment(
                                dataTransaction?.movie?.release_date
                              ).format("DD MMMM YYYY")}
                            </td>
                            <td
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] text-center"
                            >
                              {dataTransaction?.buyer?.category} -
                            </td>
                            <td
                              scope="col"
                              className="px-2 py-4 text-[#D2D2D2] text-center"
                            >
                              {dataTransaction?.movie?.price}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="submit"
                        className="w-200 px-3 py-1.5 rounded-md shadow-sm bg-[#00FF47] hover:opacity-80 text-white"
                        onClick={handleApprove}
                      >
                        Approve
                      </button>
                      <button
                        type="submit"
                        className="w-200 px-3 py-1.5 rounded-md shadow-sm bg-[#CD2E71] hover:opacity-80 text-white"
                        onClick={handleReject}
                      >
                        Reject
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

export default AuthAdmin(UpdateTransaction);
