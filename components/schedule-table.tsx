"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, MapPin, Info, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Train {
  id: number
  train_name: string
  train_number: string
  train_type: string
  departure_station_name: string
  departure_city: string
  arrival_station_name: string
  arrival_city: string
  departure_time: string
  arrival_time: string
  duration_minutes: number
  status: "on-time" | "delayed" | "cancelled"
  platform_number: string
}

interface ScheduleTableProps {
  filters: {
    search: string
    route: string
    status: string
  }
}

export function ScheduleTable({ filters }: ScheduleTableProps) {
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSchedules()
  }, [filters])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.route) params.append("route", filters.route)
      if (filters.status) params.append("status", filters.status)

      const response = await fetch(`/api/schedules?${params}`)
      if (!response.ok) throw new Error("Failed to fetch schedules")

      const data = await response.json()
      setTrains(data.schedules || [])
    } catch (error) {
      console.error("[v0] Error fetching schedules:", error)
      toast({
        title: "Error",
        description: "Failed to load train schedules",
        variant: "destructive",
      })
      setTrains([])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time: string) => {
    const date = new Date(`2000-01-01T${time}`)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getStatusBadge = (status: Train["status"]) => {
    switch (status) {
      case "on-time":
        return (
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            On Time
          </Badge>
        )
      case "delayed":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            Delayed
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {trains.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No trains found matching your filters</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Train</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trains.map((train) => (
                  <TableRow key={train.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{train.train_name}</div>
                        <div className="text-sm text-muted-foreground">{train.train_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span className="text-sm">{train.departure_city}</span>
                        </div>
                        <span className="text-muted-foreground">→</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-accent" />
                          <span className="text-sm">{train.arrival_city}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(train.departure_time)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(train.arrival_time)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDuration(train.duration_minutes)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{train.platform_number}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(train.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
