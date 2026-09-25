"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

export function ConnectionStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let wasOffline = !navigator.onLine;
    setOffline(wasOffline);

    function onOffline() {
      wasOffline = true;
      setOffline(true);
    }

    function onOnline() {
      setOffline(false);
      if (wasOffline) {
        wasOffline = false;
        toast.success("Back online");
      }
    }

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  if (!offline) {
    return null;
  }

  return (
    <div
      role="status"
      className="bg-foreground text-background fixed inset-x-0 top-0 z-50 px-4 py-2 text-center text-sm"
    >
      No internet connection
    </div>
  );
}
