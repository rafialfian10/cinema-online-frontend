"use client";

// components next
import { useSession } from "next-auth/react";

// components react
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// components
import AuthAdmin from "@/app/components/auth-admin/authAdmin";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { CategoryValues } from "@/types/category";

// alert
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// styles
import "./add-category.module.css";
//--------------------------------------------------------------------

export interface AddCategoryProps {
  modalAddCategory: boolean;
  setModalAddCategory: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAddcategory: () => void;
  fetchCategories: () => void;
}

function AddCategory({
  modalAddCategory,
  setModalAddCategory,
  closeModalAddcategory,
  fetchCategories,
}: AddCategoryProps) {
  // session
  const { data: session, status } = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  // error message
  const errorMessages = {
    name: "Name is required",
  };

  // handle add category
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryValues>();

  const onSubmit: SubmitHandler<CategoryValues> = async (data) => {
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    const formData = new FormData();
    formData.append("name", data?.name);

    try {
      const res = await API.post("/category", formData, config);
      if (res.status === 200) {
        toast.success("Category successfully added!", {
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
      
      fetchCategories();
      setModalAddCategory(false);
      reset();
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Category failed added!", {
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
    console.log("Add category failed");
  };

  return (
    <section>
      <Transition appear show={modalAddCategory} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModalAddcategory}
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
                      Add category
                    </p>
                    <div className="border-b border-gray-900/10 pb-8">
                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="title"
                            className="text-base text-[#D2D2D2]"
                          >
                            Name
                          </label>
                          <div className="relative mt-2 flex items-center">
                            <input
                              type="text"
                              id="title"
                              autoComplete="off"
                              className="block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6"
                              {...register("name", {
                                required: errorMessages.name,
                              })}
                            />
                          </div>
                          {errors.name ? (
                            <p className="mt-1 text-red-500">
                              {errors.name.message}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="submit"
                        className="w-200 px-3 py-1.5 rounded-md shadow-sm bg-[#CD2E71] hover:opacity-80 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add Category
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

export default AuthAdmin(AddCategory);
