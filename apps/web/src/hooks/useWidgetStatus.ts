import { useState, useEffect } from "react";

export type WidgetStatus = "loading" | "online" | "offline";

export function useWidgetStatus(healthUrl: string | undefined): WidgetStatus {
  const [status, setStatus] = useState<WidgetStatus>("loading");

  useEffect(() => {
    if (!healthUrl) return;

    let cancelled = false;

    fetch(healthUrl, { signal: AbortSignal.timeout(3000) })
      .then((res) => {
        if (!cancelled) setStatus(res.ok ? "online" : "offline");
      })
      .catch(() => {
        if (!cancelled) setStatus("offline");
      });

    return () => {
      cancelled = true;
    };
  }, [healthUrl]);

  return status;
}
