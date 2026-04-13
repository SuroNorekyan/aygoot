# Palmanhac Reference Bundle

This bundle was exported as a reference pack for Aygoot.
Files are intended as reference-only and may be modified freely.

## Included files
- app/[locale]/about/page.tsx
- app/[locale]/account/page.tsx
- app/[locale]/contact/page.tsx
- app/[locale]/cookies/page.tsx
- app/[locale]/layout.tsx
- app/[locale]/not-found.tsx
- app/[locale]/privacy/page.tsx
- app/[locale]/terms/page.tsx
- app/admin/2fa/challenge/page.tsx
- app/admin/2fa/setup/page.tsx
- app/admin/layout.tsx
- app/admin/orders/[id]/page.tsx
- app/admin/orders/page.tsx
- app/admin/page.tsx
- app/admin/products/[id]/page.tsx
- app/admin/products/new/page.tsx
- app/admin/products/page.tsx
- app/api/account/password/route.ts
- app/api/admin/2fa/challenge/route.ts
- app/api/admin/2fa/setup/route.ts
- app/api/admin/2fa/verify/route.ts
- app/api/admin/orders/[id]/route.ts
- app/api/admin/orders/route.ts
- app/api/admin/orders/status/route.ts
- app/api/admin/products/[id]/route.ts
- app/api/admin/products/route.ts
- app/api/admin/upload/route.ts
- app/api/auth/[...nextauth]/route.ts
- app/api/auth/register/route.ts
- app/api/health/route.ts
- app/layout.tsx
- app/page.tsx
- auth.ts
- components/account/AccountAuthPanel.tsx
- components/account/AccountDashboard.tsx
- components/admin/AdminNav.tsx
- components/admin/AdminPagination.tsx
- components/admin/AdminTwoFactorChallenge.tsx
- components/admin/AdminTwoFactorSetup.tsx
- components/admin/orders/DeleteOrderButton.tsx
- components/admin/orders/OrderStatusForm.tsx
- components/admin/products/DeleteProductButton.tsx
- components/admin/products/ProductForm.tsx
- components/common/ContactForm.tsx
- components/common/IconButton.tsx
- components/common/LanguageSwitcher.tsx
- components/common/ScrollToTopButton.tsx
- components/common/SearchBar.tsx
- components/common/WarningNotice.tsx
- components/layout/AgeGate.tsx
- components/layout/DesktopNav.tsx
- components/layout/Footer.tsx
- components/layout/Header.tsx
- components/layout/HeaderIndicators.tsx
- components/layout/MobileMenu.tsx
- components/layout/Providers.tsx
- components/layout/TopBanner.tsx
- components/ui/badge.tsx
- components/ui/button.tsx
- components/ui/card.tsx
- components/ui/dialog.tsx
- components/ui/input.tsx
- components/ui/label.tsx
- components/ui/sheet.tsx
- components/ui/textarea.tsx
- components/ui/toaster.tsx
- components/ui/use-toast.tsx
- config/nav.ts
- config/site.ts
- lib/auth/guards.ts
- lib/auth/utils.ts
- lib/email/mailer.ts
- lib/email/order-notifications.ts
- lib/i18n/dictionaries.ts
- lib/security/password.ts
- lib/security/rate-limit.ts
- lib/security/totp.ts
- lib/server/db.ts
- lib/utils/faq.ts
- lib/utils/locale.ts
- middleware.ts
- package.json
- prisma/schema.prisma
- styles/globals.css

## Missing optional paths
- proxy.ts
- lib/utils/cn.ts
- env.example

## Notes
- This bundle intentionally excludes storefront-specific cart/checkout/payment/product domain files.
- It keeps reusable architecture, auth, i18n, admin, email, and UI reference files.
