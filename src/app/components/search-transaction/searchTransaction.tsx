"use client";

import React from "react";
// -------------------------------------------

export interface SearchTransactionProps {
  searchvalue: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchTransaction({
  searchvalue,
  handleSearch,
}: SearchTransactionProps) {
  return (
    <div className="relative my-2">
      <input
        type="search"
        className="bg-[#232323] text-[#D2D2D2] shadow rounded border-0 p-3"
        value={searchvalue}
        onChange={handleSearch}
      />
      <div className="absolute pin-r pin-t mt-3 mr-4 text-[#D2D2D2] top-0 right-0"></div>
    </div>
  );
}
