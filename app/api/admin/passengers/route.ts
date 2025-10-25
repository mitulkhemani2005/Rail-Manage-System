import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "50"

    const passengers = await sql`
      SELECT 
        p.id,
        p.full_name,
        p.age,
        p.gender,
        p.seat_number,
        p.class_type,
        p.fare_amount,
        b.booking_reference,
        b.journey_date,
        b.booking_status,
        t.train_name,
        t.train_number,
        s1.city as source_city,
        s2.city as destination_city
      FROM passengers p
      JOIN bookings b ON p.booking_id = b.id
      JOIN trains t ON b.train_id = t.id
      JOIN routes r ON b.route_id = r.id
      JOIN stations s1 ON r.source_station_id = s1.id
      JOIN stations s2 ON r.destination_station_id = s2.id
      ORDER BY b.journey_date DESC, p.id DESC
      LIMIT ${limit}
    `

    return NextResponse.json({ passengers })
  } catch (error) {
    console.error("[v0] Error fetching passengers:", error)
    return NextResponse.json({ error: "Failed to fetch passengers", passengers: [] }, { status: 500 })
  }
}
