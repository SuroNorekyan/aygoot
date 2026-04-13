import { jwtVerify, SignJWT } from "jose";

export const ADMIN_2FA_COOKIE = "aygoot-admin-2fa";
const ADMIN_2FA_MAX_AGE = 60 * 60 * 12;

type AdminTwoFactorPayload = {
  sub: string;
  scope: "admin-2fa";
};

function getSecret() {
  const secret = process.env.ADMIN_2FA_COOKIE_SECRET;

  if (!secret) {
    throw new Error("ADMIN_2FA_COOKIE_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function signAdminTwoFactorToken(userId: string) {
  return new SignJWT({ scope: "admin-2fa" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_2FA_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyAdminTwoFactorToken(token: string) {
  const { payload } = await jwtVerify<AdminTwoFactorPayload>(token, getSecret(), {
    algorithms: ["HS256"],
  });

  if (payload.scope !== "admin-2fa" || !payload.sub) {
    throw new Error("Invalid admin 2FA token.");
  }

  return payload.sub;
}

export const adminTwoFactorCookie = async (userId: string) => ({
  name: ADMIN_2FA_COOKIE,
  value: await signAdminTwoFactorToken(userId),
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_2FA_MAX_AGE,
});

export const clearedAdminTwoFactorCookie = {
  name: ADMIN_2FA_COOKIE,
  value: "",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 0,
};
