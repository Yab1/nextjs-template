import { z } from "zod";

import { sessionResponse } from "@/app/api/auth/session-cookie";
import { callBackend, upstreamFailure } from "@/lib/api/backend";
import { backendEndpoints } from "@/lib/api/endpoints";
import { createFixtureSession } from "@/lib/auth/session";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ message: "Invalid registration" }, { status: 400 });
  }

  const upstream = await callBackend(backendEndpoints.register, {
    body: parsed.data,
  });
  if (upstream && !upstream.ok) {
    return upstreamFailure(upstream);
  }

  const session = createFixtureSession(parsed.data.email);
  session.user.name = parsed.data.name;
  return sessionResponse(session);
}
