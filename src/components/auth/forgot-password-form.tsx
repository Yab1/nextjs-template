"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

const schema = z.object({
  email: z.email(),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await api(endpoints.forgotPassword, { method: "POST", body: values });
      toast.success("If that email exists, a reset link is on the way.");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Request failed");
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Send reset link
      </Button>
    </form>
  );
}
