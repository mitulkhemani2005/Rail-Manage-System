"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ScheduleFilters } from "@/components/schedule-filters"
import { ScheduleTable } from "@/components/schedule-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Train, Clock, AlertCircle, Loader2 } from "lucide-react"

export default function SchedulesPage() {
  const [filters, setFilters] = useState({ search: "", route: "all", status: "all" })
  const [stats, setStats] = useState({
    totalTrains: 0,
    onTimeCount: 0,
    delayedCount: 0,
    onTimePercentage: "0",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/schedules")
      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Train Schedules</h1>
          <p className="mt-2 text-muted-foreground">View real-time train schedules and track status</p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Trains Today</CardTitle>
              <Train className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalTrains}</div>
                  <p className="text-xs text-muted-foreground">Active trains</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">On Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.onTimePercentage}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.onTimeCount} of {stats.totalTrains} trains
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Delays</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.delayedCount}</div>
                  <p className="text-xs text-muted-foreground">Delayed trains</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ScheduleFilters onFilterChange={setFilters} />
          <ScheduleTable filters={filters} />
        </div>
      </main>
    </div>
  )
}
