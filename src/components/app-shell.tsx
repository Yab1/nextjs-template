"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { Can } from "@/components/can";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { api } from "@/lib/api/client";
import { useUiStore } from "@/stores/ui-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useSession();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    queryClient.clear();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {sidebarOpen ? (
        <aside className="border-border flex w-56 flex-col gap-3 border-r p-4">
          <Link className="font-semibold" href="/dashboard">
            App
          </Link>
          <Link href="/dashboard">Dashboard</Link>
          <Can permission="admin:view">
            <Link href="/admin">Admin</Link>
          </Can>
        </aside>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border flex items-center justify-between border-b px-4 py-3">
          <Button variant="outline" onClick={toggleSidebar}>
            Menu
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {data?.user.name ?? "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => logout()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
