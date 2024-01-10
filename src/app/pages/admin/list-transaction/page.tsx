/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// components next
import { useSession } from "next-auth/react";

// components react
import { useState, useEffect } from "react";

// components redux
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import {
  deleteTransaction,
  fetchTransactions,
} from "@/redux/features/transactionSlice";

// components
import SearchTransaction from "@/app/components/search-transaction/searchTransaction";
import PaginationTransaction from "@/app/components/pagination-transaction/paginationTransaction";
import UpdateTransaction from "../update-transaction/page";
import AuthAdmin from "@/app/components/auth-admin/authAdmin";

// alert
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// css
import styles from "./list-transaction.module.css";
import Loading from "@/app/loading";
// ---------------------------------------------

function ListTransaction({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // session
  const { data: session, status } = useSession();

  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  const transactions = useAppSelector(
    (state: RootState) => state.transactionSlice.transactions
  );
  const loading = useAppSelector(
    (state: RootState) => state.transactionSlice.loading
  );

  useEffect(() => {
    dispatch(fetchTransactions({ session, status }));
  }, []);

  // state one transaction
  const [dataTransaction, setDataTransaction] = useState<any>();

  // state modal update transaction
  const [modalUpdateTransaction, setModalUpdateTransaction] = useState(false);

  // state search user & movie & status
  const [searchUser, setSearchUser] = useState("");
  const [searchMovie, setSearchMovie] = useState("");
  const [searchstatus, setSearchStatus] = useState("");

  // state movie found
  const [transactionFound, setTransactionFound] = useState(true);

  // function close modal
  function closeModalUpdateTransaction() {
    setModalUpdateTransaction(false);
  }

  // pagination transaction
  const page = searchParams["page"] ?? "1";
  const transactionPerPage = searchParams["per-page"] ?? "5";

  const start = (Number(page) - 1) * Number(transactionPerPage);
  const end = start + Number(transactionPerPage);
  const currentTransaction = transactions ? transactions.slice(start, end) : [];

  // handle search user
  const handleSearchUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUser(event.target.value.toLowerCase());
    setSearchMovie("");
    setSearchStatus("");
    setTransactionFound(true);
  };

  // handle search movie
  const handleSearchMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMovie(event.target.value.toLowerCase());
    setSearchUser("");
    setSearchStatus("");
    setTransactionFound(true);
  };

  // handle search status
  const handleSearchStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStatus(event.target.value.toLowerCase());
    setSearchUser("");
    setSearchMovie("");
    setTransactionFound(true);
  };

  // Filtered transaction for users & movies & status
  const filteredTransaction = currentTransaction?.filter(
    (transaction: any) =>
      transaction?.buyer?.username
        .toLowerCase()
        .includes(searchUser.toLowerCase()) &&
      transaction?.movie?.title
        .toLowerCase()
        .includes(searchMovie.toLowerCase()) &&
      transaction?.status.toLowerCase().includes(searchstatus.toLowerCase())
  );

  // handle delete transaction
  const handleDeleteTransaction = async (e: any, id: number) => {
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await dispatch(deleteTransaction({ id, session }));

          if (response.payload && response.payload.status === 200) {
            toast.success("Transaction successfully deleted!", {
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
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Transaction failed to delete!", {
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
    <section className="w-full min-h-screen mt-20">
      <UpdateTransaction
        dataTransaction={dataTransaction}
        modalUpdateTransaction={modalUpdateTransaction}
        setModalUpdateTransaction={setModalUpdateTransaction}
        closeModalUpdateTransaction={closeModalUpdateTransaction}
        fetchTransactions={() =>
          dispatch(fetchTransactions({ session, status }))
        }
      />
      <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
        <p className="w-full mb-5 font-bold text-2xl text-[#D2D2D2]">
          List Transaction
        </p>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 overflow-x-auto">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b bg-[#0D0D0D] font-medium">
                <tr>
                  <th className="px-2 py-4 text-[#D2D2D2] font-bold text-center">
                    No
                  </th>
                  <th className="px-2 py-4 text-[#D2D2D2] font-bold text-center">
                    User
                  </th>
                  <th className="px-2 py-4 text-[#D2D2D2] font-bold text-center">
                    Movie
                  </th>
                  <th className="px-2 py-4 text-[#D2D2D2] font-bold text-center">
                    Status Payment
                  </th>
                  <th className="px-2 py-4 text-[#D2D2D2] font-bold text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <thead className="border-b bg-[#0D0D0D] font-medium">
                <tr>
                  <th
                    scope="col"
                    className="px-2 text-[#D2D2D2] font-bold text-center"
                  ></th>
                  <th
                    scope="col"
                    className="px-2 text-[#D2D2D2] font-bold text-center"
                  >
                    <SearchTransaction
                      searchvalue={searchUser}
                      handleSearch={handleSearchUser}
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-2 text-[#D2D2D2] font-bold text-center"
                  >
                    <SearchTransaction
                      searchvalue={searchMovie}
                      handleSearch={handleSearchMovie}
                    />
                  </th>
                  {/* <th scope='col' className='px-2 text-[#D2D2D2] font-bold text-center'></th> */}
                  <th
                    scope="col"
                    className="px-2 text-[#D2D2D2] font-bold text-center"
                  >
                    <SearchTransaction
                      searchvalue={searchstatus}
                      handleSearch={handleSearchStatus}
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-2 text-[#D2D2D2] font-bold text-center"
                  ></th>
                </tr>
              </thead>
              {filteredTransaction.length > 0 ? (
                filteredTransaction?.map((transaction, i) => {
                  const numberPage =
                    (Number(page) - 1) * Number(transactionPerPage) + i + 1;
                  return (
                    <tbody key={i}>
                      <tr className="border-b bg-[#232323]">
                        <td className="whitespace-nowrap px-2 py-4 font-medium text-[#D2D2D2] text-center">
                          {numberPage}
                        </td>
                        <td className="whitespace-nowrap px-2 py-4 text-[#D2D2D2] text-center">
                          {transaction?.buyer?.username}
                        </td>
                        <td className="whitespace-nowrap px-2 py-4 text-[#D2D2D2] text-center">
                          {transaction?.movie?.title}
                        </td>
                        {/* <td className='whitespace-nowrap px-2 py-4 text-[#D2D2D2] text-center'>0000000000</td> */}

                        {transaction?.status === "success" ||
                        transaction?.status === "approved" ? (
                          <td className="px-2 py-4 text-center font-bold text-[#00FF47]">
                            {transaction?.status}
                          </td>
                        ) : null}
                        {transaction?.status === "pending" ? (
                          <td className="px-2 py-4 text-center font-bold text-[#daac41]">
                            {transaction?.status}
                          </td>
                        ) : null}
                        {transaction?.status === "rejected" ||
                        transaction?.status === "failed" ? (
                          <td className="px-2 py-4 text-center font-bold text-[#fc4545]">
                            {transaction?.status}
                          </td>
                        ) : null}

                        <td className="whitespace-nowrap px-2 py-4 text-center">
                          <button
                            type="button"
                            className="px-2 py-1 rounded-md text-[#D2D2D2] font-bold bg-[#0D0D0D] hover:opacity-80"
                            onClick={() => {
                              setModalUpdateTransaction(true);
                              setDataTransaction(transaction);
                            }}
                          >
                            Update
                          </button>
                          <span className="text-[#D2D2D2] font-bold mx-2">
                            |
                          </span>
                          <button
                            type="button"
                            className="px-2 py-1 rounded-md text-[#D2D2D2] font-bold bg-[#CD2E71] hover:opacity-80"
                            onClick={(e) =>
                              handleDeleteTransaction(e, transaction?.id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              ) : (
                <tbody>
                  <tr className="border-b bg-[#232323]">
                    <td
                      scope="col"
                      className="px-2 text-[#D2D2D2] text-center"
                    ></td>
                    <td scope="col" className="px-2 text-[#D2D2D2] text-center">
                      User not found
                    </td>
                    <td scope="col" className="px-2 text-[#D2D2D2] text-center">
                      Movie not found
                    </td>
                    {/* <td scope='col' className='px-2 text-[#D2D2D2] text-center'></td> */}
                    <td scope="col" className="px-2 text-[#D2D2D2] text-center">
                      Status not found
                    </td>
                    <td
                      scope="col"
                      className="px-2 text-[#D2D2D2] text-center"
                    ></td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        )}
      </div>
      <PaginationTransaction
        totalTransaction={transactions?.length}
        firstPage={start > 0}
        lastPage={end < transactions?.length}
      />
    </section>
  );
}

export default AuthAdmin(ListTransaction);
