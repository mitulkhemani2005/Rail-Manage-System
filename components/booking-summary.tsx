import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users } from "lucide-react"

interface BookingSummaryProps {
  train?: {
    name: string
    number: string
    departure: string
    arrival: string
    price: number
    class?: string
  }
  passengers?: number
  from?: string
  to?: string
  date?: string
}

export function BookingSummary({ train, passengers = 1, from, to, date }: BookingSummaryProps) {
  const subtotal = train ? train.price * passengers : 0
  const tax = subtotal * 0.05
  const total = subtotal + tax

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {from && to && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{from}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{to}</span>
            </div>
          )}

          {date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{date}</span>
            </div>
          )}

          {train && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {train.departure} - {train.arrival}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{train.name}</span>
                <Badge variant="secondary">{train.number}</Badge>
              </div>

              {train.class && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Class</span>
                  <Badge variant="outline">{train.class}</Badge>
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">GST (5%)</span>
            <span className="font-medium">₹{tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
