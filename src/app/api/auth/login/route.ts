import { z } from "zod";

import { sessionResponse } from "@/app/api/auth/session-cookie";
import { env } from "@/env/server";
import { createFixtureSession } from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { message: "Invalid email or password" },
      { status: 400 }
    );
  }

  if (env.API_URL) {
    const upstream = await fetch(`${env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
    if (!upstream.ok) {
      const body = (await upstream.json().catch(() => null)) as {
        message?: string;
      } | null;
      return Response.json(
        { message: body?.message ?? "Login failed" },
        { status: upstream.status }
      );
    }
    const session = (await upstream.json()) as { user: { email: string } };
    return sessionResponse(createFixtureSession(session.user.email));
  }

  return sessionResponse(createFixtureSession(parsed.data.email));
}
