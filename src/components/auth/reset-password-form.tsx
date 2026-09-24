"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, api } from "@/lib/api/client";

const schema = z.object({
  password: z.string().min(8, "Use at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: {
          token: searchParams.get("token") ?? "fixture",
          password: values.password,
        },
      });
      toast.success("Password updated");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Reset failed");
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" type="password" {...form.register("password")} />
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Update password
      </Button>
    </form>
  );
}
