import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/connectDB"
import userModel from "./model/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },

    async authorize(credentials) {
    await connectDB();

  const email = credentials?.email as string;
  const password = credentials?.password as string;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new Error("No user found with this email");
  }

  // ✅ FIX: ensure password exists and is string
  if (!user.password || typeof user.password !== "string") {
    throw new Error("Please login with Google");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
    }),


    // Google provider for authentication using Google accounts //
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  ],

  callbacks: {

    // google se sign in karne par user ko database me check karna hai, agar user exist nahi karta to usko create karna hai //
    async signIn({user, account}){
      if(account?.provider == "google"){
        await connectDB();
        let DBUser = await userModel.findOne({email: user.email});
        if(!DBUser){
          DBUser = await userModel.create({
            name: user.name,
            email: user.email,
            image: user.image,
          })
        }
        user.id = DBUser._id.toString();
        user.role = DBUser.role;
      }
      return true

    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;  ///for next-auth.ts for role errors
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
       session.user.id = token.id as string;
       session.user.email = token.email as string;
       session.user.name = token.name as string;
       session.user.role = token.role as string;  ///for next-auth.ts for role errors
      }
      return session;
  }
},

pages: {
  signIn: "/login",
  error: "/login"
},

// ketane din tak session valid rahega, uske baad user ko dobara login karna padega //
 session: {
   strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
},
secret: process.env.AUTH_SECRET,

})