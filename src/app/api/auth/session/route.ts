import { NextResponse } from "next/server";

import { readAccessSession } from "@/app/api/auth/session-cookie";

export async function GET() {
  const session = await readAccessSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(session);
}
