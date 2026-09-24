import { readSession, sessionResponse } from "@/app/api/auth/session-cookie";

export async function GET() {
  return sessionResponse(await readSession());
}
