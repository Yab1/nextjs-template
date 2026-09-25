import { z } from "zod";

import { sessionResponse } from "@/app/api/auth/session-cookie";
import { callBackend, upstreamFailure } from "@/lib/api/backend";
import { backendEndpoints } from "@/lib/api/endpoints";
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

  const upstream = await callBackend(backendEndpoints.login, {
    body: parsed.data,
  });
  if (upstream) {
    if (!upstream.ok) {
      return upstreamFailure(upstream);
    }
    const session = (await upstream.json()) as { user: { email: string } };
    return sessionResponse(createFixtureSession(session.user.email));
  }

  return sessionResponse(createFixtureSession(parsed.data.email));
}
