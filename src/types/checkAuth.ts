export type CheckAuthValues = {
  id: number;
  username: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  address: string;
  photo: string;
  role: string;
  premi: {
    id: number;
    order_id: number;
    price: number;
    status: boolean;
    token: string;
    user_id: number;
    activated_at: string;
    expired_at: string;
  };
};
