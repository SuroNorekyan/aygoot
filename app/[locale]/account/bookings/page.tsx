import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AccountBookingsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user) {
    redirect(`/${locale}/account`);
  }

  redirect(`/${locale}/account`);
}
