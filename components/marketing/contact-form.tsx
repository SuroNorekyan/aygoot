"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function ContactForm({
  locale,
  copy,
}: {
  locale: Locale;
  copy: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    success: string;
  };
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });

      if (!response.ok) {
        toast({ title: "Unable to send your inquiry.", variant: "destructive" });
        return;
      }

      toast({ title: copy.success, variant: "success" });
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="contact-name" requiredIndicator>{copy.name}</Label>
        <Input id="contact-name" value={form.name} onChange={update("name")} required />
      </div>
      <div>
        <Label htmlFor="contact-email" requiredIndicator>{copy.email}</Label>
        <Input id="contact-email" type="email" value={form.email} onChange={update("email")} required />
      </div>
      <div>
        <Label htmlFor="contact-phone">{copy.phone}</Label>
        <Input id="contact-phone" value={form.phone} onChange={update("phone")} />
      </div>
      <div>
        <Label htmlFor="contact-message" requiredIndicator>{copy.message}</Label>
        <Textarea id="contact-message" value={form.message} onChange={update("message")} required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {copy.submit}
      </Button>
    </form>
  );
}
