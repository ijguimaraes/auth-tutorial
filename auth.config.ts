import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "./data/user";


export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedCredentials = LoginSchema.safeParse(credentials);
                if (validatedCredentials.success) {
                    const { email, password } = validatedCredentials.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                return null;
            }
        })
    ]
} satisfies NextAuthConfig;