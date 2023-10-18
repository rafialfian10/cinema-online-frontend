// // components next
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';

// // route auth
// import { Options } from './app/api/auth/[...nextauth]/route';

// // types
// import { UserAuth } from '@/types/userAuth';

// const protectedRoutes = ['/pages/admin/list-transaction', '/pages/admin/list-movie', '/pages/admin/list-category', '/pages/admin/add-movie', '/pages/admin/add-category', '/pages/admin/update-transaction', '/pages/admin/update-movie', '/pages/admin/update-category' ]

// export default async function middleware(request: NextRequest) {
//     // session
//     let session = await getServerSession(Options);
//     const userAuth: UserAuth | undefined = session?.user;

//     if(protectedRoutes.includes(request.nextUrl.pathname)) {
//         const absoluteURL = new URL('/', request.nextUrl.origin);
//         return NextResponse.redirect(absoluteURL.toString());
//     }
// } 

// export const config = {
//     matcher: '/about/:path*',
// }
// ----------------------------------------------

// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
// import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
// import { NextResponse } from "next/server"

// export default withAuth(
//     // `withAuth` augments your `Request` with the user's token.
//     function middleware(request: NextRequestWithAuth) {
//         // console.log(request.nextUrl.pathname)
//         // console.log(request.nextauth.token)

//         if (request.nextUrl.pathname.startsWith("/extra")
//             && request.nextauth.token?.role !== "admin") {
//             return NextResponse.rewrite(
//                 new URL("/denied", request.url)
//             )
//         }

//         if (request.nextUrl.pathname.startsWith("/client")
//             && request.nextauth.token?.role !== "admin"
//             && request.nextauth.token?.role !== "manager") {
//             return NextResponse.rewrite(
//                 new URL("/denied", request.url)
//             )
//         }
//     },
//     {
//         callbacks: {
//             authorized: ({ token }) => !!token
//         },
//     }
// )

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = { matcher: ["/extra", "/client", "/dashboard"] }