import { NextResponse, NextRequest } from "next/server";

export const GET = async () => {
  const apiKey = "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";
  return NextResponse.json({ apiKey: apiKey }, { status: 200 });
}; 