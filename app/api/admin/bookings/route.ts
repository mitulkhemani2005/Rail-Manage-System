import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"

    const bookings = await sql`
      SELECT 
        b.id,
        b.booking_reference,
        b.journey_date,
        b.final_amount,
        b.booking_status,
        b.created_at,
        t.train_name,
        t.train_number,
        s1.city as source_city,
        s2.city as destination_city,
        ru.full_name as passenger_name
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      JOIN routes r ON b.route_id = r.id
      JOIN stations s1 ON r.source_station_id = s1.id
      JOIN stations s2 ON r.destination_station_id = s2.id
      LEFT JOIN railway_users ru ON b.user_id = ru.id
      ORDER BY b.created_at DESC
      LIMIT ${limit}
    `

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings", bookings: [] }, { status: 500 })
  }
}
