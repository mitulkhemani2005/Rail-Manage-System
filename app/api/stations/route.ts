import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const stations = await sql`
      SELECT id, name, code, city, state
      FROM stations
      ORDER BY city
    `

    return NextResponse.json({ stations })
  } catch (error) {
    console.error("[v0] Error fetching stations:", error)
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 })
  }
}
