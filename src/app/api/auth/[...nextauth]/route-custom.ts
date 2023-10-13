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
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(Options)
export { handler as GET, handler as POST }

// strategy = 'jwt' berfungsi mengatur strategi sesi yang digunakan oleh NextAuth. Di sini, strategi yang digunakan adalah 'jwt' atau JSON Web Token. JSON Web Token (JWT) adalah metode untuk mentransmisikan informasi terenkripsi antara pihak yang berpartisipasi dalam bentuk token. Dengan menggunakan JWT, Anda dapat mengelola sesi pengguna secara aman dan efisien.

/* jwt({ token, user }):
Callback ini dipanggil setiap kali token JWT (JSON Web Token) dibuat atau diperbarui selama proses autentikasi. Fungsinya adalah untuk memungkinkan Anda untuk memodifikasi token JWT sebelum dikirimkan ke klien atau sebelum digunakan untuk otentikasi lebih lanjut. Parameter yang diterima adalah objek token yang berisi informasi token saat ini dan objek user yang berisi informasi pengguna yang diautentikasi.
Misalnya, dalam callback jwt, Anda dapat menambahkan data khusus pengguna ke dalam token atau memodifikasi token dengan informasi tambahan yang akan digunakan dalam permintaan otentikasi berikutnya. Ini berguna untuk mengirimkan informasi khusus pengguna dalam setiap permintaan otentikasi. */

/* session({ session, token, user }):
Callback ini dipanggil setiap kali sesi pengguna dibuat atau diperbarui setelah proses autentikasi berhasil. Fungsinya adalah untuk memungkinkan Anda untuk menyesuaikan data yang ada dalam sesi pengguna. Parameter yang diterima adalah objek session yang mewakili sesi pengguna, objek token yang berisi informasi token saat ini, dan objek user yang berisi informasi pengguna yang diautentikasi.
Dalam callback session, Anda biasanya akan menambahkan informasi dari token ke dalam objek sesi pengguna. Ini akan memastikan bahwa data pengguna dapat diakses dengan mudah selama sesi berlangsung. Dengan cara ini, Anda dapat menghindari melakukan permintaan ke server untuk mendapatkan informasi pengguna setiap kali halaman dimuat. */

// Jadi, perbedaan utama antara keduanya adalah bahwa jwt berfokus pada manipulasi token JWT itu sendiri, sementara session berfokus pada manipulasi data dalam sesi pengguna yang ada setelah autentikasi berhasil.
