// components next auth
// import NextAuth from 'next-auth';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// api
import { API } from '../../api';
// ----------------------------------------

export const Options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'Email', type: 'email', placeholder: 'Email....'},
        password: {label: 'Password', type: 'password', placeholder: 'Password....'},
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials.password) {
          return null
        }

        try {
          const res = await API.post('/login', {
            email: credentials.email,
            password: credentials.password
          });

          if (res.data.status === 200) {
            const user = res.data;
            return user;
          } 
        } catch (error) {
          return null; // if password wrong
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      // console.log(token); // return all data & status from api
      try {
        let userData = await API.get(`/user/49`);

        if (!userData) {
          token.id = user!.id;
          return token;
        }

        return {
          id: userData.data.data.id,
          username: userData.data.data.username,
          email: userData.data.data.email,
          gender: userData.data.data.gender,
          phone: userData.data.data.phone,
          address: userData.data.data.address,
          photo: userData.data.data.photo,
          role: userData.data.data.role,
          token: userData.data.data.token,
        }
        // ...
      } catch (error) {
        return token; 
      }
      // return { ...token, ...user };
    },
    async session({ session, token, user }: { session: any, token: any, user: any }) {
      session.user = token as any; // return all data & status from api
      if(token) { // custom session
        session.user.id = token.id;
        session.user.name = token.username;
        session.user.email = token.email;
        session.user.gender = token.gender;
        session.user.phone = token.phone;
        session.user.address = token.address;
        session.user.photo = token.photo;
        session.user.role = token.role;
        session.user.token = token.token;
      }     
      
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'production',
}

const handler = NextAuth(Options)
export { handler as GET, handler as POST }

