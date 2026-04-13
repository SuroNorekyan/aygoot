import { AdminMediaUploader } from "@/components/admin/admin-media-uploader";

export default function AdminMediaPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="display-font text-4xl font-medium">Media</h2>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          Upload gallery assets and reuse their URLs in house records.
        </p>
      </div>
      <AdminMediaUploader />
    </div>
  );
}
