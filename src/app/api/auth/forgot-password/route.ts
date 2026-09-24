import { z } from "zod";

const schema = z.object({
  email: z.email(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ message: "Invalid email" }, { status: 400 });
  }

  return Response.json({ ok: true });
}
