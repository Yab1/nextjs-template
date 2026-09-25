import { z } from "zod";

import { callBackend, upstreamFailure } from "@/lib/api/backend";
import { backendEndpoints } from "@/lib/api/endpoints";

const schema = z.object({
  email: z.email(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ message: "Invalid email" }, { status: 400 });
  }

  const upstream = await callBackend(backendEndpoints.forgotPassword, {
    body: parsed.data,
  });
  if (upstream && !upstream.ok) {
    return upstreamFailure(upstream);
  }

  return Response.json({ ok: true });
}
