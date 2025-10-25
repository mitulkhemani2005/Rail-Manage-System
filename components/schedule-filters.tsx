"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface ScheduleFiltersProps {
  onFilterChange: (filters: { search: string; route: string; status: string }) => void
}

export function ScheduleFilters({ onFilterChange }: ScheduleFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [route, setRoute] = useState("all")
  const [status, setStatus] = useState("all")

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFilterChange({ search: value, route, status })
  }

  const handleRouteChange = (value: string) => {
    setRoute(value)
    onFilterChange({ search: searchTerm, route: value, status })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFilterChange({ search: searchTerm, route, status: value })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-[1fr,200px,200px,auto]">
          <div className="space-y-2">
            <Label htmlFor="search">Search Train</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Train number or name"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="route">Route</Label>
            <Select value={route} onValueChange={handleRouteChange}>
              <SelectTrigger id="route">
                <SelectValue placeholder="All routes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All routes</SelectItem>
                <SelectItem value="north">Northern</SelectItem>
                <SelectItem value="south">Southern</SelectItem>
                <SelectItem value="east">Eastern</SelectItem>
                <SelectItem value="west">Western</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="on-time">On Time</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
