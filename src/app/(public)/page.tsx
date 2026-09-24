import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Home",
  description: "Next.js application template",
});

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Next.js Template</h1>
        <ThemeToggle />
      </div>
      <p className="text-muted-foreground">
        Sign in to open the app. Use admin@example.com for the admin role. Any
        other email signs in as a user. Password must be at least 8 characters.
      </p>
      <div className="flex gap-3">
        <Link
          className="bg-primary text-primary-foreground inline-flex h-9 items-center rounded-md px-4 text-sm"
          href="/login"
        >
          Sign in
        </Link>
        <Link
          className="border-border inline-flex h-9 items-center rounded-md border px-4 text-sm"
          href="/register"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
