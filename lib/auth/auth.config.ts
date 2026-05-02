import { NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface ExtendedUser extends User {
  role: string;
}

interface ExtendedJWT extends JWT {
  role?: string;
  id?: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser & {
    id: string;
    role: string;
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;
        if (user.role !== "ADMIN" && user.role !== "MODERATOR") return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as ExtendedUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extUser = user as ExtendedUser;
        (token as ExtendedJWT).role = extUser.role;
        (token as ExtendedJWT).id = extUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      const extSession = session as ExtendedSession;
      const extToken = token as ExtendedJWT;
      if (extToken) {
        extSession.user.role = extToken.role ?? "USER";
        extSession.user.id = extToken.id ?? "";
      }
      return extSession;
    },
  },
};