import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import QRCode from "qrcode";

const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const ISSUER = "Aygoot";

function getEncryptionKey() {
  const secret = process.env.TOTP_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("TOTP_ENCRYPTION_KEY is not configured.");
  }

  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(secret: string) {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decryptSecret(payload: string) {
  const key = getEncryptionKey();
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, IV_LENGTH);
  const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = raw.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export const generateTwoFactorSecret = (email: string) => {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, ISSUER, secret);

  return { secret, otpauth };
};

export const generateQRCodeDataUrl = (otpauth: string) =>
  QRCode.toDataURL(otpauth, { width: 220, errorCorrectionLevel: "M" });

export const verifyTotpToken = (token: string, secret: string) =>
  authenticator.check(token.replace(/\s+/g, ""), secret);

const formatRecoveryCode = (buffer: Buffer) => {
  const value = buffer.toString("hex").toUpperCase();
  return `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}`;
};

export async function generateRecoveryCodes(count = 8) {
  const codes: string[] = [];
  const hashes: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const code = formatRecoveryCode(randomBytes(6));
    codes.push(code);
    hashes.push(await bcrypt.hash(code, 10));
  }

  return { codes, hashes };
}

export async function matchRecoveryCodeIndex(code: string, hashes: string[]) {
  for (const [index, hash] of hashes.entries()) {
    const match = await bcrypt.compare(code.trim(), hash);
    if (match) return index;
  }

  return -1;
}
