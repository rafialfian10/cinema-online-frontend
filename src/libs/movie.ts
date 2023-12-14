export async function getMovies() {
  const response = await fetch("http://localhost:5000/api/v1/movies", {
    cache: "no-store", // ada opsi lain, default, no-store, force-cache, reload, only-if-cached
    // next: {revalidate: 3600}
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data movies");
  }

  await wait(1000);
  const movies = await response.json();

  return {
    props: {
      data: movies,
    },
  };
}

export async function getMovie(id: number) {
  const response = await fetch(`http://localhost:5000/api/v1/movie/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("failed to fetch movie");
  }
  await wait(1000);
  return response.json();
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
