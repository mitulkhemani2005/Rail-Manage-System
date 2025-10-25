import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Booking request received:", body)

    const { userId, routeId, trainId, journeyDate, passengers, totalAmount, gstAmount, finalAmount, paymentMethod } =
      body

    if (!routeId || !trainId || !journeyDate || !passengers || passengers.length === 0) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required booking information" }, { status: 400 })
    }

    // Generate booking reference
    const bookingRef = `BKG${Date.now()}${Math.floor(Math.random() * 1000)}`
    console.log("[v0] Generated booking reference:", bookingRef)

    const effectiveUserId = userId || 1

    // Create booking
    const booking = await sql`
      INSERT INTO bookings (
        booking_reference,
        user_id,
        route_id,
        train_id,
        journey_date,
        total_passengers,
        total_amount,
        gst_amount,
        final_amount,
        payment_status,
        booking_status,
        payment_method
      ) VALUES (
        ${bookingRef},
        ${effectiveUserId},
        ${routeId},
        ${trainId},
        ${journeyDate},
        ${passengers.length},
        ${totalAmount},
        ${gstAmount},
        ${finalAmount},
        'Completed',
        'Confirmed',
        ${paymentMethod}
      )
      RETURNING *
    `

    console.log("[v0] Booking created:", booking[0])

    // Add passengers
    for (const passenger of passengers) {
      console.log("[v0] Adding passenger:", passenger)
      await sql`
        INSERT INTO passengers (
          booking_id,
          full_name,
          age,
          gender,
          class_type,
          fare_amount
        ) VALUES (
          ${booking[0].id},
          ${passenger.name},
          ${passenger.age},
          ${passenger.gender},
          ${passenger.classType},
          ${passenger.fare}
        )
      `
    }

    console.log("[v0] All passengers added successfully")

    return NextResponse.json({
      success: true,
      booking: booking[0],
      bookingReference: bookingRef,
    })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const bookings = await sql`
      SELECT 
        b.*,
        t.train_name,
        t.train_number,
        r.departure_time,
        r.arrival_time,
        s1.name as source_station,
        s1.city as source_city,
        s2.name as destination_station,
        s2.city as destination_city
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      JOIN routes r ON b.route_id = r.id
      JOIN stations s1 ON r.source_station_id = s1.id
      JOIN stations s2 ON r.destination_station_id = s2.id
      WHERE b.user_id = ${userId}
      ORDER BY b.journey_date DESC, b.created_at DESC
    `

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
