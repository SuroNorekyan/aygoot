import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  if (status === "CONFIRMED") return <Badge variant="success">Confirmed</Badge>;
  if (status === "REJECTED" || status === "CANCELLED") {
    return <Badge variant="danger">{status === "REJECTED" ? "Rejected" : "Cancelled"}</Badge>;
  }

  if (status === "PUBLISHED") return <Badge variant="accent">Published</Badge>;
  if (status === "DRAFT") return <Badge variant="neutral">Draft</Badge>;
  if (status === "ARCHIVED") return <Badge variant="danger">Archived</Badge>;

  return <Badge variant="neutral">{status === "PENDING" ? "Pending" : status}</Badge>;
}
