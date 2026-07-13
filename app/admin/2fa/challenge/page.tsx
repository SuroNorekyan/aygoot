import { AdminTwoFactorChallenge } from "@/components/admin/admin-two-factor-challenge";
import { isAdminTwoFactorEnabled } from "@/lib/security/admin-flags";
import { notFound } from "next/navigation";

export default function AdminTwoFactorChallengePage() {
  if (!isAdminTwoFactorEnabled()) {
    notFound();
  }

  return <AdminTwoFactorChallenge />;
}
