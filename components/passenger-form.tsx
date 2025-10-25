"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface Passenger {
  id: string
  name: string
  age: string
  gender: string
  seatPreference: string
}

export function PassengerForm({ onSubmit }: { onSubmit: (passengers: Passenger[]) => void }) {
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: "1", name: "", age: "", gender: "", seatPreference: "" },
  ])

  const addPassenger = () => {
    setPassengers([...passengers, { id: Date.now().toString(), name: "", age: "", gender: "", seatPreference: "" }])
  }

  const removePassenger = (id: string) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((p) => p.id !== id))
    }
  }

  const updatePassenger = (id: string, field: keyof Passenger, value: string) => {
    setPassengers(passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleSubmit = () => {
    onSubmit(passengers)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Passenger Details</CardTitle>
          <Button variant="outline" size="sm" onClick={addPassenger}>
            <Plus className="h-4 w-4 mr-2" />
            Add Passenger
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Passenger {index + 1}</h3>
                {passengers.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removePassenger(passenger.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`name-${passenger.id}`}>Full Name</Label>
                  <Input
                    id={`name-${passenger.id}`}
                    placeholder="Enter full name"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(passenger.id, "name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`age-${passenger.id}`}>Age</Label>
                  <Input
                    id={`age-${passenger.id}`}
                    type="number"
                    placeholder="Enter age"
                    value={passenger.age}
                    onChange={(e) => updatePassenger(passenger.id, "age", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`gender-${passenger.id}`}>Gender</Label>
                  <Select
                    value={passenger.gender}
                    onValueChange={(value) => updatePassenger(passenger.id, "gender", value)}
                  >
                    <SelectTrigger id={`gender-${passenger.id}`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`seat-${passenger.id}`}>Seat Preference</Label>
                  <Select
                    value={passenger.seatPreference}
                    onValueChange={(value) => updatePassenger(passenger.id, "seatPreference", value)}
                  >
                    <SelectTrigger id={`seat-${passenger.id}`}>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="window">Window</SelectItem>
                      <SelectItem value="aisle">Aisle</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-6" size="lg" onClick={handleSubmit}>
          Continue to Payment
        </Button>
      </CardContent>
    </Card>
  )
}
