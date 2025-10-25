"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

interface Booking {
  id: number
  booking_reference: string
  passenger_name: string
  train_name: string
  train_number: string
  source_city: string
  destination_city: string
  final_amount: number
  booking_status: string
}

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings?limit=5")
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error("[v0] Error fetching bookings:", error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return (
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            Confirmed
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            Pending
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Cancelled
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {booking.passenger_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{booking.passenger_name || "Guest"}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.train_name} • {booking.source_city} → {booking.destination_city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">₹{booking.final_amount.toLocaleString()}</span>
                  {getStatusBadge(booking.booking_status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
