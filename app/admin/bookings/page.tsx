"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: number
  booking_reference: string
  journey_date: string
  final_amount: number
  booking_status: string
  created_at: string
  train_name: string
  train_number: string
  source_city: string
  destination_city: string
  passenger_name: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = bookings.filter(
        (booking) =>
          booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.passenger_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.train_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.train_number.includes(searchTerm),
      )
      setFilteredBookings(filtered)
    } else {
      setFilteredBookings(bookings)
    }
  }, [searchTerm, bookings])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings?limit=100")
      const data = await response.json()
      setBookings(data.bookings || [])
      setFilteredBookings(data.bookings || [])
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
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const exportToCSV = () => {
    const headers = ["Booking Ref", "Passenger", "Train", "Route", "Date", "Amount", "Status"]
    const rows = filteredBookings.map((b) => [
      b.booking_reference,
      b.passenger_name || "Guest",
      `${b.train_name} (${b.train_number})`,
      `${b.source_city} → ${b.destination_city}`,
      new Date(b.journey_date).toLocaleDateString(),
      b.final_amount,
      b.booking_status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Bookings Management</h1>
            <p className="mt-2 text-muted-foreground">View and manage all train bookings</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-[300px]"
                    />
                  </div>
                  <Button onClick={exportToCSV} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No bookings found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking Ref</TableHead>
                        <TableHead>Passenger</TableHead>
                        <TableHead>Train</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Journey Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Booked On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-sm">{booking.booking_reference}</TableCell>
                          <TableCell>{booking.passenger_name || "Guest"}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.train_name}</p>
                              <p className="text-xs text-muted-foreground">{booking.train_number}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.source_city} → {booking.destination_city}
                          </TableCell>
                          <TableCell>{new Date(booking.journey_date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">₹{booking.final_amount.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(booking.booking_status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
