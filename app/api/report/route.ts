import { NextResponse } from "next/server";
import { createOutageReport } from "@/lib/monitoring";
import type { ReportType } from "@/data/services";

const allowedTypes: ReportType[] = ["wallet", "trading", "token"];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { type?: ReportType }
    | null;

  if (!body?.type || !allowedTypes.includes(body.type)) {
    return NextResponse.json(
      { error: "Invalid report type" },
      { status: 400 }
    );
  }

  const result = await createOutageReport(body.type);

  return NextResponse.json({
    success: true,
    source: result.source
  });
}
