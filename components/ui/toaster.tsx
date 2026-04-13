"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { useToast } from "./use-toast";
import { cn } from "@/lib/utils/cn";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <ToastPrimitive.Root
          key={toast.id}
          open
          onOpenChange={(open) => {
            if (!open) dismiss(toast.id);
          }}
          className={cn(
            "rounded-3xl border px-4 py-4 shadow-[0_18px_48px_rgba(17,14,14,0.18)] backdrop-blur",
            toast.variant === "destructive" &&
              "border-red-200 bg-red-50 text-red-900",
            toast.variant === "success" &&
              "border-emerald-200 bg-emerald-50 text-emerald-900",
            (!toast.variant || toast.variant === "default") &&
              "border-[rgba(var(--border),0.6)] bg-[rgb(var(--surface-strong))] text-[rgb(var(--foreground))]",
          )}
        >
          <ToastPrimitive.Title className="font-semibold">{toast.title}</ToastPrimitive.Title>
          {toast.description ? (
            <ToastPrimitive.Description className="mt-1 text-sm opacity-80">
              {toast.description}
            </ToastPrimitive.Description>
          ) : null}
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[360px] max-w-[calc(100vw-1rem)] flex-col gap-3 outline-none" />
    </ToastPrimitive.Provider>
  );
}
