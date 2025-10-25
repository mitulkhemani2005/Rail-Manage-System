import { Header } from "@/components/header"
import { TrainSearch } from "@/components/train-search"
import { QuickStats } from "@/components/quick-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, ArrowRight } from "lucide-react"

export default function HomePage() {
  const popularRoutes = [
    { from: "Mumbai", to: "Delhi", duration: "16h 30m", price: "₹1,450" },
    { from: "Bangalore", to: "Chennai", duration: "5h 45m", price: "₹850" },
    { from: "Delhi", to: "Jaipur", duration: "4h 30m", price: "₹650" },
    { from: "Kolkata", to: "Varanasi", duration: "12h 15m", price: "₹980" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4" variant="secondary">
                Trusted by millions of travelers
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                Your Journey Starts Here
              </h1>
              <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl">
                Book train tickets across India with ease. Fast, reliable, and affordable travel solutions.
              </p>
            </div>

            <div className="mx-auto max-w-5xl mt-12">
              <TrainSearch />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <QuickStats />
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-balance">Popular Routes</h2>
              <p className="mt-2 text-muted-foreground">Frequently traveled destinations with great connections</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {popularRoutes.map((route, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{route.from}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="font-semibold">{route.to}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{route.duration}</span>
                      </div>
                      <div className="text-lg font-bold text-primary">{route.price}</div>
                    </div>
                    <Button className="w-full mt-4 bg-transparent" variant="outline">
                      View Trains
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-balance">Why Choose RailwayMS</h2>
              <p className="mt-2 text-muted-foreground">Experience the best in railway travel management</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Easy Booking</CardTitle>
                  <CardDescription>Book your tickets in just a few clicks with our intuitive interface</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Updates</CardTitle>
                  <CardDescription>
                    Get instant notifications about train schedules and platform changes
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Secure Payments</CardTitle>
                  <CardDescription>Your transactions are protected with industry-standard encryption</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 RailwayMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
