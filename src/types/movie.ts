export type MovieValues = {
  id: number;
  title: string;
  releaseDate: string;
  category: number[];
  price: number;
  link: string;
  description: string;
  trailer: string;
  fullMovie: string;
  rating: {
    id: number;
    star: number;
    movie_id: number;
    user_id: number;
  }
};