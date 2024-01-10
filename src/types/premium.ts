export type PremiumValues = {
  id: number;
  order_id: number;
  price: number;
  status: boolean;
  token: string;
  user_id: number;
  user: {
    id: number;
    username: string;
    email: string;
    password: string;
    gender: string;
    phone: string;
    address: string;
    photo: File | string;
    role: string;
  };
  activated_at: string;
  expired_at: string;
};
