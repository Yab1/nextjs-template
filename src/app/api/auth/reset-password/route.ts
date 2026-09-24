import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ message: "Invalid reset request" }, { status: 400 });
  }

  return Response.json({ ok: true });
}
