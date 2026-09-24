"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import type { Session } from "@/lib/auth/types";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => api<Session | null>("/api/auth/session"),
    staleTime: 60_000,
  });
}
