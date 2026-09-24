import { sessionResponse } from "@/app/api/auth/session-cookie";

export async function POST() {
  return sessionResponse(null);
}
