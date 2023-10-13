'use client';

import React from 'react';
// -------------------------------------------

export interface SearchcategoryProps {
    search: string;
    handleSearchCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchCategory({ search, handleSearchCategory }:SearchcategoryProps) {   
    return (
        <div className='relative ml-5 my-2'>
            <input type='search' className='bg-[#232323] text-[#D2D2D2] shadow rounded border-0 p-3' placeholder='Search...' value={search} onChange={handleSearchCategory} />
            <div className='absolute pin-r pin-t mt-3 mr-4 text-[#D2D2D2] top-0 right-0'></div>
        </div>
    )
}


