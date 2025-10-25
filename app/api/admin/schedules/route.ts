import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const trainId = searchParams.get("trainId")

    const schedules = trainId
      ? await sql`
          SELECT 
            r.id,
            r.train_id,
            t.train_number,
            t.train_name,
            ss.name as source_station,
            ss.code as source_code,
            ds.name as destination_station,
            ds.code as destination_code,
            r.departure_time,
            r.arrival_time,
            r.duration_minutes,
            r.distance_km,
            r.days_of_operation
          FROM routes r
          JOIN trains t ON r.train_id = t.id
          JOIN stations ss ON r.source_station_id = ss.id
          JOIN stations ds ON r.destination_station_id = ds.id
          WHERE r.train_id = ${trainId}
          ORDER BY t.train_number, r.departure_time
        `
      : await sql`
          SELECT 
            r.id,
            r.train_id,
            t.train_number,
            t.train_name,
            ss.name as source_station,
            ss.code as source_code,
            ds.name as destination_station,
            ds.code as destination_code,
            r.departure_time,
            r.arrival_time,
            r.duration_minutes,
            r.distance_km,
            r.days_of_operation
          FROM routes r
          JOIN trains t ON r.train_id = t.id
          JOIN stations ss ON r.source_station_id = ss.id
          JOIN stations ds ON r.destination_station_id = ds.id
          ORDER BY t.train_number, r.departure_time
        `

    return NextResponse.json({ schedules })
  } catch (error) {
    console.error("[v0] Error fetching schedules:", error)
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      train_id,
      source_station_id,
      destination_station_id,
      departure_time,
      arrival_time,
      duration_minutes,
      distance_km,
      days_of_operation,
      ac_1_price,
      ac_2_price,
      ac_3_price,
      sleeper_price,
      general_price,
    } = body

    // Check if route already exists
    const existing = await sql`
      SELECT id FROM routes 
      WHERE train_id = ${train_id} 
      AND source_station_id = ${source_station_id}
      AND destination_station_id = ${destination_station_id}
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "Route already exists for this train and stations" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO routes (
        train_id, source_station_id, destination_station_id,
        departure_time, arrival_time, duration_minutes, distance_km, days_of_operation
      ) VALUES (
        ${train_id}, ${source_station_id}, ${destination_station_id},
        ${departure_time}, ${arrival_time}, ${duration_minutes}, ${distance_km}, ${days_of_operation}
      )
      RETURNING *
    `

    const routeId = result[0].id

    const pricingInserts = []

    if (ac_1_price) {
      pricingInserts.push(
        sql`INSERT INTO pricing (route_id, class_type, base_fare) VALUES (${routeId}, 'AC 1', ${ac_1_price})`,
      )
    }
    if (ac_2_price) {
      pricingInserts.push(
        sql`INSERT INTO pricing (route_id, class_type, base_fare) VALUES (${routeId}, 'AC 2', ${ac_2_price})`,
      )
    }
    if (ac_3_price) {
      pricingInserts.push(
        sql`INSERT INTO pricing (route_id, class_type, base_fare) VALUES (${routeId}, 'AC 3', ${ac_3_price})`,
      )
    }
    if (sleeper_price) {
      pricingInserts.push(
        sql`INSERT INTO pricing (route_id, class_type, base_fare) VALUES (${routeId}, 'Sleeper', ${sleeper_price})`,
      )
    }
    if (general_price) {
      pricingInserts.push(
        sql`INSERT INTO pricing (route_id, class_type, base_fare) VALUES (${routeId}, 'General', ${general_price})`,
      )
    }

    await Promise.all(pricingInserts)

    return NextResponse.json(
      { schedule: result[0], message: "Schedule and pricing added successfully" },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating schedule:", error)
    return NextResponse.json({ error: error.message || "Failed to create schedule" }, { status: 500 })
  }
}
