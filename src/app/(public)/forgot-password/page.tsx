import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { definePageMetadata } from "@/lib/seo";

export const generateMetadata = definePageMetadata({
  title: "Forgot password",
});

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <ForgotPasswordForm />
      <Link className="text-sm" href="/login">
        Back to sign in
      </Link>
    </main>
  );
}
