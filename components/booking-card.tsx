import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Download, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Booking {
  id: string
  bookingId: string
  train: string
  trainNumber: string
  from: string
  to: string
  date: string
  departure: string
  arrival: string
  passengers: number
  amount: string
  status: "confirmed" | "completed" | "cancelled"
  platform: string
}

export function BookingCard({ booking }: { booking: Booking }) {
  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            Confirmed
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Cancelled
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{booking.train}</h3>
              <Badge variant="secondary">{booking.trainNumber}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Booking ID: {booking.bookingId}</p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{booking.from}</span>
            </div>
            <span className="text-sm text-muted-foreground">→</span>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="font-medium">{booking.to}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {booking.departure} - {booking.arrival}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {booking.passengers} {booking.passengers === 1 ? "Passenger" : "Passengers"}
              </span>
            </div>
            <div className="font-semibold text-primary">{booking.amount}</div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Platform: </span>
            <Badge variant="secondary">{booking.platform}</Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 bg-transparent" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          {booking.status === "confirmed" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this booking? This action cannot be undone and a cancellation fee
                    may apply.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Cancel Booking
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
