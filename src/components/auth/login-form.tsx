"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, api } from "@/lib/api/client";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8, "Use at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await api("/api/auth/login", { method: "POST", body: values });
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Login failed");
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
