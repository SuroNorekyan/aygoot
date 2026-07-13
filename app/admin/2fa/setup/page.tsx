import { auth } from "@/auth";
import { AdminTwoFactorSetup } from "@/components/admin/admin-two-factor-setup";
import { isAdminTwoFactorEnabled } from "@/lib/security/admin-flags";
import { notFound } from "next/navigation";

export default async function AdminTwoFactorSetupPage() {
  if (!isAdminTwoFactorEnabled()) {
    notFound();
  }

  const session = await auth();

  return <AdminTwoFactorSetup enabled={Boolean(session?.user?.twoFAEnabled)} />;
}
