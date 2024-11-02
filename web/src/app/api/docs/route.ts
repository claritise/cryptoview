// app/api/docs/route.ts
import swaggerSpec from "~/app/swaggerConfig";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
