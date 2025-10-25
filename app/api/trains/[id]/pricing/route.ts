import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const routeId = params.id

    const pricing = await sql`
      SELECT 
        class_type,
        base_fare
      FROM pricing
      WHERE route_id = ${routeId}
      ORDER BY base_fare DESC
    `

    return NextResponse.json({ pricing })
  } catch (error) {
    console.error("[v0] Error fetching pricing:", error)
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 })
  }
}
