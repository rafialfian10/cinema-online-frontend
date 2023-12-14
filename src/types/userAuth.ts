export interface UserAuth {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  data?: {
    username?: string | null;
    email?: string | null;
    role?: string | null;
    token?: string | null;
  };
}
