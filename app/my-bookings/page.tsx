"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BookingCard } from "@/components/booking-card"
import { BookingFilters } from "@/components/booking-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Ticket, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MyBookingsPage() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual user ID from auth
        const response = await fetch("/api/bookings?userId=1")
        const data = await response.json()

        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          })
          return
        }

        console.log("[v0] Fetched bookings:", data.bookings)

        // Transform bookings to match BookingCard format
        const transformedBookings = data.bookings.map((b: any) => ({
          id: b.id.toString(),
          bookingId: b.booking_reference,
          train: b.train_name,
          trainNumber: b.train_number,
          from: `${b.source_station}, ${b.source_city}`,
          to: `${b.destination_station}, ${b.destination_city}`,
          date: new Date(b.journey_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          departure: b.departure_time.slice(0, 5),
          arrival: b.arrival_time.slice(0, 5),
          passengers: b.total_passengers,
          amount: `₹${Number.parseFloat(b.final_amount).toLocaleString()}`,
          status: b.booking_status.toLowerCase(),
          platform: "TBD",
        }))

        setBookings(transformedBookings)
      } catch (error) {
        console.error("[v0] Error fetching bookings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [toast])

  const upcomingBookings = bookings.filter((b) => b.status === "confirmed")
  const pastBookings = bookings.filter((b) => b.status === "completed" || b.status === "cancelled")

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">My Bookings</h1>
          <p className="mt-2 text-muted-foreground">View and manage your train ticket bookings</p>
        </div>

        <div className="space-y-8">
          <BookingFilters />

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Ticket className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  You haven't made any bookings yet. Start by searching for trains and booking your first ticket.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {upcomingBookings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              )}

              {pastBookings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
