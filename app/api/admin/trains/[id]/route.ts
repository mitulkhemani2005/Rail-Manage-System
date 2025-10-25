import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// Update train
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      trainNumber,
      trainName,
      trainType,
      totalSeats,
      ac1Seats,
      ac2Seats,
      ac3Seats,
      sleeperSeats,
      generalSeats,
      status,
    } = body
    const { id } = params

    const result = await sql`
      UPDATE trains
      SET 
        train_number = ${trainNumber},
        train_name = ${trainName},
        train_type = ${trainType},
        total_seats = ${totalSeats},
        ac_1_seats = ${ac1Seats || 0},
        ac_2_seats = ${ac2Seats || 0},
        ac_3_seats = ${ac3Seats || 0},
        sleeper_seats = ${sleeperSeats || 0},
        general_seats = ${generalSeats || 0},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Train not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, train: result[0] })
  } catch (error) {
    console.error("[v0] Error updating train:", error)
    return NextResponse.json({ error: "Failed to update train" }, { status: 500 })
  }
}

// Delete train
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if train has any bookings
    const bookings = await sql`
      SELECT COUNT(*) as count FROM bookings WHERE train_id = ${id}
    `

    if (bookings[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete train with existing bookings. Set status to Inactive instead." },
        { status: 400 },
      )
    }

    await sql`DELETE FROM trains WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting train:", error)
    return NextResponse.json({ error: "Failed to delete train" }, { status: 500 })
  }
}
