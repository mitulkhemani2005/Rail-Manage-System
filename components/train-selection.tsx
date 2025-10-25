"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Train {
  train_id: number
  route_id: number
  train_name: string
  train_number: string
  departure_time: string
  arrival_time: string
  duration_minutes: number
  source_station: string
  source_city: string
  destination_station: string
  destination_city: string
  pricing: {
    "AC 1": number
    "AC 2": number
    "AC 3": number
    Sleeper: number
  }
  ac_1_seats: number
  ac_2_seats: number
  ac_3_seats: number
  sleeper_seats: number
}

interface TrainSelectionProps {
  onSelect: (train: any) => void
  searchParams: {
    from: string
    to: string
    date: string
  }
}

export function TrainSelection({ onSelect, searchParams }: TrainSelectionProps) {
  const { toast } = useToast()
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrain, setSelectedTrain] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")

  const { from, to, date } = searchParams

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setLoading(true)
        console.log("[v0] Fetching trains for:", { from, to, date })

        const params = new URLSearchParams({ from, to, date })
        const response = await fetch(`/api/trains/search?${params.toString()}`)
        const data = await response.json()

        console.log("[v0] API response:", data)

        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          })
          setTrains([])
          return
        }

        console.log("[v0] Trains received:", data.trains?.length || 0)
        setTrains(data.trains || [])

        if (!data.trains || data.trains.length === 0) {
          toast({
            title: "No Trains Found",
            description: "No trains available for this route on the selected date. Try a different date or route.",
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching trains:", error)
        toast({
          title: "Error",
          description: "Failed to fetch trains. Please try again.",
          variant: "destructive",
        })
        setTrains([])
      } finally {
        setLoading(false)
      }
    }

    if (from && to && date) {
      fetchTrains()
    }
  }, [from, to, date, toast])

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getAvailableSeats = (train: Train, classType: string) => {
    switch (classType) {
      case "AC 1":
        return train.ac_1_seats
      case "AC 2":
        return train.ac_2_seats
      case "AC 3":
        return train.ac_3_seats
      case "Sleeper":
        return train.sleeper_seats
      default:
        return 0
    }
  }

  const handleContinue = () => {
    const train = trains.find((t) => `${t.train_id}-${t.route_id}` === selectedTrain)
    if (train && selectedClass) {
      const price = train.pricing[selectedClass as keyof typeof train.pricing]
      const seats = getAvailableSeats(train, selectedClass)

      onSelect({
        ...train,
        selectedClass,
        price,
        seatsAvailable: seats,
        departure: formatTime(train.departure_time),
        arrival: formatTime(train.arrival_time),
        duration: formatDuration(train.duration_minutes),
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (trains.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="font-semibold mb-2">No Trains Available</h3>
          <p className="text-muted-foreground mb-4">
            No trains found for the selected route and date.
            <br />
            Try searching for a different date or route.
          </p>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Search Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Train</CardTitle>
        <p className="text-sm text-muted-foreground">{trains.length} train(s) available</p>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedTrain} onValueChange={setSelectedTrain}>
          <div className="space-y-4">
            {trains.map((train) => (
              <div
                key={`${train.train_id}-${train.route_id}`}
                className={`relative rounded-lg border p-4 transition-all ${
                  selectedTrain === `${train.train_id}-${train.route_id}`
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem
                    value={`${train.train_id}-${train.route_id}`}
                    id={`${train.train_id}-${train.route_id}`}
                    className="mt-1"
                  />
                  <Label htmlFor={`${train.train_id}-${train.route_id}`} className="flex-1 cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{train.train_name}</h3>
                          <Badge variant="secondary">{train.train_number}</Badge>
                        </div>

                        <div className="grid gap-2 text-sm mb-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{formatTime(train.departure_time)}</span>
                            </div>
                            <span className="text-muted-foreground">→</span>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{formatTime(train.arrival_time)}</span>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {formatDuration(train.duration_minutes)}
                            </Badge>
                          </div>

                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">{train.source_station}</span>
                            <span className="mx-2">→</span>
                            <span className="font-medium text-foreground">{train.destination_station}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(train.pricing).map(([classType, price]) => {
                            const seats = getAvailableSeats(train, classType)
                            return (
                              <div
                                key={classType}
                                className="text-xs px-2 py-1 rounded-md bg-muted flex items-center gap-2"
                              >
                                <span className="font-medium">{classType}:</span>
                                <span className="text-primary font-semibold">₹{price}</span>
                                <span className="text-muted-foreground">({seats} seats)</span>
                              </div>
                            )
                          })}
                        </div>

                        {selectedTrain === `${train.train_id}-${train.route_id}` && (
                          <div className="mt-3 pt-3 border-t">
                            <Label className="text-sm mb-2 block font-semibold">Select Travel Class</Label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose your travel class" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(train.pricing).map(([classType, price]) => {
                                  const seats = getAvailableSeats(train, classType)
                                  return (
                                    <SelectItem key={classType} value={classType} disabled={seats === 0}>
                                      <div className="flex items-center justify-between gap-8 w-full">
                                        <span className="font-medium">{classType}</span>
                                        <div className="flex items-center gap-3 text-sm">
                                          <span className="text-primary font-semibold">₹{price}</span>
                                          <span className="text-muted-foreground">
                                            {seats > 0 ? `${seats} available` : "Sold out"}
                                          </span>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>

        <Button className="w-full mt-6" size="lg" disabled={!selectedTrain || !selectedClass} onClick={handleContinue}>
          Continue to Passenger Details
        </Button>
      </CardContent>
    </Card>
  )
}
