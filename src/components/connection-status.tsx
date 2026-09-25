"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { toast } from "sonner";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);
  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}

function onlineSnapshot() {
  return navigator.onLine;
}

function onlineServerSnapshot() {
  return true;
}

export function ConnectionStatus() {
  const online = useSyncExternalStore(
    subscribe,
    onlineSnapshot,
    onlineServerSnapshot
  );
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      toast.success("Back online");
    }
  }, [online]);

  if (online) {
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
