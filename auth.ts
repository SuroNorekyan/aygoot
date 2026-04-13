import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/security/password";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { credentialsSchema } from "@/features/auth/validation";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/en/account",
  },
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase();
        const rate = consumeRateLimit(`auth:signin:${normalizedEmail}`, 5, 60_000);

        if (!rate.success) {
          throw new Error("Too many sign-in attempts. Please try again later.");
        }

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await verifyPassword(password, user.passwordHash);

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          twoFAEnabled: user.twoFAEnabled,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.twoFAEnabled = user.twoFAEnabled;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as "USER" | "ADMIN" | undefined) ?? "USER";
        session.user.twoFAEnabled = Boolean(token.twoFAEnabled);
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
