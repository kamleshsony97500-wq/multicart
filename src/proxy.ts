// only authenticated users can access this route //
// go next js ke middleware ke through authentication karenge //
// middleware me hum next-auth ke getToken function ka use karenge user ke token ko verify karne ke liye //
// agar token valid hai to user ko aage allow karenge, otherwise usko login page par redirect karenge //

import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth';
 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
   const {pathname} = request.nextUrl;
//    console.log("Middleware is running for path: ", pathname);
const publicRoute = ['/login', '/register', '/api/auth/', '/favicon.ico', '/_next'];

if(publicRoute.some(path => pathname.startsWith(path))){
    return NextResponse.next();
}

const session = await auth();
if(!session){
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
}
return NextResponse.next();


}

export const config = {
  matcher: [
   '/((?!api|_next/static|_next/image/favicon.ico|.*\\.(?:png|jpg|jpeg|webp|css|js|svg|gif)$).*)',
  ],
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
