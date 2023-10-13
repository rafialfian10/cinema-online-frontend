'use client';

// components next
import Image from 'next/image';
import Link from 'next/link';

// components react
import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';

// components
import UpdateMovie from '../update-movie/page';
import SearchMovie from '@/app/components/search-movie/searchMovie';
import ButtonUpdateMovie from '@/app/components/button-update-movie/buttonUpdateMovie';
import ButtonDeleteMovie from '@/app/components/button-delete-movie/buttonDeleteMovie';
import AuthAdmin from '@/app/components/auth-admin/authAdmin';

// image
import list from '@/assets/img/titik3.png';
// ----------------------------------------------------------

function ListMovie() {
  // state movies
  const [movies, setMovies] = useState<any[]>([]);    

  // state data movie
  const [dataMovie, setDataMovie] = useState<any>();

  // state modal update movie
  const [modalUpdateMovie, setModalUpdateMovie] = useState(false);

  // State search
  const [search, setSearch] = useState('');

  // state movie found
  const [moviesFound, setMoviesFound] = useState(true);
  
  // fetch data movies
  async function fetchMovies() {
    try {
      const moviesData = await getAllMovies();
      setMovies(moviesData.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }
  
  useEffect(() => {
    fetchMovies();
  }, []);

  // function close modal update movie
  function closeModalUpdateMovie() {
    setModalUpdateMovie(false);
    fetchMovies();
  }

  // handle search
  const handleSearchMovie = (event: any) => {
    setSearch(event.target.value);
    setMoviesFound(true);
  };

  // Filtered movie
  const filteredMovies = movies.filter((movie) =>
    movie?.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (filteredMovies.length === 0 && search !== '') {
      setMoviesFound(false);
    } else {
      setMoviesFound(true);
    }
  }, [filteredMovies, search]);
    
  return (
    <section>
      <UpdateMovie modalUpdateMovie={modalUpdateMovie} setModalUpdateMovie={setModalUpdateMovie} closeModalUpdateMovie={closeModalUpdateMovie} dataMovie={dataMovie} fetchMovies={fetchMovies} />
      <div className='w-full mt-20 px-4 md:px-10 lg:px-20 pb-10'>
        <SearchMovie search={search} handleSearchMovie={handleSearchMovie} />
        <p className='w-full mb-5 font-bold text-2xl text-[#D2D2D2]'>List Movie</p> 
        <div className='mb-5 text-right '>
          <Link href='/pages/admin/add-movie' className='p-2 rounded text-[#D2D2D2] font-bold bg-[#CD2E71] hover:opacity-80'>Add Movie</Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredMovies.length > 0 ? (
              filteredMovies?.map((movie, i) => {
                return (
                  <div className='w-30% flex flex-col justify-between rounded-md bg-[#0D0D0D]' key={i}>
                      <Menu as='div' className='absolute inline-block text-left self-end'>
                        <div>
                          <Menu.Button className='inline-flex w-10 justify-center gap-1 bg-transparent p-1'>
                            <Image src={list} alt='list' width={100} height={100} priority={true} />
                          </Menu.Button>
                        </div>
  
                        <Transition as={Fragment} enter='transition ease-out duration-100' enterFrom='transform opacity-0 scale-95' enterTo='transform opacity-100 scale-100' leave='transition ease-in duration-75' leaveFrom='transform opacity-100 scale-100' leaveTo='transform opacity-0 scale-95'>
                          <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#0D0D0D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <div className='py-1'>
                              <ButtonUpdateMovie movie={movie} setModalUpdateMovie={setModalUpdateMovie} setDataMovie={setDataMovie} />
                              <ButtonDeleteMovie movieId={movie?.id} fetchMovies={fetchMovies} />
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
  
                      <div className='w-full h-52'>
                        <Image src={movie?.thumbnail} alt={movie?.title} width={400} height={400} className='w-full h-full object-cover' priority={true} />
                      </div>
  
                      <div className='p-5'>
                        <p className='mb-2 text-2xl font-bold tracking-tight text-[#D2D2D2] dark:text-[#D2D2D2]'>{movie?.title}</p>
                        <p className='mb-3 font-normal text-[#D2D2D2] dark:text-[#D2D2D2]'>{ movie?.description.length > 100 ? `${movie?.description.substring(0, 100)}...` : movie?.description }</p>
                        <a href={`/pages/users/detail-movie/${movie?.id}`} className='inline-flex items-center px-3 py-2 text-sm font-medium bg-[#3E3E3E] text-center text-[#D2D2D2] rounded-md hover:opacity-80'>detail movie
                          <svg className='w-3.5 h-3.5 ml-2' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 10'>
                            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M1 5h12m0 0L9 1m4 4L9 9' fillRule='evenodd'/>
                          </svg>
                        </a>
                      </div>
                  </div>
                )
              })
            ) : (
              <p className='w-full min-h-screen text-[#D2D2D2] dark:text-[#D2D2D2] text-left mt-2'>Movie not found.</p>
            )
          }
        </div>
      </div>
    </section>
  );
}

export default AuthAdmin(ListMovie);

async function getAllMovies() {
  const response = await fetch('http://localhost:5000/api/v1/movies', {
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return await response.json();
}
