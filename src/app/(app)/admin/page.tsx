import { definePageMetadata } from "@/lib/seo";

export const generateMetadata = definePageMetadata({ title: "Admin" });

export default function AdminPage() {
  return (
    <main className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-muted-foreground">
        Only the admin role can open this page.
      </p>
    </main>
  );
}
