import { NextResponse } from "next/server";
import { runServiceChecks } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await runServiceChecks();
  return NextResponse.json(payload);
}
