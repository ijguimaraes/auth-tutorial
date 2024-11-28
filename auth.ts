import NextAuth, { type DefaultSession} from "next-auth"
import { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/db"
import authConfig from "@/auth.config"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            role: UserRole
        } & DefaultSession["user"]
    }
}
 
declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
  }
}

export const { 
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    callbacks: {
        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            session.user.role = token.role
            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)

            if (!existingUser) return token

            token.role = existingUser.role

            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },

    ...authConfig,
})