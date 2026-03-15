import { NextResponse } from "next/server";
import { getRecentReportCounts } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getRecentReportCounts();
  return NextResponse.json(payload);
}
