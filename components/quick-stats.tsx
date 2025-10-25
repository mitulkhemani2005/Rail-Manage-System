import { Train, Users, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function QuickStats() {
  const stats = [
    {
      icon: Train,
      label: "Active Trains",
      value: "245",
      trend: "+12%",
    },
    {
      icon: Users,
      label: "Daily Passengers",
      value: "15.2K",
      trend: "+8%",
    },
    {
      icon: Clock,
      label: "On-Time Rate",
      value: "94.5%",
      trend: "+2.3%",
    },
    {
      icon: TrendingUp,
      label: "Revenue Today",
      value: "₹34.2L",
      trend: "+15%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-accent">{stat.trend}</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
