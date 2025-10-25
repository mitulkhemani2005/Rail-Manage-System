import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get weekly bookings data
    const weeklyBookings = await sql`
      SELECT 
        TO_CHAR(created_at, 'Dy') as day,
        COUNT(*) as bookings
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(created_at, 'Dy'), EXTRACT(DOW FROM created_at)
      ORDER BY EXTRACT(DOW FROM created_at)
    `

    return NextResponse.json({ weeklyBookings })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
