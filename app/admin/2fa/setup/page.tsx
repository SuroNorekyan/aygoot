import { auth } from "@/auth";
import { AdminTwoFactorSetup } from "@/components/admin/admin-two-factor-setup";

export default async function AdminTwoFactorSetupPage() {
  const session = await auth();

  return <AdminTwoFactorSetup enabled={Boolean(session?.user?.twoFAEnabled)} />;
}
