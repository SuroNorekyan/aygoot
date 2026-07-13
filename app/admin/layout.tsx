import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { ForbiddenError, UnauthorizedError, requireAdminUser } from "@/lib/auth/guards";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/en/account?callbackUrl=/admin");
  }

  try {
    await requireAdminUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/en/account?callbackUrl=/admin");
    }

    if (error instanceof ForbiddenError) {
      notFound();
    }

    throw error;
  }

  return (
    <div className="container-shell min-h-screen py-8">
      <AdminNav />
      <main className="pt-8">{children}</main>
    </div>
  );
}
