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
  fetchCategories,
  deleteCategory,
} from "@/redux/features/categorySlice";

// components
import AddCategory from "../add-category/page";
import UpdateCategory from "../update-category/page";
import SearchCategory from "@/app/components/search-category/searchCategory";
import AuthAdmin from "@/app/components/auth-admin/authAdmin";
import Loading from "@/app/loading";

// alert
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// css
import styles from "./list-category.module.css";
// ----------------------------------------------------------

function ListCategory() {
  const { data: session, status } = useSession();

  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  const categories = useAppSelector(
    (state: RootState) => state.categorySlice.categories
  );
  const loading = useAppSelector(
    (state: RootState) => state.categorySlice.loading
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // state data category
  const [dataCategory, setDataCategory] = useState<any>();

  // state modal add & update category
  const [modalAddCategory, setModalAddCategory] = useState(false);
  const [modalUpdateCategory, setModalUpdateCategory] = useState(false);

  // State search
  const [search, setSearch] = useState("");

  // state category found
  const [categoryFound, setCategoryFound] = useState(true);

  // Filtered category
  const filteredCategories = categories.filter(
    (category: any) =>
      category?.name &&
      category.name.toLowerCase().includes(search.toLowerCase())
  );

  // function close modal add & update categories
  function closeModalAddcategory() {
    setModalAddCategory(false);
  }

  function closeModalUpdatecategory() {
    setModalUpdateCategory(false);
  }

  // handle delete category
  const handleDeleteCategory = async (id: number) => {
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
          const response = await dispatch(deleteCategory({ id, session }));

          if (response.payload && response.payload.status === 200) {
            toast.success("Category successfully deleted!", {
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
            dispatch(fetchCategories());
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Category failed to delete!", {
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

  // handle search
  const handleSearchCategory = (event: any) => {
    setSearch(event.target.value);
    setCategoryFound(true);
  };

  return (
    <section className="w-full min-h-screen mt-20">
      <AddCategory
        modalAddCategory={modalAddCategory}
        setModalAddCategory={setModalAddCategory}
        closeModalAddcategory={closeModalAddcategory}
        fetchCategories={() => dispatch(fetchCategories())}
      />
      <UpdateCategory
        modalUpdateCategory={modalUpdateCategory}
        setModalUpdateCategory={setModalUpdateCategory}
        closeModalUpdatecategory={closeModalUpdatecategory}
        dataCategory={dataCategory}
        fetchCategories={() => dispatch(fetchCategories())}
      />
      <div className="w-full px-4 md:px-10 lg:px-20 pb-10">
        <div className="mb-5 flex justify-between">
          <p className="m-0 text-center font-bold text-2xl text-[#D2D2D2]">
            List category
          </p>
          <div className="flex align-middle text-center">
          <button
            type="button"
            className="p-2 rounded text-[#D2D2D2] font-bold bg-[#CD2E71] hover:opacity-80"
            onClick={() => setModalAddCategory(true)}
          >
            Add Category
          </button>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-sm font-light">
                      <thead className="border-b bg-[#0D0D0D] font-medium">
                        <tr>
                          <th
                            scope="col"
                            className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                          >
                            No
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-[#D2D2D2] font-bold text-center flex items-center"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-[#D2D2D2] font-bold text-center"
                          >
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
                            className="text-[#D2D2D2] font-bold text-center flex items-center"
                          >
                            <SearchCategory
                              search={search}
                              handleSearchCategory={handleSearchCategory}
                            />
                          </th>
                          <th
                            scope="col"
                            className="py-4 text-[#D2D2D2] font-bold text-center"
                          ></th>
                        </tr>
                      </thead>
                      {filteredCategories.length > 0 ? (
                        filteredCategories?.map((category, i) => {
                          return (
                            <tbody key={i}>
                              <tr className="border-b bg-[#232323]">
                                <td className="whitespace-nowrap px-2 py-4 font-medium text-[#D2D2D2] text-center">
                                  {i++ + 1}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-[#D2D2D2] text-left">
                                  {category?.name}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                  <button
                                    type="button"
                                    className="px-2 py-1 rounded-md text-[#D2D2D2] font-bold bg-[#0D0D0D] hover:opacity-80"
                                    onClick={() => {
                                      setModalUpdateCategory(true);
                                      setDataCategory(category);
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
                                    onClick={() =>
                                      handleDeleteCategory(category?.id)
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
                          <tr className="border-b bg-[#232323] font-medium">
                            <td
                              scope="col"
                              className="px-2 text-[#D2D2D2] text-center"
                            ></td>
                            <td
                              scope="col"
                              className="px-6 py-4 text-[#D2D2D2] text-left"
                            >
                              Name not found
                            </td>
                            <td
                              scope="col"
                              className="py-4 text-[#D2D2D2] text-center"
                            ></td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AuthAdmin(ListCategory);
