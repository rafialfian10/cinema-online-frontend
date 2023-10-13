// components next
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// components react
import { Suspense } from 'react';

// route auth
import { Options } from './api/auth/[...nextauth]/route';

// components
import PaginationMovie from '@/app/components/pagination-movie/paginationMovie';
import CardMovie from '@/app/components/card-movie/cardMovie';
import Swipers from './components/swiper/swiper';

// types
import { UserAuth } from '@/types/userAuth';

// libs
import { getMovies } from '@/libs/movies';
//---------------------------------------------------------------

export default async function Home({ searchParams }: {searchParams: { [key: string]: string | string[] | undefined }}) { 
  // session
  // let session = await getServerSession(Options);
  // const userAuth: UserAuth | undefined = session?.user;

  const moviesResponse = await getMovies(); 
  const movies = moviesResponse.props.data.data;
  
  // pagination
  const page = searchParams['page'] ?? '1';
  const moviesPerPage = searchParams['per-page'] ?? '3';

  const start = (Number(page) -1) * Number(moviesPerPage); // 0, 3, 6, 9
  const end = start + Number(moviesPerPage); // 3, 6, 9, 12
  const currentMovies = movies.slice(start, end); // the amount of movie data per page

  return (
    <section>
      <Swipers movies={movies} />
      <CardMovie currentMovies={currentMovies} />
      <PaginationMovie totalMovies={movies.length} firstPage={start > 0} lastPage={end < movies.length} />
    </section>
  )
}

// async function getAllMovies() {
//   const response = await fetch('http://localhost:5000/api/v1/movies', {
//     cache: 'default', // ada opsi lain, default, no-store, force-cache, reload, only-if-cached
//     next: {revalidate: 3600}
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch data');
//   }
  
//   return await response.json();
// }


