"use client";

import { useEffect } from "react";
import {
  exelyContainers,
  exelyContextId,
  exelyLoaderHosts,
  getExelyLocale,
} from "@/config/exely";
import type { Locale } from "@/config/site";

type BookingEngineIntegration = {
  __cq?: unknown[];
  __loader?: boolean;
  loaded?: boolean;
};

declare global {
  interface Window {
    bookingengine?: {
      integration?: BookingEngineIntegration;
    };
    __aygoodExelyInitialPath?: string;
  }
}

function loadExelyScript(integration: BookingEngineIntegration) {
  if (integration.__loader) return;

  integration.__loader = true;
  const target =
    document.getElementsByTagName("head")[0] ??
    document.getElementsByTagName("body")[0];

  const load = (hosts: readonly string[]) => {
    if (!hosts.length || !target) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://${hosts[0]}/integration/loader.js`;
    script.onerror = script.onload = () => {
      if (!window.bookingengine?.integration?.loaded) {
        script.parentNode?.removeChild(script);
        load(hosts.slice(1));
      }
    };
    target.appendChild(script);
  };

  load(exelyLoaderHosts);
}

export function ExelyInitializer({
  locale,
  searchForm = false,
  bookingForm = false,
}: {
  locale: Locale;
  searchForm?: boolean;
  bookingForm?: boolean;
}) {
  useEffect(() => {
    const currentPath = window.location.pathname + window.location.search;
    if (window.__aygoodExelyInitialPath === currentPath) {
      return;
    }

    const bookingengine = (window.bookingengine = window.bookingengine ?? {});
    const integration = (bookingengine.integration =
      bookingengine.integration ?? {});
    const commands: unknown[] = [
      ["setContext", exelyContextId, getExelyLocale(locale)],
    ];

    if (bookingForm && document.getElementById(exelyContainers.bookingForm)) {
      commands.push([
        "embed",
        "booking-form",
        { container: exelyContainers.bookingForm },
      ]);
    }

    if (searchForm && document.getElementById(exelyContainers.searchForm)) {
      commands.push([
        "embed",
        "search-form",
        { container: exelyContainers.searchForm },
      ]);
    }

    integration.__cq = integration.__cq
      ? integration.__cq.concat(commands)
      : commands;
    loadExelyScript(integration);
  }, [bookingForm, locale, searchForm]);

  return null;
}
