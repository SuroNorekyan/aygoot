"use client";

import { useState, useTransition } from "react";
import { put } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function AdminMediaUploader() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploaded, setUploaded] = useState<Array<{ url: string; pathname: string }>>([]);

  const onFileChange = (files: FileList | null) => {
    if (!files?.length) return;

    startTransition(async () => {
      try {
        const results = [];
        for (const file of Array.from(files)) {
          const pathname = `houses/${Date.now()}-${file.name}`;
          const prepare = await fetch("/api/uploads/client", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pathname,
            }),
          });

          const prepared = (await prepare.json().catch(() => null)) as {
            clientToken?: string;
            error?: string;
          } | null;

          if (!prepare.ok || !prepared?.clientToken) {
            throw new Error(prepared?.error ?? "Unable to create upload token.");
          }

          const result = await put(pathname, file, {
            access: "public",
            token: prepared.clientToken,
          });
          results.push(result);
        }

        setUploaded(results.map((item) => ({ url: item.url, pathname: item.pathname })));
        toast({ title: "Upload complete.", variant: "success" });
      } catch (error) {
        console.error(error);
        toast({ title: "Upload failed.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="surface-card rounded-[28px] p-6">
      <div className="mb-4 space-y-2">
        <h2 className="display-font text-2xl font-medium">Client uploads</h2>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          Upload images directly to Blob storage, then paste the returned URLs into a house.
        </p>
      </div>
      <label className="inline-flex cursor-pointer items-center gap-3">
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(event) => onFileChange(event.target.files)}
        />
        <Button asChild disabled={isPending}>
          <span>Select images</span>
        </Button>
      </label>
      {uploaded.length ? (
        <div className="mt-6 space-y-3">
          {uploaded.map((item) => (
            <div key={item.pathname} className="rounded-2xl bg-white/80 p-4 text-sm">
              <p className="font-semibold">{item.pathname}</p>
              <a href={item.url} className="text-[rgb(var(--muted-foreground))]" target="_blank" rel="noreferrer">
                {item.url}
              </a>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
