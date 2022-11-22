import { PrismaAdapter } from "@next-auth/prisma-adapter";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DatabaseInstance from "@/lib/DatabaseInstance";

const dbConnection = DatabaseInstance.getInstance().getConnection();

const options: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        try {
          const { data: user } = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/users/check-credentials`,
            credentials,
            {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                accept: "application/json",
              },
            }
          );
          return user;
        } catch (_error) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  adapter: PrismaAdapter(dbConnection),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
};

const authHandler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);

export default authHandler;
