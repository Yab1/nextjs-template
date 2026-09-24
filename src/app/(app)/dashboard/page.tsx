import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Dashboard" });

export default function DashboardPage() {
  return (
    <main className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">Signed-in users land here.</p>
    </main>
  );
}
