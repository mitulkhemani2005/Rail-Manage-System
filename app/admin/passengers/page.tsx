"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, Download, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Passenger {
  id: number
  full_name: string
  age: number
  gender: string
  seat_number: string
  class_type: string
  fare_amount: string
  booking_reference: string
  journey_date: string
  booking_status: string
  train_name: string
  train_number: string
  source_city: string
  destination_city: string
}

export default function AdminPassengersPage() {
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [filteredPassengers, setFilteredPassengers] = useState<Passenger[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchPassengers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = passengers.filter(
        (passenger) =>
          passenger.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          passenger.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          passenger.train_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          passenger.seat_number.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPassengers(filtered)
    } else {
      setFilteredPassengers(passengers)
    }
  }, [searchTerm, passengers])

  const fetchPassengers = async () => {
    try {
      const response = await fetch("/api/admin/passengers?limit=100")
      const data = await response.json()
      setPassengers(data.passengers || [])
      setFilteredPassengers(data.passengers || [])
    } catch (error) {
      console.error("[v0] Error fetching passengers:", error)
      toast({
        title: "Error",
        description: "Failed to fetch passengers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getGenderBadge = (gender: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {gender}
      </Badge>
    )
  }

  const exportToCSV = () => {
    const headers = ["Name", "Age", "Gender", "Class", "Seat", "Fare", "Booking Ref", "Train", "Route", "Date"]
    const rows = filteredPassengers.map((p) => [
      p.full_name,
      p.age,
      p.gender,
      p.class_type,
      p.seat_number,
      `₹${p.fare_amount}`,
      p.booking_reference,
      `${p.train_name} (${p.train_number})`,
      `${p.source_city} → ${p.destination_city}`,
      new Date(p.journey_date).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `passengers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Passengers Management</h1>
            <p className="mt-2 text-muted-foreground">View all passenger details and bookings</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Passengers ({filteredPassengers.length})</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search passengers..."
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
              ) : filteredPassengers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No passengers found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Passenger Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Seat Number</TableHead>
                        <TableHead>Fare</TableHead>
                        <TableHead>Booking Ref</TableHead>
                        <TableHead>Train</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Journey Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPassengers.map((passenger) => (
                        <TableRow key={passenger.id}>
                          <TableCell className="font-medium">{passenger.full_name}</TableCell>
                          <TableCell>{passenger.age}</TableCell>
                          <TableCell>{getGenderBadge(passenger.gender)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{passenger.class_type}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{passenger.seat_number}</TableCell>
                          <TableCell className="font-medium">₹{passenger.fare_amount}</TableCell>
                          <TableCell className="font-mono text-sm">{passenger.booking_reference}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{passenger.train_name}</p>
                              <p className="text-xs text-muted-foreground">{passenger.train_number}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {passenger.source_city} → {passenger.destination_city}
                          </TableCell>
                          <TableCell>{new Date(passenger.journey_date).toLocaleDateString()}</TableCell>
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
