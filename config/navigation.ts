export const publicNavigation = [
  { href: "/", key: "navigation.home" },
  { href: "/houses", key: "navigation.houses" },
  { href: "/location", key: "navigation.location" },
  { href: "/about", key: "navigation.about" },
  { href: "/contact", key: "navigation.contact" },
] as const;

export const accountNavigation = [
  { href: "/account", key: "navigation.account" },
  { href: "/account/bookings", key: "navigation.myBookings" },
] as const;

const adminTwoFactorEnabled = process.env.ADMIN_2FA_ENABLED === "true";

export const adminNavigation = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/houses", label: "Houses" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/media", label: "Media" },
  ...(adminTwoFactorEnabled ? [{ href: "/admin/2fa/setup", label: "2FA" }] : []),
] as const;
