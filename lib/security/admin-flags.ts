export const isAdminTwoFactorEnabled = () =>
  process.env.ADMIN_2FA_ENABLED === "true";
