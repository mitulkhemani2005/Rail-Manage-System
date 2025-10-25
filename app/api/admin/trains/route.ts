import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// Get all trains for admin
export async function GET() {
  try {
    const trains = await sql`
      SELECT 
        t.*,
        COUNT(DISTINCT r.id) as route_count
      FROM trains t
      LEFT JOIN routes r ON t.id = r.train_id
      GROUP BY t.id
      ORDER BY t.train_number
    `

    return NextResponse.json({ trains })
  } catch (error) {
    console.error("[v0] Error fetching trains:", error)
    return NextResponse.json({ error: "Failed to fetch trains" }, { status: 500 })
  }
}

// Create new train
export async function POST(request: Request) {
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

    const existingTrain = await sql`
      SELECT id FROM trains WHERE train_number = ${trainNumber}
    `

    if (existingTrain.length > 0) {
      return NextResponse.json(
        { error: `Train number ${trainNumber} already exists. Please use a different train number.` },
        { status: 400 },
      )
    }

    const result = await sql`
      INSERT INTO trains (
        train_number, train_name, train_type, total_seats, 
        ac_1_seats, ac_2_seats, ac_3_seats, sleeper_seats, general_seats, 
        status
      )
      VALUES (
        ${trainNumber}, ${trainName}, ${trainType}, ${totalSeats},
        ${ac1Seats || 0}, ${ac2Seats || 0}, ${ac3Seats || 0}, ${sleeperSeats || 0}, ${generalSeats || 0},
        ${status || "Active"}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, train: result[0] })
  } catch (error: any) {
    console.error("[v0] Error creating train:", error)

    if (error?.code === "23505" && error?.constraint === "trains_train_number_key") {
      return NextResponse.json(
        { error: `Train number already exists. Please use a different train number.` },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Failed to create train" }, { status: 500 })
  }
}
