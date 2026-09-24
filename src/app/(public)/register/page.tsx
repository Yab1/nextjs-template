import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Create account" });

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <ThemeToggle />
      </div>
      <RegisterForm />
      <Link className="text-sm" href="/login">
        Already have an account
      </Link>
    </main>
  );
}
