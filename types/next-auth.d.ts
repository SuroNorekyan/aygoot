import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "USER" | "ADMIN";
      twoFAEnabled?: boolean;
    };
  }

  interface User {
    role?: "USER" | "ADMIN";
    twoFAEnabled?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "ADMIN";
    twoFAEnabled?: boolean;
  }
}
