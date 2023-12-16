export type TransactionValues = {
  id: number;
  buyer: {
    id: number;
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    address: string;
    photo: string;
    role: string;
    premi: {
      id: number;
      user_id: number;
      order_id: number;
      price: number;
      status: boolean;
      token: string
      activated_at: string;
      expired_at: string;
    };
  };
  buyer_id: number;
  movie: {
    id: number;
    title: string;
    category: {
      id: number;
      name: string;
    };
    category_id: number;
    price: number;
    link: string;
    release_date: string;
    thumbnail: string;
    trailer: string;
    full_movie: string;
    rating: {
      id: number;
      movie_id: number;
      star: number;
      user: {
        id: number;
        username: string;
        email: string;
        password: string;
        phone: string;
        gender: string;
        address: string;
        photo: string;
        role: string;
        premi: {
          id: number;
          user_id: number;
          order_id: number;
          price: number;
          status: boolean;
          token: string
          activated_at: string;
          expired_at: string;
        };
      };
      user_id: number;
    };
  };
  movie_id: number;
  seller: {
    id: number;
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    address: string;
    photo: string;
    role: string;
    premi: {
      id: number;
      user_id: number;
      order_id: number;
      price: number;
      status: boolean;
      token: string
      activated_at: string;
      expired_at: string;
    };
  };
  seller_id: number;
  price: number;
  status: string;
  token: string;
};
