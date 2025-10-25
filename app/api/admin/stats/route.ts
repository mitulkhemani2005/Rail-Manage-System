import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get total revenue
    const revenueResult = await sql`
      SELECT COALESCE(SUM(final_amount), 0) as total_revenue
      FROM bookings
      WHERE payment_status = 'Completed'
      AND created_at >= NOW() - INTERVAL '30 days'
    `

    // Get previous month revenue for comparison
    const prevRevenueResult = await sql`
      SELECT COALESCE(SUM(final_amount), 0) as prev_revenue
      FROM bookings
      WHERE payment_status = 'Completed'
      AND created_at >= NOW() - INTERVAL '60 days'
      AND created_at < NOW() - INTERVAL '30 days'
    `

    // Get active trains count
    const trainsResult = await sql`
      SELECT COUNT(*) as active_trains
      FROM trains
      WHERE status = 'Active'
    `

    // Get total bookings this month
    const bookingsResult = await sql`
      SELECT COUNT(*) as total_bookings
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `

    // Get previous month bookings
    const prevBookingsResult = await sql`
      SELECT COUNT(*) as prev_bookings
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '60 days'
      AND created_at < NOW() - INTERVAL '30 days'
    `

    // Get passengers today
    const passengersResult = await sql`
      SELECT COALESCE(SUM(total_passengers), 0) as passengers_today
      FROM bookings
      WHERE DATE(created_at) = CURRENT_DATE
    `

    // Get passengers yesterday for comparison
    const prevPassengersResult = await sql`
      SELECT COALESCE(SUM(total_passengers), 0) as passengers_yesterday
      FROM bookings
      WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
    `

    const totalRevenue = Number.parseFloat(revenueResult[0].total_revenue)
    const prevRevenue = Number.parseFloat(prevRevenueResult[0].prev_revenue)
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

    const totalBookings = Number.parseInt(bookingsResult[0].total_bookings)
    const prevBookings = Number.parseInt(prevBookingsResult[0].prev_bookings)
    const bookingsChange = prevBookings > 0 ? ((totalBookings - prevBookings) / prevBookings) * 100 : 0

    const passengersToday = Number.parseInt(passengersResult[0].passengers_today)
    const passengersYesterday = Number.parseInt(prevPassengersResult[0].passengers_yesterday)
    const passengersChange =
      passengersYesterday > 0 ? ((passengersToday - passengersYesterday) / passengersYesterday) * 100 : 0

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue,
        revenueChange: revenueChange.toFixed(1),
        activeTrains: Number.parseInt(trainsResult[0].active_trains),
        totalBookings: totalBookings,
        bookingsChange: bookingsChange.toFixed(1),
        passengersToday: passengersToday,
        passengersChange: passengersChange.toFixed(1),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
