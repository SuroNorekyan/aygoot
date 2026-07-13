import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/security/password";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { credentialsSchema } from "@/features/auth/validation";

const hasGoogleAuth =
  Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) &&
  !process.env.AUTH_GOOGLE_ID?.startsWith("TODO_") &&
  !process.env.AUTH_GOOGLE_SECRET?.startsWith("TODO_");

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
        const normalizedEmail = email;
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
    ...(hasGoogleAuth
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
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
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
  },
  secret: process.env.AUTH_SECRET,
});
