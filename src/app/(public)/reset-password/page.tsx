import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Skeleton } from "@/components/ui/skeleton";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Reset password" });

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
