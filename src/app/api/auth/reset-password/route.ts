import { z } from "zod";

import { callBackend, upstreamFailure } from "@/lib/api/backend";
import { backendEndpoints } from "@/lib/api/endpoints";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ message: "Invalid reset request" }, { status: 400 });
  }

  const upstream = await callBackend(backendEndpoints.resetPassword, {
    body: parsed.data,
  });
  if (upstream && !upstream.ok) {
    return upstreamFailure(upstream);
  }

  return Response.json({ ok: true });
}
