"use client";

import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ExelyFallback({
  containerId,
  message,
  contactLabel,
}: {
  containerId: string;
  message: string;
  contactLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const container = document.getElementById(containerId);
      const hasVendorMarkup =
        container?.querySelector("iframe, form, [class*='tl-'], [class*='be-']");
      setVisible(!hasVendorMarkup);
    }, 12000);

    return () => window.clearTimeout(timer);
  }, [containerId]);

  if (!visible) return null;

  return (
    <div className="exely-fallback" role="status">
      <p>{message}</p>
      <div className="flex flex-wrap gap-2">
        <a href={`tel:${siteConfig.contact.phoneHref}`}>
          <Phone className="h-4 w-4" />
          {siteConfig.contact.phoneDisplay}
        </a>
        <a href={`mailto:${siteConfig.contact.email}`}>
          <Mail className="h-4 w-4" />
          {contactLabel}
        </a>
      </div>
    </div>
  );
}
