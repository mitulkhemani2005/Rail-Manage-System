import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const date = searchParams.get("date")

    console.log("[v0] Train search params:", { from, to, date })

    if (!from || !to || !date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const trains = await sql`
      SELECT 
        t.id as train_id,
        t.train_name,
        t.train_number,
        t.train_type,
        t.status,
        r.id as route_id,
        r.departure_time,
        r.arrival_time,
        r.duration_minutes,
        r.distance_km,
        r.days_of_operation,
        s1.name as source_station,
        s1.city as source_city,
        s1.code as source_code,
        s2.name as destination_station,
        s2.city as destination_city,
        s2.code as destination_code,
        t.ac_1_seats,
        t.ac_2_seats,
        t.ac_3_seats,
        t.sleeper_seats
      FROM routes r
      JOIN trains t ON r.train_id = t.id
      JOIN stations s1 ON r.source_station_id = s1.id
      JOIN stations s2 ON r.destination_station_id = s2.id
      WHERE 
        LOWER(s1.city) = LOWER(${from})
        AND LOWER(s2.city) = LOWER(${to})
        AND t.status = 'Active'
      ORDER BY r.departure_time
    `

    console.log("[v0] Found trains:", trains.length)

    if (trains.length === 0) {
      console.log("[v0] No trains found for route:", { from, to })
      return NextResponse.json({ trains: [], message: "No trains found for this route" })
    }

    const trainsWithPricing = await Promise.all(
      trains.map(async (train: any) => {
        try {
          const pricing = await sql`
            SELECT class_type, base_fare
            FROM pricing
            WHERE route_id = ${train.route_id}
          `

          const pricingMap = pricing.reduce((acc: any, p: any) => {
            acc[p.class_type] = p.base_fare
            return acc
          }, {})

          console.log(`[v0] Train ${train.train_number} pricing:`, pricingMap)

          return {
            ...train,
            pricing: pricingMap,
          }
        } catch (error) {
          console.error(`[v0] Error fetching pricing for route ${train.route_id}:`, error)
          return {
            ...train,
            pricing: {},
          }
        }
      }),
    )

    console.log("[v0] Returning trains with pricing:", trainsWithPricing.length)

    return NextResponse.json({ trains: trainsWithPricing })
  } catch (error) {
    console.error("[v0] Error searching trains:", error)
    return NextResponse.json({ error: "Failed to search trains", details: String(error) }, { status: 500 })
  }
}
