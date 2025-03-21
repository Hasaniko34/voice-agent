import { NextResponse, NextRequest } from "next/server";

export const GET = async () => {
  const apiKey = "AIzaSyDfJ4ZDvYDsC4Cq8lksklgFJDIzpwKgyxk";
  return NextResponse.json({ apiKey: apiKey }, { status: 200 });
}; 