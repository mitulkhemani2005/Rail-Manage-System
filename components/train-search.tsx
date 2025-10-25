"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, MapPin, ArrowRightLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Station {
  id: number
  name: string
  city: string
  code: string
}

export function TrainSearch() {
  const router = useRouter()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(false)
  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/stations")
        const data = await response.json()
        setStations(data.stations || [])
      } catch (error) {
        console.error("[v0] Error fetching stations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [])

  const handleSwap = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const handleSearch = () => {
    if (from && to && date) {
      const params = new URLSearchParams({
        from,
        to,
        date,
      })
      router.push(`/booking?${params.toString()}`)
    }
  }

  const getStationDisplay = (stationName: string) => {
    const station = stations.find((s) => s.city === stationName || s.name === stationName)
    return station ? `${station.city} (${station.code})` : stationName
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr,1fr,auto]">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Popover open={openFrom} onOpenChange={setOpenFrom}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openFrom}
                  className="w-full justify-between font-normal bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(!from && "text-muted-foreground")}>
                      {from ? getStationDisplay(from) : "Select departure station"}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search station..." />
                  <CommandList>
                    <CommandEmpty>No station found.</CommandEmpty>
                    <CommandGroup>
                      {stations.map((station) => (
                        <CommandItem
                          key={station.id}
                          value={station.city}
                          onSelect={() => {
                            setFrom(station.city)
                            setOpenFrom(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", from === station.city ? "opacity-100" : "opacity-0")} />
                          <div className="flex flex-col">
                            <span className="font-medium">{station.city}</span>
                            <span className="text-xs text-muted-foreground">
                              {station.name} ({station.code})
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end pb-2">
            <Button variant="ghost" size="icon" onClick={handleSwap} className="h-10 w-10">
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Popover open={openTo} onOpenChange={setOpenTo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTo}
                  className="w-full justify-between font-normal bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(!to && "text-muted-foreground")}>
                      {to ? getStationDisplay(to) : "Select arrival station"}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search station..." />
                  <CommandList>
                    <CommandEmpty>No station found.</CommandEmpty>
                    <CommandGroup>
                      {stations.map((station) => (
                        <CommandItem
                          key={station.id}
                          value={station.city}
                          onSelect={() => {
                            setTo(station.city)
                            setOpenTo(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", to === station.city ? "opacity-100" : "opacity-0")} />
                          <div className="flex flex-col">
                            <span className="font-medium">{station.city}</span>
                            <span className="text-xs text-muted-foreground">
                              {station.name} ({station.code})
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-9"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              className="w-full md:w-auto"
              size="lg"
              onClick={handleSearch}
              disabled={!from || !to || !date || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Trains
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
