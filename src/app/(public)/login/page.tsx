import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { definePageMetadata } from "@/lib/seo";

export const generateMetadata = definePageMetadata({ title: "Sign in" });

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <ThemeToggle />
      </div>
      <LoginForm />
      <div className="flex justify-between text-sm">
        <Link href="/forgot-password">Forgot password</Link>
        <Link href="/register">Create account</Link>
      </div>
    </main>
  );
}
