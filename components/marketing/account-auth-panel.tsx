"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { Locale } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type Mode = "login" | "register";

export function AccountAuthPanel({
  locale,
  callbackUrl,
  copy,
}: {
  locale: Locale;
  callbackUrl: string;
  copy: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    passwordHint: string;
    login: string;
    register: string;
    switchToRegister: string;
    switchToLogin: string;
  };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("login");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      if (mode === "register") {
        if (form.password !== form.confirmPassword) {
          toast({ title: "Passwords do not match.", variant: "destructive" });
          return;
        }

        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        });

        const registerBody = (await registerResponse.json().catch(() => null)) as {
          error?: string;
        } | null;

        if (!registerResponse.ok) {
          toast({
            title: registerBody?.error ?? "Unable to create account.",
            variant: "destructive",
          });
          return;
        }
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast({ title: "Unable to sign in.", variant: "destructive" });
        return;
      }

      router.push(result?.url ?? callbackUrl);
      router.refresh();
    });
  };

  return (
    <div className="surface-card mx-auto w-full max-w-xl rounded-[32px] p-6 sm:p-8">
      <div className="mb-6 space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgb(var(--muted-foreground))]">
          {copy.title}
        </p>
        <h1 className="display-font text-4xl font-medium">{copy.title}</h1>
        <p className="text-sm leading-7 text-[rgb(var(--muted-foreground))]">{copy.subtitle}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" ? (
          <div>
            <Label htmlFor="auth-name" requiredIndicator>{copy.name}</Label>
            <Input id="auth-name" value={form.name} onChange={update("name")} required />
          </div>
        ) : null}
        <div>
          <Label htmlFor="auth-email" requiredIndicator>{copy.email}</Label>
          <Input id="auth-email" type="email" value={form.email} onChange={update("email")} required />
        </div>
        <div>
          <Label htmlFor="auth-password" requiredIndicator>{copy.password}</Label>
          <Input id="auth-password" type="password" value={form.password} onChange={update("password")} required />
        </div>
        {mode === "register" ? (
          <div>
            <Label htmlFor="auth-confirm" requiredIndicator>{copy.confirmPassword}</Label>
            <Input
              id="auth-confirm"
              type="password"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              required
            />
            <p className="mt-2 text-xs text-[rgb(var(--muted-foreground))]">{copy.passwordHint}</p>
          </div>
        ) : null}
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {mode === "login" ? copy.login : copy.register}
        </Button>
      </form>
      <button
        type="button"
        className="mt-5 w-full text-sm font-semibold text-[rgb(var(--muted-foreground))] underline-offset-4 hover:underline"
        onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
      >
        {mode === "login" ? copy.switchToRegister : copy.switchToLogin}
      </button>
    </div>
  );
}
