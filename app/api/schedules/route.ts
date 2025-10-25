import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const route = searchParams.get("route") || "all"

    let schedulesQuery

    if (!search && status === "all" && route === "all") {
      // No filters
      schedulesQuery = sql`
        SELECT 
          t.id,
          t.train_name,
          t.train_number,
          t.train_type,
          r.source_station_id,
          r.destination_station_id,
          r.departure_time,
          r.arrival_time,
          r.duration_minutes,
          r.days_of_operation,
          t.status,
          ds.name as departure_station_name,
          ds.city as departure_city,
          ds.code as departure_code,
          ast.name as arrival_station_name,
          ast.city as arrival_city,
          ast.code as arrival_code
        FROM trains t
        JOIN routes r ON t.id = r.train_id
        JOIN stations ds ON r.source_station_id = ds.id
        JOIN stations ast ON r.destination_station_id = ast.id
        WHERE t.status = 'Active'
        ORDER BY r.departure_time ASC 
        LIMIT 50
      `
    } else {
      // Build query with filters
      const conditions = ["t.status = 'Active'"]
      const params: any[] = []

      if (search) {
        conditions.push(`(t.train_name ILIKE $${params.length + 1} OR t.train_number ILIKE $${params.length + 2})`)
        params.push(`%${search}%`, `%${search}%`)
      }

      if (route !== "all") {
        const regionCities: { [key: string]: string[] } = {
          north: ["New Delhi", "Jaipur", "Chandigarh", "Lucknow"],
          south: ["Chennai", "Bangalore", "Hyderabad", "Kochi"],
          east: ["Kolkata", "Patna", "Bhubaneswar", "Guwahati"],
          west: ["Mumbai", "Ahmedabad", "Pune", "Goa"],
        }

        if (regionCities[route]) {
          conditions.push(`ds.city = ANY($${params.length + 1})`)
          params.push(regionCities[route])
        }
      }

      const whereClause = conditions.join(" AND ")

      // Build the full query string
      const queryText = `
        SELECT 
          t.id,
          t.train_name,
          t.train_number,
          t.train_type,
          r.source_station_id,
          r.destination_station_id,
          r.departure_time,
          r.arrival_time,
          r.duration_minutes,
          r.days_of_operation,
          t.status,
          ds.name as departure_station_name,
          ds.city as departure_city,
          ds.code as departure_code,
          ast.name as arrival_station_name,
          ast.city as arrival_city,
          ast.code as arrival_code
        FROM trains t
        JOIN routes r ON t.id = r.train_id
        JOIN stations ds ON r.source_station_id = ds.id
        JOIN stations ast ON r.destination_station_id = ast.id
        WHERE ${whereClause}
        ORDER BY r.departure_time ASC 
        LIMIT 50
      `

      schedulesQuery = params.length > 0 ? sql(queryText, params) : sql([queryText] as any)
    }

    const result = await schedulesQuery

    const statsResult = await sql`
      SELECT 
        COUNT(*) as total_trains,
        COUNT(*) FILTER (WHERE t.status = 'Active') as on_time_count,
        COUNT(*) FILTER (WHERE t.status = 'Delayed') as delayed_count,
        COUNT(*) FILTER (WHERE t.status = 'Cancelled') as cancelled_count
      FROM routes r
      JOIN trains t ON r.train_id = t.id
      WHERE t.status IN ('Active', 'Delayed', 'Cancelled')
    `

    const stats = statsResult[0]

    return NextResponse.json({
      schedules: result,
      stats: {
        totalTrains: Number.parseInt(stats.total_trains || "0"),
        onTimeCount: Number.parseInt(stats.on_time_count || "0"),
        delayedCount: Number.parseInt(stats.delayed_count || "0"),
        cancelledCount: Number.parseInt(stats.cancelled_count || "0"),
        onTimePercentage:
          stats.total_trains > 0
            ? (
                (Number.parseInt(stats.on_time_count || "0") / Number.parseInt(stats.total_trains || "1")) *
                100
              ).toFixed(1)
            : "0",
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching schedules:", error)
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
  }
}
