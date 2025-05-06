import { NextResponse } from "next/server"
import { appConfig } from "@/lib/config"

export async function GET() {
  return NextResponse.json({ version: appConfig.version })
}
