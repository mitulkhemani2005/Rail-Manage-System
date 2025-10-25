import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    let result

    if (!from && !to) {
      // No filters - simple query
      result = await sql`
        SELECT 
          t.id,
          t.train_number,
          t.train_name,
          t.train_type,
          t.status,
          r.id as route_id,
          r.departure_time,
          r.arrival_time,
          r.duration_minutes,
          r.distance_km,
          r.days_of_operation,
          s1.name as source_station,
          s1.code as source_code,
          s1.city as source_city,
          s2.name as destination_station,
          s2.code as destination_code,
          s2.city as destination_city
        FROM trains t
        JOIN routes r ON t.id = r.train_id
        JOIN stations s1 ON r.source_station_id = s1.id
        JOIN stations s2 ON r.destination_station_id = s2.id
        WHERE t.status = 'Active'
        ORDER BY r.departure_time
      `
    } else if (from && to) {
      // Both filters
      result = await sql`
        SELECT 
          t.id,
          t.train_number,
          t.train_name,
          t.train_type,
          t.status,
          r.id as route_id,
          r.departure_time,
          r.arrival_time,
          r.duration_minutes,
          r.distance_km,
          r.days_of_operation,
          s1.name as source_station,
          s1.code as source_code,
          s1.city as source_city,
          s2.name as destination_station,
          s2.code as destination_code,
          s2.city as destination_city
        FROM trains t
        JOIN routes r ON t.id = r.train_id
        JOIN stations s1 ON r.source_station_id = s1.id
        JOIN stations s2 ON r.destination_station_id = s2.id
        WHERE t.status = 'Active'
          AND (s1.city ILIKE ${"%" + from + "%"} OR s1.name ILIKE ${"%" + from + "%"})
          AND (s2.city ILIKE ${"%" + to + "%"} OR s2.name ILIKE ${"%" + to + "%"})
        ORDER BY r.departure_time
      `
    } else if (from) {
      // Only from filter
      result = await sql`
        SELECT 
          t.id,
          t.train_number,
          t.train_name,
          t.train_type,
          t.status,
          r.id as route_id,
          r.departure_time,
          r.arrival_time,
          r.duration_minutes,
          r.distance_km,
          r.days_of_operation,
          s1.name as source_station,
          s1.code as source_code,
          s1.city as source_city,
          s2.name as destination_station,
          s2.code as destination_code,
          s2.city as destination_city
        FROM trains t
        JOIN routes r ON t.id = r.train_id
        JOIN stations s1 ON r.source_station_id = s1.id
        JOIN stations s2 ON r.destination_station_id = s2.id
        WHERE t.status = 'Active'
          AND (s1.city ILIKE ${"%" + from + "%"} OR s1.name ILIKE ${"%" + from + "%"})
        ORDER BY r.departure_time
      `
    } else {
      // Only to filter
      result = await sql`
        SELECT 
          t.id,
          t.train_number,
          t.train_name,
          t.train_type,
          t.status,
          r.id as route_id,
          r.departure_time,
          r.arrival_time,
          r.duration_minutes,
          r.distance_km,
          r.days_of_operation,
          s1.name as source_station,
          s1.code as source_code,
          s1.city as source_city,
          s2.name as destination_station,
          s2.code as destination_code,
          s2.city as destination_city
        FROM trains t
        JOIN routes r ON t.id = r.train_id
        JOIN stations s1 ON r.source_station_id = s1.id
        JOIN stations s2 ON r.destination_station_id = s2.id
        WHERE t.status = 'Active'
          AND (s2.city ILIKE ${"%" + to + "%"} OR s2.name ILIKE ${"%" + to + "%"})
        ORDER BY r.departure_time
      `
    }

    return NextResponse.json({ trains: result })
  } catch (error) {
    console.error("[v0] Error fetching trains:", error)
    return NextResponse.json({ error: "Failed to fetch trains" }, { status: 500 })
  }
}
