import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { departure_time, arrival_time, duration_minutes, distance_km, days_of_operation } = body

    const result = await sql`
      UPDATE routes 
      SET 
        departure_time = ${departure_time},
        arrival_time = ${arrival_time},
        duration_minutes = ${duration_minutes},
        distance_km = ${distance_km},
        days_of_operation = ${days_of_operation}
      WHERE id = ${params.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
    }

    return NextResponse.json({ schedule: result[0] })
  } catch (error: any) {
    console.error("[v0] Error updating schedule:", error)
    return NextResponse.json({ error: error.message || "Failed to update schedule" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      DELETE FROM routes WHERE id = ${params.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Schedule deleted successfully" })
  } catch (error: any) {
    console.error("[v0] Error deleting schedule:", error)
    return NextResponse.json({ error: error.message || "Failed to delete schedule" }, { status: 500 })
  }
}
