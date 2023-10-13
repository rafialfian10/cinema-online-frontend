// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

console.log('1', DefaultSession);
console.log('2', DefaultUser);
console.log('3', JWT);
console.log('4', DefaultJWT);


// declare module 'next-auth' {
//     interface Session {
//         user: {
//             id: string,
//             role: string,
//         } & DefaultSession
//     }

//     interface User extends DefaultUser {
//         role: string,
//     }
// }

// declare module 'next-auth/jwt' {
//     interface JWT extends DefaultJWT {
//         role: string,
//     }
// }