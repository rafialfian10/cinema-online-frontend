"use client";

// components next
import { useRouter, useSearchParams } from "next/navigation";

// components react
import { FC } from "react";
//---------------------------------------------------------

export interface PaginationTransactionProps {
  totalTransaction: any;
  firstPage: boolean;
  lastPage: boolean;
}

const PaginationTransaction: FC<PaginationTransactionProps> = ({
  totalTransaction,
  firstPage,
  lastPage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const transactionPerPage = searchParams.get("per-page") ?? "5";
  const totalPages = Math.ceil(totalTransaction / Number(transactionPerPage));

  // page number
  const pageNumbers = () => {
    const visiblePageNumbers = [];
    const maxVisiblePages = 3;
    const startPage = Math.max(
      1,
      Number(page) - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      visiblePageNumbers.push(
        <li key={i}>
          <button
            type="button"
            className={`h-10 leading-tight flex items-center justify-center px-4 bg-[#0D0D0D] border border-[#D2D2D2] ${
              Number(page) === i
                ? "bg-[#353535] text-[#D2D2D2]"
                : "text-[#D2D2D2] hover:bg-[#353535]"
            }`}
            onClick={() =>
              router.push(`?page=${i}&per-page=${transactionPerPage}`)
            }
          >
            {i}
          </button>
        </li>
      );
    }

    return visiblePageNumbers;
  };

  return (
    <div className="w-full mb-10 px-0 md:px-10 lg:px-20 pb-10">
      <div className="w-full mb-2 flex max-sm:justify-center">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {Number(page) * Number(transactionPerPage)}{" "}
          </span>
          to{" "}
          <span className="font-medium">
            {" "}
            {Number(page) * Number(transactionPerPage)}{" "}
          </span>
          of <span className="font-medium"> {totalTransaction} </span>
          Movie
        </p>
      </div>
      <nav className="block"></nav>
      <div className="w-full flex max-sm:justify-center">
        <nav aria-label="Page navigation example">
          <ul className="h-10 flex items-center -space-x-px text-base">
            <li>
              <button
                type="button"
                className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 rounded-l-lg bg-[#0D0D0D] text-[#D2D2D2] border border-[#D2D2D2] ${
                  firstPage ? "hover:bg-[#353535]" : "opacity-50 cursor-text"
                }`}
                onClick={() =>
                  router.push(`?page=1&per-page=${transactionPerPage}`)
                }
                disabled={!firstPage}
              >
                <span className="text-[#D2D2D2] font-bold">{`<<`}</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 bg-[#0D0D0D] text-[#D2D2D2] border border-[#D2D2D2] ${
                  firstPage ? "hover:bg-[#353535]" : "opacity-50 cursor-text"
                }`}
                onClick={() =>
                  router.push(
                    `?page=${Number(page) - 1}&per-page=${transactionPerPage}`
                  )
                }
                disabled={!firstPage}
              >
                <span className="text-[#D2D2D2] font-bold">{`<`}</span>
              </button>
            </li>

            <ul className="h-10 flex items-center -space-x-px text-base">
              {pageNumbers()}
            </ul>

            <li>
              <button
                type="button"
                className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 bg-[#0D0D0D] text-[#D2D2D2] border border-[#D2D2D2] ${
                  lastPage ? "hover:bg-[#353535]" : "opacity-50 cursor-text"
                }`}
                onClick={() =>
                  router.push(
                    `?page=${Number(page) + 1}&per-page=${transactionPerPage}`
                  )
                }
                disabled={!lastPage}
              >
                <span className="text-[#D2D2D2] font-bold">{`>`}</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`h-10 ml-0 leading-tight flex items-center justify-center px-4 rounded-r-lg bg-[#0D0D0D] text-[#D2D2D2] border border-[#D2D2D2] ${
                  lastPage ? "hover:bg-[#353535]" : "opacity-50 cursor-text"
                }`}
                onClick={() =>
                  router.push(
                    `?page=${totalPages}&per-page=${transactionPerPage}`
                  )
                }
                disabled={!lastPage}
              >
                <span className="text-[#D2D2D2] font-bold">{`>>`}</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PaginationTransaction;
