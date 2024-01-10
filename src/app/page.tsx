/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// components react
import { useEffect } from "react";
import { useSession } from "next-auth/react";
// import { Suspense } from "react";

// components redux
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { fetchMovies } from "@/redux/features/movieSlice";

// components
import PaginationMovie from "@/app/components/pagination-movie/paginationMovie";
import CardMovie from "@/app/components/card-movie/cardMovie";
import Swipers from "./components/swiper/swiper";
//---------------------------------------------------------------

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  const movies = useAppSelector((state: RootState) => state.movieSlice.movies);
  const loading = useAppSelector(
    (state: RootState) => state.movieSlice.loading
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, []);

  // pagination
  const page = searchParams["page"] ?? "1";
  const moviesPerPage = searchParams["per-page"] ?? "3";

  const start = (Number(page) - 1) * Number(moviesPerPage); // 0, 3, 6, 9
  const end = start + Number(moviesPerPage); // 3, 6, 9, 12
  const currentMovies = movies.slice(start, end); // the amount of movie data per page

  return (
    <section>
      <Swipers movies={movies} />
      <CardMovie currentMovies={currentMovies} />
      <PaginationMovie
        totalMovies={movies.length}
        firstPage={start > 0}
        lastPage={end < movies.length}
      />
    </section>
  );
}
