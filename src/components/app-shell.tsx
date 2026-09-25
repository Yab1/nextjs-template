"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Can } from "@/components/can";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { useUiStore } from "@/stores/ui-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useSession();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const [signOutOpen, setSignOutOpen] = useState(false);

  async function logout() {
    await api(endpoints.logout, { method: "POST" });
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
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      setSignOutOpen(true);
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
              <DialogContent>
                <DialogTitle>Sign out</DialogTitle>
                <p className="text-muted-foreground mt-2 text-sm">
                  End this session on this device.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSignOutOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setSignOutOpen(false);
                      void logout();
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
