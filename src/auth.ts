```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "./lib/connectDB";
import userModel from "./model/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Email and password login
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string" ||
          !credentials.email ||
          !credentials.password
        ) {
          return null;
        }

        await connectDB();

        const user = await userModel.findOne({
          email: credentials.email,
        });

        if (!user || typeof user.password !== "string" || !user.password) {
          return null;
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // Google login
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    // Find or create the Google user in MongoDB
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }

        await connectDB();

        let DBUser = await userModel.findOne({
          email: user.email,
        });

        if (!DBUser) {
          DBUser = await userModel.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }

        user.id = DBUser._id.toString();
        user.role = DBUser.role;
      }

      return true;
    },

    // Store user information in the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    // Add user ID and role to the session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days in seconds
  },

  secret: process.env.AUTH_SECRET,
});
```
