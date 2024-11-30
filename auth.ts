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
            id: string
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
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        linkAccount: async ({ user }) => {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        },
    },
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