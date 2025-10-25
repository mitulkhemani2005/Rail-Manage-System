"use client"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { TrainSelection } from "@/components/train-selection"
import { PassengerForm } from "@/components/passenger-form"
import { BookingSummary } from "@/components/booking-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Loader2, MapPin, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function BookingContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [selectedTrain, setSelectedTrain] = useState<any>(null)
  const [passengers, setPassengers] = useState<any[]>([])
  const [bookingId, setBookingId] = useState<string>("")
  const [processing, setProcessing] = useState(false)

  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || ""

  useEffect(() => {
    if (!from || !to || !date) {
      toast({
        title: "Missing Information",
        description: "Please search for trains from the home page first.",
        variant: "destructive",
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    }
  }, [from, to, date, toast])

  const handleTrainSelect = (train: any) => {
    console.log("[v0] Selected train:", train)
    setSelectedTrain(train)
    setStep(2)
  }

  const handlePassengerSubmit = (passengerData: any[]) => {
    console.log("[v0] Passenger data:", passengerData)
    setPassengers(passengerData)
    setStep(3)
  }

  const handlePayment = async () => {
    try {
      setProcessing(true)

      if (!selectedTrain || !selectedTrain.route_id || !selectedTrain.train_id) {
        toast({
          title: "Error",
          description: "Missing train information. Please select a train again.",
          variant: "destructive",
        })
        setStep(1)
        return
      }

      if (passengers.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one passenger.",
          variant: "destructive",
        })
        setStep(2)
        return
      }

      const totalAmount = selectedTrain.price * passengers.length
      const gstAmount = totalAmount * 0.05
      const finalAmount = totalAmount + gstAmount

      const bookingData = {
        userId: 1, // TODO: Replace with actual user ID from auth
        routeId: selectedTrain.route_id,
        trainId: selectedTrain.train_id,
        journeyDate: date,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: Number.parseInt(p.age),
          gender: p.gender,
          classType: selectedTrain.selectedClass,
          fare: selectedTrain.price,
        })),
        totalAmount,
        gstAmount,
        finalAmount,
        paymentMethod: "Card",
      }

      console.log("[v0] Creating booking:", bookingData)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()
      console.log("[v0] Booking response:", data)

      if (data.error || !data.success) {
        toast({
          title: "Booking Failed",
          description: data.error || data.details || "Unknown error occurred",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Booking created successfully:", data)
      setBookingId(data.bookingReference)
      setStep(4)

      toast({
        title: "Booking Confirmed",
        description: `Your booking ${data.bookingReference} has been confirmed!`,
      })
    } catch (error) {
      console.error("[v0] Error creating booking:", error)
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (!from || !to || !date) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">
                Please search for trains from the home page to start booking.
              </p>
              <Button onClick={() => (window.location.href = "/")}>Go to Home</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span className="font-medium text-foreground">{from}</span>
            <span>→</span>
            <span className="font-medium text-foreground">{to}</span>
            <span>•</span>
            <Calendar className="h-4 w-4 ml-2" />
            <span>{new Date(date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Book Your Ticket</h1>
          <p className="mt-2 text-muted-foreground">Complete your booking in a few simple steps</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: "Select Train" },
              { num: 2, label: "Passenger Details" },
              { num: 3, label: "Payment" },
              { num: 4, label: "Confirmation" },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      step >= s.num
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                  </div>
                  <span className="mt-2 text-xs font-medium hidden sm:block">{s.label}</span>
                </div>
                {index < 3 && (
                  <div
                    className={`h-0.5 flex-1 ${step > s.num ? "bg-primary" : "bg-border"}`}
                    style={{ marginTop: "-20px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          <div>
            {step === 1 && <TrainSelection onSelect={handleTrainSelect} searchParams={{ from, to, date }} />}

            {step === 2 && <PassengerForm onSubmit={handlePassengerSubmit} />}

            {step === 3 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-2">Payment integration would go here</p>
                      <p className="text-sm">
                        This is a demo interface. In production, integrate with payment gateways like Stripe or
                        Razorpay.
                      </p>
                    </div>
                    <Button className="w-full" size="lg" onClick={handlePayment} disabled={processing}>
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Complete Payment"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                      <CheckCircle2 className="h-8 w-8 text-accent" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">Your ticket has been booked successfully</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Booking ID:</span> {bookingId}
                    </p>
                    <p>
                      <span className="font-medium">Train:</span> {selectedTrain?.train_name} (
                      {selectedTrain?.train_number})
                    </p>
                    <p>
                      <span className="font-medium">Class:</span> {selectedTrain?.selectedClass}
                    </p>
                    <p>
                      <span className="font-medium">Passengers:</span> {passengers.length}
                    </p>
                    <p>
                      <span className="font-medium">Journey Date:</span> {new Date(date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button className="mt-6" onClick={() => (window.location.href = "/my-bookings")}>
                    View My Bookings
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <BookingSummary
              train={
                selectedTrain
                  ? {
                      name: selectedTrain.train_name,
                      number: selectedTrain.train_number,
                      departure: selectedTrain.departure,
                      arrival: selectedTrain.arrival,
                      price: selectedTrain.price,
                      class: selectedTrain.selectedClass,
                    }
                  : undefined
              }
              passengers={passengers.length || 1}
              from={from}
              to={to}
              date={date ? new Date(date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : undefined}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}
