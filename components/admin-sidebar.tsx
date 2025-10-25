"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Train, LayoutDashboard, Calendar, Users, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/trains", label: "Manage Trains", icon: Train },
    { href: "/admin/schedules", label: "Schedules", icon: Calendar },
    { href: "/admin/bookings", label: "Bookings", icon: Ticket },
    { href: "/admin/passengers", label: "Passengers", icon: Users },
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
