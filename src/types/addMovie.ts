export type AddMovieValues = {
  id: number
  title: string;
  releaseDate: string;
  category: number[];
  price: number;
  link: string;
  description: string;
  thumbnail: File[];
  trailer: File[];
  fullMovie: File[];
  selectAll: boolean;
};