'use client';

// components next
import { useRouter } from 'next/navigation';

// components react
import React from 'react';
// ----------------------------------------

export interface SearchMovieProps {
    filteredMovies: any;
    search: string;
    handleSearchMovie: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchHome({ filteredMovies, search, handleSearchMovie }: SearchMovieProps) {
    const router = useRouter();

    // handle route movie
    const handleMovieRoute = (id: number) => {
        router.push(`/pages/users/detail-movie/${id}`);
        handleSearchMovie({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>); // Reset search input
    };
    
    return (
        <div className='w-full z-10'>
            <div className='flex justify-start'>
                <div className='w-full'>
                    <div className='shadow-md rounded-lg bg-[#0D0D0D]'>
                        <div className='flex items-center rounded-md bg-[#3E3E3E]'>
                            <div className='pl-2'>
                                <svg className='w-6 h-6 fill-current text-[#D2D2D2]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                                    <path className='heroicon-ui' d='M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'/>
                                </svg>
                            </div>
                            <input type='text' id='search' className='w-full rounded-md bg-[#3E3E3E] text-[#D2D2D2] leading-tight focus:outline-none p-2' placeholder='Search movies...' value={search} onChange={handleSearchMovie} />
                        </div>

                        <div className='text-sm'>
                            {search === '' ? (
                                null
                            ) : filteredMovies.length > 0 ? (
                                filteredMovies.map((movie: any) => (
                                    <div className='my-2 p-2 flex justify-start rounded-md cursor-pointer bg-[#3E3E3E] text-[#D2D2D2] hover:text-[#3E3E3E] hover:bg-[#D2D2D2]' key={movie?.id}>
                                        <span className='w-2 h-2 m-2 rounded-full bg-[#D2D2D2]'></span>
                                            <p className='text-left font-medium' onClick={() => handleMovieRoute(movie?.id)}>{movie?.title}</p>
                                        </div>
                                    ))
                            ) : (
                                <div className='my-2 p-2 flex justify-start rounded-md cursor-pointer bg-[#3E3E3E] text-[#D2D2D2] hover:text-[#3E3E3E] hover:bg-[#D2D2D2]'>
                                    <p className='text-left font-medium'>Movie not found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
