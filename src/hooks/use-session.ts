"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Session } from "@/lib/auth/types";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => api<Session | null>(endpoints.session),
    staleTime: 60_000,
  });
}
