import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getConfig, updateConfig } from "@/lib/db/config";

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getConfig();
  return Response.json(config);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await request.json();
  const config = await updateConfig(updates);
  return Response.json(config);
}
