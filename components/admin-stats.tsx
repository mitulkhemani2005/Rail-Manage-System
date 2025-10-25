"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Train, Users, DollarSign, TrendingUp, ArrowUp, ArrowDown, Loader2 } from "lucide-react"

interface Stats {
  totalRevenue: number
  revenueChange: string
  activeTrains: number
  totalBookings: number
  bookingsChange: string
  passengersToday: number
  passengersChange: string
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) return null

  const formatRevenue = (amount: number) => {
    const lakhs = amount / 100000
    return `₹${lakhs.toFixed(1)}L`
  }

  const statsData = [
    {
      title: "Total Revenue",
      value: formatRevenue(stats.totalRevenue),
      change: `${stats.revenueChange}%`,
      trend: Number.parseFloat(stats.revenueChange) >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Active Trains",
      value: stats.activeTrains.toString(),
      change: "Fleet size",
      trend: "up",
      icon: Train,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      change: `${stats.bookingsChange}%`,
      trend: Number.parseFloat(stats.bookingsChange) >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      title: "Passengers Today",
      value: stats.passengersToday.toLocaleString(),
      change: `${stats.passengersChange}%`,
      trend: Number.parseFloat(stats.passengersChange) >= 0 ? "up" : "down",
      icon: Users,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {stat.trend === "up" ? (
                <ArrowUp className="h-3 w-3 text-accent" />
              ) : (
                <ArrowDown className="h-3 w-3 text-destructive" />
              )}
              <span className={stat.trend === "up" ? "text-accent" : "text-destructive"}>{stat.change}</span>
              {stat.title !== "Active Trains" && <span>from last month</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
