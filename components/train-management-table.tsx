"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Train {
  id: number
  train_number: string
  train_name: string
  train_type: string
  total_seats: number
  ac_1_seats: number
  ac_2_seats: number
  ac_3_seats: number
  sleeper_seats: number
  general_seats: number
  status: string
  route_count: number
}

export function TrainManagementTable() {
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTrain, setEditingTrain] = useState<Train | null>(null)
  const [formData, setFormData] = useState({
    trainNumber: "",
    trainName: "",
    trainType: "Express",
    totalSeats: "",
    ac1Seats: "",
    ac2Seats: "",
    ac3Seats: "",
    sleeperSeats: "",
    generalSeats: "",
    status: "Active",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchTrains()
  }, [])

  const fetchTrains = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/trains")
      const data = await response.json()
      setTrains(data.trains)
    } catch (error) {
      console.error("[v0] Error fetching trains:", error)
      toast({
        title: "Error",
        description: "Failed to fetch trains",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddTrain = async () => {
    try {
      if (!formData.trainNumber || !formData.trainName || !formData.totalSeats) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const classSeatsTotal =
        (Number.parseInt(formData.ac1Seats) || 0) +
        (Number.parseInt(formData.ac2Seats) || 0) +
        (Number.parseInt(formData.ac3Seats) || 0) +
        (Number.parseInt(formData.sleeperSeats) || 0) +
        (Number.parseInt(formData.generalSeats) || 0)

      if (classSeatsTotal !== Number.parseInt(formData.totalSeats)) {
        toast({
          title: "Validation Error",
          description: `Class seats (${classSeatsTotal}) must equal total seats (${formData.totalSeats})`,
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/admin/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Train added successfully",
        })
        setIsAddDialogOpen(false)
        setFormData({
          trainNumber: "",
          trainName: "",
          trainType: "Express",
          totalSeats: "",
          ac1Seats: "",
          ac2Seats: "",
          ac3Seats: "",
          sleeperSeats: "",
          generalSeats: "",
          status: "Active",
        })
        fetchTrains()
      } else {
        throw new Error(data.error || "Failed to add train")
      }
    } catch (error: any) {
      console.error("[v0] Error adding train:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add train",
        variant: "destructive",
      })
    }
  }

  const handleEditTrain = async () => {
    if (!editingTrain) return

    try {
      if (!formData.trainNumber || !formData.trainName || !formData.totalSeats) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const classSeatsTotal =
        (Number.parseInt(formData.ac1Seats) || 0) +
        (Number.parseInt(formData.ac2Seats) || 0) +
        (Number.parseInt(formData.ac3Seats) || 0) +
        (Number.parseInt(formData.sleeperSeats) || 0) +
        (Number.parseInt(formData.generalSeats) || 0)

      if (classSeatsTotal !== Number.parseInt(formData.totalSeats)) {
        toast({
          title: "Validation Error",
          description: `Class seats (${classSeatsTotal}) must equal total seats (${formData.totalSeats})`,
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/admin/trains/${editingTrain.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Train updated successfully",
        })
        setIsEditDialogOpen(false)
        setEditingTrain(null)
        fetchTrains()
      } else {
        throw new Error(data.error || "Failed to update train")
      }
    } catch (error: any) {
      console.error("[v0] Error updating train:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update train",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTrain = async (id: number) => {
    if (!confirm("Are you sure you want to delete this train?")) return

    try {
      const response = await fetch(`/api/admin/trains/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Train deleted successfully",
        })
        fetchTrains()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete train",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error deleting train:", error)
      toast({
        title: "Error",
        description: "Failed to delete train",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (train: Train) => {
    setEditingTrain(train)
    setFormData({
      trainNumber: train.train_number,
      trainName: train.train_name,
      trainType: train.train_type,
      totalSeats: train.total_seats.toString(),
      ac1Seats: train.ac_1_seats.toString(),
      ac2Seats: train.ac_2_seats.toString(),
      ac3Seats: train.ac_3_seats.toString(),
      sleeperSeats: train.sleeper_seats.toString(),
      generalSeats: train.general_seats.toString(),
      status: train.status,
    })
    setIsEditDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            Active
          </Badge>
        )
      case "Maintenance":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            Maintenance
          </Badge>
        )
      case "Inactive":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
            Inactive
          </Badge>
        )
    }
  }

  const TrainFormFields = () => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="train-number">Train Number *</Label>
          <Input
            id="train-number"
            placeholder="12345"
            value={formData.trainNumber}
            onChange={(e) => setFormData({ ...formData, trainNumber: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="train-name">Train Name *</Label>
          <Input
            id="train-name"
            placeholder="Rajdhani Express"
            value={formData.trainName}
            onChange={(e) => setFormData({ ...formData, trainName: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="train-type">Train Type</Label>
          <Select value={formData.trainType} onValueChange={(value) => setFormData({ ...formData, trainType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Express">Express</SelectItem>
              <SelectItem value="Superfast">Superfast</SelectItem>
              <SelectItem value="Mail">Mail</SelectItem>
              <SelectItem value="Passenger">Passenger</SelectItem>
              <SelectItem value="Duronto">Duronto</SelectItem>
              <SelectItem value="Shatabdi">Shatabdi</SelectItem>
              <SelectItem value="Rajdhani">Rajdhani</SelectItem>
              <SelectItem value="Vande Bharat">Vande Bharat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total-seats">Total Seats *</Label>
        <Input
          id="total-seats"
          type="number"
          placeholder="1000"
          value={formData.totalSeats}
          onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Class-wise Seat Allocation</Label>
        <p className="text-sm text-muted-foreground">Allocate seats across different travel classes</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ac1-seats" className="text-sm">
              AC 1 Tier
            </Label>
            <Input
              id="ac1-seats"
              type="number"
              placeholder="0"
              value={formData.ac1Seats}
              onChange={(e) => setFormData({ ...formData, ac1Seats: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ac2-seats" className="text-sm">
              AC 2 Tier
            </Label>
            <Input
              id="ac2-seats"
              type="number"
              placeholder="0"
              value={formData.ac2Seats}
              onChange={(e) => setFormData({ ...formData, ac2Seats: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ac3-seats" className="text-sm">
              AC 3 Tier
            </Label>
            <Input
              id="ac3-seats"
              type="number"
              placeholder="0"
              value={formData.ac3Seats}
              onChange={(e) => setFormData({ ...formData, ac3Seats: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sleeper-seats" className="text-sm">
              Sleeper
            </Label>
            <Input
              id="sleeper-seats"
              type="number"
              placeholder="0"
              value={formData.sleeperSeats}
              onChange={(e) => setFormData({ ...formData, sleeperSeats: e.target.value })}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="general-seats" className="text-sm">
              General
            </Label>
            <Input
              id="general-seats"
              type="number"
              placeholder="0"
              value={formData.generalSeats}
              onChange={(e) => setFormData({ ...formData, generalSeats: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm font-medium">
            Total Allocated:{" "}
            {(Number.parseInt(formData.ac1Seats) || 0) +
              (Number.parseInt(formData.ac2Seats) || 0) +
              (Number.parseInt(formData.ac3Seats) || 0) +
              (Number.parseInt(formData.sleeperSeats) || 0) +
              (Number.parseInt(formData.generalSeats) || 0)}{" "}
            / {formData.totalSeats || 0} seats
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Train Fleet</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Train
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Train</DialogTitle>
                <DialogDescription>
                  Enter the details of the new train including class-wise seat allocation.
                </DialogDescription>
              </DialogHeader>
              <TrainFormFields />
              <Button className="w-full" onClick={handleAddTrain}>
                Add Train
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Train</DialogTitle>
                <DialogDescription>Update the train details and class-wise seat allocation.</DialogDescription>
              </DialogHeader>
              <TrainFormFields />
              <Button className="w-full" onClick={handleEditTrain}>
                Update Train
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train Number</TableHead>
                <TableHead>Train Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total Seats</TableHead>
                <TableHead>Class Distribution</TableHead>
                <TableHead>Routes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trains.map((train) => (
                <TableRow key={train.id}>
                  <TableCell className="font-medium">{train.train_number}</TableCell>
                  <TableCell>{train.train_name}</TableCell>
                  <TableCell>{train.train_type}</TableCell>
                  <TableCell>{train.total_seats}</TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      {train.ac_1_seats > 0 && <div>AC1: {train.ac_1_seats}</div>}
                      {train.ac_2_seats > 0 && <div>AC2: {train.ac_2_seats}</div>}
                      {train.ac_3_seats > 0 && <div>AC3: {train.ac_3_seats}</div>}
                      {train.sleeper_seats > 0 && <div>SL: {train.sleeper_seats}</div>}
                      {train.general_seats > 0 && <div>GEN: {train.general_seats}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{train.route_count}</TableCell>
                  <TableCell>{getStatusBadge(train.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(train)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTrain(train.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
