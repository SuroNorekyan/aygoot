import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-shell min-h-screen py-8">
      <AdminNav />
      <main className="pt-8">{children}</main>
    </div>
  );
}
