"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Schedule {
  id: number
  train_id: number
  train_number: string
  train_name: string
  source_station: string
  source_code: string
  destination_station: string
  destination_code: string
  departure_time: string
  arrival_time: string
  duration_minutes: number
  distance_km: number
  days_of_operation: string
  ac_1_price: number
  ac_2_price: number
  ac_3_price: number
  sleeper_price: number
  general_price: number
}

interface Train {
  id: number
  train_number: string
  train_name: string
}

interface Station {
  id: number
  name: string
  code: string
}

export function ScheduleManagementTable() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [trains, setTrains] = useState<Train[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    train_id: "",
    source_station_id: "",
    destination_station_id: "",
    departure_time: "",
    arrival_time: "",
    duration_minutes: "",
    distance_km: "",
    days_of_operation: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    ac_1_price: "",
    ac_2_price: "",
    ac_3_price: "",
    sleeper_price: "",
    general_price: "",
  })

  useEffect(() => {
    fetchSchedules()
    fetchTrains()
    fetchStations()
  }, [])

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/admin/schedules")
      const data = await response.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch schedules", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchTrains = async () => {
    try {
      const response = await fetch("/api/admin/trains")
      const data = await response.json()
      setTrains(data.trains || [])
    } catch (error) {
      console.error("Failed to fetch trains:", error)
    }
  }

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/stations")
      const data = await response.json()
      setStations(data.stations || [])
    } catch (error) {
      console.error("Failed to fetch stations:", error)
    }
  }

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/admin/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add schedule")
      }

      toast({ title: "Success", description: "Schedule added successfully" })
      setIsAddDialogOpen(false)
      resetForm()
      fetchSchedules()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleEdit = async () => {
    if (!editingSchedule) return

    try {
      const response = await fetch(`/api/admin/schedules/${editingSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update schedule")
      }

      toast({ title: "Success", description: "Schedule updated successfully" })
      setIsEditDialogOpen(false)
      setEditingSchedule(null)
      resetForm()
      fetchSchedules()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return

    try {
      const response = await fetch(`/api/admin/schedules/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete schedule")
      }

      toast({ title: "Success", description: "Schedule deleted successfully" })
      fetchSchedules()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const openEditDialog = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      train_id: schedule.train_id.toString(),
      source_station_id: "",
      destination_station_id: "",
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      duration_minutes: schedule.duration_minutes.toString(),
      distance_km: schedule.distance_km.toString(),
      days_of_operation: schedule.days_of_operation,
      ac_1_price: schedule.ac_1_price.toString(),
      ac_2_price: schedule.ac_2_price.toString(),
      ac_3_price: schedule.ac_3_price.toString(),
      sleeper_price: schedule.sleeper_price.toString(),
      general_price: schedule.general_price.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      train_id: "",
      source_station_id: "",
      destination_station_id: "",
      departure_time: "",
      arrival_time: "",
      duration_minutes: "",
      distance_km: "",
      days_of_operation: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
      ac_1_price: "",
      ac_2_price: "",
      ac_3_price: "",
      sleeper_price: "",
      general_price: "",
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading schedules...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Days</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{schedule.train_name}</div>
                    <div className="text-sm text-muted-foreground">{schedule.train_number}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{schedule.source_station}</div>
                    <div className="text-sm text-muted-foreground">to {schedule.destination_station}</div>
                  </div>
                </TableCell>
                <TableCell>{schedule.departure_time}</TableCell>
                <TableCell>{schedule.arrival_time}</TableCell>
                <TableCell>{formatDuration(schedule.duration_minutes)}</TableCell>
                <TableCell>{schedule.distance_km} km</TableCell>
                <TableCell>
                  <div className="text-xs">{schedule.days_of_operation}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(schedule)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(schedule.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Schedule</DialogTitle>
            <DialogDescription>Create a new train schedule/route with pricing for each class</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="train">Train</Label>
              <Select
                value={formData.train_id}
                onValueChange={(value) => setFormData({ ...formData, train_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select train" />
                </SelectTrigger>
                <SelectContent>
                  {trains.map((train) => (
                    <SelectItem key={train.id} value={train.id.toString()}>
                      {train.train_number} - {train.train_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="source">Source Station</Label>
                <Select
                  value={formData.source_station_id}
                  onValueChange={(value) => setFormData({ ...formData, source_station_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id.toString()}>
                        {station.name} ({station.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination Station</Label>
                <Select
                  value={formData.destination_station_id}
                  onValueChange={(value) => setFormData({ ...formData, destination_station_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id.toString()}>
                        {station.name} ({station.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="departure">Departure Time</Label>
                <Input
                  id="departure"
                  type="time"
                  value={formData.departure_time}
                  onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="arrival">Arrival Time</Label>
                <Input
                  id="arrival"
                  type="time"
                  value={formData.arrival_time}
                  onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.01"
                  value={formData.distance_km}
                  onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="days">Days of Operation</Label>
              <Input
                id="days"
                placeholder="Mon,Tue,Wed,Thu,Fri,Sat,Sun"
                value={formData.days_of_operation}
                onChange={(e) => setFormData({ ...formData, days_of_operation: e.target.value })}
              />
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div>
                <Label className="text-base font-semibold">Class-wise Pricing (₹)</Label>
                <p className="text-sm text-muted-foreground">Set base fare for each travel class</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ac1-price">AC 1 Tier</Label>
                  <Input
                    id="ac1-price"
                    type="number"
                    placeholder="2500"
                    value={formData.ac_1_price}
                    onChange={(e) => setFormData({ ...formData, ac_1_price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ac2-price">AC 2 Tier</Label>
                  <Input
                    id="ac2-price"
                    type="number"
                    placeholder="1800"
                    value={formData.ac_2_price}
                    onChange={(e) => setFormData({ ...formData, ac_2_price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ac3-price">AC 3 Tier</Label>
                  <Input
                    id="ac3-price"
                    type="number"
                    placeholder="1200"
                    value={formData.ac_3_price}
                    onChange={(e) => setFormData({ ...formData, ac_3_price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sleeper-price">Sleeper</Label>
                  <Input
                    id="sleeper-price"
                    type="number"
                    placeholder="600"
                    value={formData.sleeper_price}
                    onChange={(e) => setFormData({ ...formData, sleeper_price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="general-price">General</Label>
                  <Input
                    id="general-price"
                    type="number"
                    placeholder="300"
                    value={formData.general_price}
                    onChange={(e) => setFormData({ ...formData, general_price: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>Update schedule details with pricing for each class</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="train">Train</Label>
              <Select
                value={formData.train_id}
                onValueChange={(value) => setFormData({ ...formData, train_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select train" />
                </SelectTrigger>
                <SelectContent>
                  {trains.map((train) => (
                    <SelectItem key={train.id} value={train.id.toString()}>
                      {train.train_number} - {train.train_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="source">Source Station</Label>
                <Select
                  value={formData.source_station_id}
                  onValueChange={(value) => setFormData({ ...formData, source_station_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id.toString()}>
                        {station.name} ({station.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination Station</Label>
                <Select
                  value={formData.destination_station_id}
                  onValueChange={(value) => setFormData({ ...formData, destination_station_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id.toString()}>
                        {station.name} ({station.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="departure">Departure Time</Label>
                <Input
                  id="departure"
                  type="time"
                  value={formData.departure_time}
                  onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="arrival">Arrival Time</Label>
                <Input
                  id="arrival"
                  type="time"
                  value={formData.arrival_time}
                  onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.01"
                  value={formData.distance_km}
                  onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="days">Days of Operation</Label>
              <Input
                id="days"
                placeholder="Mon,Tue,Wed,Thu,Fri,Sat,Sun"
                value={formData.days_of_operation}
                onChange={(e) => setFormData({ ...formData, days_of_operation: e.target.value })}
              />
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div>
                <Label className="text-base font-semibold">Class-wise Pricing (₹)</Label>
                <p className="text-sm text-muted-foreground">Set base fare for each travel class</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ac1-price">AC 1 Tier</Label>
                  <Input
                    id="ac1-price"
                    type="number"
                    placeholder="2500"
                    value={formData.ac_1_price}
                    onChange={(e) => setFormData({ ...formData, ac_1_price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ac2-price">AC 2 Tier</Label>
                  <Input
                    id="ac2-price"
                    type="number"
                    placeholder="1800"
                    value={formData.ac_2_price}
                    onChange={(e) => setFormData({ ...formData, ac_2_price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ac3-price">AC 3 Tier</Label>
                  <Input
                    id="ac3-price"
                    type="number"
                    placeholder="1200"
                    value={formData.ac_3_price}
                    onChange={(e) => setFormData({ ...formData, ac_3_price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sleeper-price">Sleeper</Label>
                  <Input
                    id="sleeper-price"
                    type="number"
                    placeholder="600"
                    value={formData.sleeper_price}
                    onChange={(e) => setFormData({ ...formData, sleeper_price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="general-price">General</Label>
                  <Input
                    id="general-price"
                    type="number"
                    placeholder="300"
                    value={formData.general_price}
                    onChange={(e) => setFormData({ ...formData, general_price: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
