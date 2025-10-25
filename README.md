# RailwayMS - Indian Railways Management System

A comprehensive full-stack web application for managing train bookings, schedules, and passenger information across Indian Railways. Built with Next.js 16, React 19, TypeScript, and Neon PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [SQL Code Examples](#sql-code-examples)
- [JavaScript/TypeScript Code Examples](#javascripttypescript-code-examples)
- [React/JSX Code Examples](#reactjsx-code-examples)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Components](#components)
- [Pages](#pages)

---

## ✨ Features

### User Features
- **Train Search & Booking**: Search trains by source, destination, and date
- **Multiple Class Options**: AC 1, AC 2, AC 3, Sleeper, and General classes
- **Passenger Management**: Add multiple passengers per booking
- **Booking History**: View all past and current bookings
- **Real-time Availability**: Check seat availability for different classes
- **Dynamic Pricing**: Class-based fare calculation with GST

### Admin Features
- **Dashboard Analytics**: View key statistics and metrics
- **Train Management**: Create, update, and manage train information
- **Schedule Management**: Manage routes and schedules
- **Booking Management**: View and manage all bookings
- **Passenger Management**: Track passenger information
- **Pricing Management**: Set and update pricing for different routes and classes

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19.2**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Recharts**: Data visualization
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Lucide React**: Icon library

### Backend
- **Next.js API Routes**: RESTful API endpoints
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **@neondatabase/serverless**: Database client

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

---

## 📁 Project Structure

\`\`\`
railway-management/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles
│   ├── loading.tsx                # Loading skeleton
│   ├── api/                       # API routes
│   │   ├── admin/                 # Admin endpoints
│   │   │   ├── analytics/
│   │   │   ├── bookings/
│   │   │   ├── passengers/
│   │   │   ├── schedules/
│   │   │   ├── stats/
│   │   │   └── trains/
│   │   ├── bookings/
│   │   ├── schedules/
│   │   ├── stations/
│   │   ├── trains/
│   │   ├── users/
│   │   └── search/
│   ├── admin/                     # Admin pages
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── bookings/
│   │   ├── passengers/
│   │   ├── schedules/
│   │   └── trains/
│   ├── booking/                   # Booking flow
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── my-bookings/               # User bookings
│   │   └── page.tsx
│   └── schedules/                 # Schedule view
│       └── page.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── header.tsx                 # Navigation header
│   ├── admin-sidebar.tsx          # Admin navigation
│   ├── train-search.tsx           # Train search form
│   ├── train-selection.tsx        # Train selection UI
│   ├── booking-card.tsx           # Booking display card
│   ├── booking-filters.tsx        # Booking filters
│   ├── booking-summary.tsx        # Booking summary
│   ├── passenger-form.tsx         # Passenger details form
│   ├── quick-stats.tsx            # Statistics display
│   ├── recent-bookings.tsx        # Recent bookings list
│   ├── schedule-table.tsx         # Schedule display
│   ├── schedule-filters.tsx       # Schedule filters
│   ├── schedule-management-table.tsx
│   ├── train-management-table.tsx
│   ├── admin-stats.tsx            # Admin statistics
│   └── theme-provider.tsx         # Theme configuration
├── lib/
│   ├── db.ts                      # Database connection
│   └── utils.ts                   # Utility functions
├── hooks/
│   ├── use-mobile.ts              # Mobile detection
│   └── use-toast.ts               # Toast notifications
├── scripts/
│   ├── 01_create_railway_tables.sql
│   ├── 02_seed_stations.sql
│   ├── 03_seed_trains.sql
│   ├── 04_seed_routes.sql
│   ├── 05_seed_pricing.sql
│   ├── 06_add_missing_pricing.sql
│   └── 07_create_demo_user.sql
├── public/
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   └── placeholder.jpg
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── README.md
\`\`\`

---

## 🗄 Database Schema

### Tables Overview

#### **stations**
Stores railway station information.

#### **trains**
Stores train information and seat capacity.

#### **routes**
Stores train routes between stations.

#### **route_stops**
Stores intermediate stops for routes.

#### **pricing**
Stores fare information for different classes.

#### **railway_users**
Stores user/passenger information.

#### **bookings**
Stores booking information.

#### **passengers**
Stores individual passenger details for each booking.

---

## 💾 SQL Code Examples

### Complete Database Schema

\`\`\`sql
-- Railway Management System Database Schema

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trains table
CREATE TABLE IF NOT EXISTS trains (
  id SERIAL PRIMARY KEY,
  train_number VARCHAR(20) UNIQUE NOT NULL,
  train_name VARCHAR(255) NOT NULL,
  train_type VARCHAR(50) NOT NULL,
  total_seats INTEGER NOT NULL,
  ac_1_seats INTEGER DEFAULT 0,
  ac_2_seats INTEGER DEFAULT 0,
  ac_3_seats INTEGER DEFAULT 0,
  sleeper_seats INTEGER DEFAULT 0,
  general_seats INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  train_id INTEGER REFERENCES trains(id) ON DELETE CASCADE,
  source_station_id INTEGER REFERENCES stations(id),
  destination_station_id INTEGER REFERENCES stations(id),
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  distance_km DECIMAL(10, 2) NOT NULL,
  days_of_operation VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Route stops (intermediate stations)
CREATE TABLE IF NOT EXISTS route_stops (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
  station_id INTEGER REFERENCES stations(id),
  arrival_time TIME,
  departure_time TIME,
  stop_number INTEGER NOT NULL,
  platform_number VARCHAR(10),
  halt_duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing table
CREATE TABLE IF NOT EXISTS pricing (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
  class_type VARCHAR(20) NOT NULL,
  base_fare DECIMAL(10, 2) NOT NULL,
  dynamic_pricing_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(route_id, class_type)
);

-- Railway users table (passengers)
CREATE TABLE IF NOT EXISTS railway_users (
  id SERIAL PRIMARY KEY,
  stack_user_id TEXT REFERENCES neon_auth.users_sync(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_reference VARCHAR(20) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES railway_users(id),
  route_id INTEGER REFERENCES routes(id),
  train_id INTEGER REFERENCES trains(id),
  journey_date DATE NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_passengers INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  gst_amount DECIMAL(10, 2) NOT NULL,
  final_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'Pending',
  booking_status VARCHAR(20) DEFAULT 'Confirmed',
  payment_method VARCHAR(50),
  payment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passengers table (for each booking)
CREATE TABLE IF NOT EXISTS passengers (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL,
  seat_number VARCHAR(10),
  class_type VARCHAR(20) NOT NULL,
  fare_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trains_number ON trains(train_number);
CREATE INDEX IF NOT EXISTS idx_stations_code ON stations(code);
CREATE INDEX IF NOT EXISTS idx_routes_train ON routes(train_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(journey_date);
CREATE INDEX IF NOT EXISTS idx_passengers_booking ON passengers(booking_id);
\`\`\`

### Seed Data Example

\`\`\`sql
-- Seed Indian Railway Stations
INSERT INTO stations (name, code, city, state) VALUES
('Mumbai Central', 'MMCT', 'Mumbai', 'Maharashtra'),
('New Delhi Railway Station', 'NDLS', 'New Delhi', 'Delhi'),
('Chennai Central', 'MAS', 'Chennai', 'Tamil Nadu'),
('Bangalore City Junction', 'SBC', 'Bangalore', 'Karnataka'),
('Howrah Junction', 'HWH', 'Kolkata', 'West Bengal'),
('Varanasi Junction', 'BSB', 'Varanasi', 'Uttar Pradesh'),
('Ahmedabad Junction', 'ADI', 'Ahmedabad', 'Gujarat'),
('Jaipur Junction', 'JP', 'Jaipur', 'Rajasthan'),
('Pune Junction', 'PUNE', 'Pune', 'Maharashtra'),
('Hyderabad Deccan', 'HYB', 'Hyderabad', 'Telangana'),
('Lucknow Charbagh', 'LKO', 'Lucknow', 'Uttar Pradesh'),
('Patna Junction', 'PNBE', 'Patna', 'Bihar'),
('Bhopal Junction', 'BPL', 'Bhopal', 'Madhya Pradesh'),
('Nagpur Junction', 'NGP', 'Nagpur', 'Maharashtra'),
('Coimbatore Junction', 'CBE', 'Coimbatore', 'Tamil Nadu')
ON CONFLICT (code) DO NOTHING;
\`\`\`

---

## 🔧 JavaScript/TypeScript Code Examples

### Database Connection (lib/db.ts)

\`\`\`typescript
import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)
\`\`\`

### API Route - Create Booking (app/api/bookings/route.ts)

\`\`\`typescript
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Booking request received:", body)

    const { userId, routeId, trainId, journeyDate, passengers, totalAmount, gstAmount, finalAmount, paymentMethod } =
      body

    if (!routeId || !trainId || !journeyDate || !passengers || passengers.length === 0) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required booking information" }, { status: 400 })
    }

    // Generate booking reference
    const bookingRef = \`BKG\${Date.now()}\${Math.floor(Math.random() * 1000)}\`
    console.log("[v0] Generated booking reference:", bookingRef)

    const effectiveUserId = userId || 1

    // Create booking
    const booking = await sql\`
      INSERT INTO bookings (
        booking_reference,
        user_id,
        route_id,
        train_id,
        journey_date,
        total_passengers,
        total_amount,
        gst_amount,
        final_amount,
        payment_status,
        booking_status,
        payment_method
      ) VALUES (
        \${bookingRef},
        \${effectiveUserId},
        \${routeId},
        \${trainId},
        \${journeyDate},
        \${passengers.length},
        \${totalAmount},
        \${gstAmount},
        \${finalAmount},
        'Completed',
        'Confirmed',
        \${paymentMethod}
      )
      RETURNING *
    \`

    console.log("[v0] Booking created:", booking[0])

    // Add passengers
    for (const passenger of passengers) {
      console.log("[v0] Adding passenger:", passenger)
      await sql\`
        INSERT INTO passengers (
          booking_id,
          full_name,
          age,
          gender,
          class_type,
          fare_amount
        ) VALUES (
          \${booking[0].id},
          \${passenger.name},
          \${passenger.age},
          \${passenger.gender},
          \${passenger.classType},
          \${passenger.fare}
        )
      \`
    }

    console.log("[v0] All passengers added successfully")

    return NextResponse.json({
      success: true,
      booking: booking[0],
      bookingReference: bookingRef,
    })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const bookings = await sql\`
      SELECT 
        b.*,
        t.train_name,
        t.train_number,
        r.departure_time,
        r.arrival_time,
        s1.name as source_station,
        s1.city as source_city,
        s2.name as destination_station,
        s2.city as destination_city
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      JOIN routes r ON b.route_id = r.id
      JOIN stations s1 ON r.source_station_id = s1.id
      JOIN stations s2 ON r.destination_station_id = s2.id
      WHERE b.user_id = \${userId}
      ORDER BY b.journey_date DESC, b.created_at DESC
    \`

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
\`\`\`

---

## ⚛️ React/JSX Code Examples

### Booking Card Component (components/booking-card.tsx)

\`\`\`typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Download, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Booking {
  id: string
  bookingId: string
  train: string
  trainNumber: string
  from: string
  to: string
  date: string
  departure: string
  arrival: string
  passengers: number
  amount: string
  status: "confirmed" | "completed" | "cancelled"
  platform: string
}

export function BookingCard({ booking }: { booking: Booking }) {
  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            Confirmed
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Cancelled
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{booking.train}</h3>
              <Badge variant="secondary">{booking.trainNumber}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Booking ID: {booking.bookingId}</p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{booking.from}</span>
            </div>
            <span className="text-sm text-muted-foreground">→</span>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="font-medium">{booking.to}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {booking.departure} - {booking.arrival}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {booking.passengers} {booking.passengers === 1 ? "Passenger" : "Passengers"}
              </span>
            </div>
            <div className="font-semibold text-primary">{booking.amount}</div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Platform: </span>
            <Badge variant="secondary">{booking.platform}</Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 bg-transparent" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          {booking.status === "confirmed" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this booking? This action cannot be undone and a cancellation fee
                    may apply.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Cancel Booking
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
\`\`\`

### Home Page Component (app/page.tsx)

\`\`\`typescript
import { Header } from "@/components/header"
import { TrainSearch } from "@/components/train-search"
import { QuickStats } from "@/components/quick-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, ArrowRight } from 'lucide-react'

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
\`\`\`

---

## 🔌 API Endpoints

### Public Endpoints

#### Train Search
- **GET** `/api/trains/search?from=MMCT&to=NDLS&date=2025-01-15`
  - Search trains by source, destination, and date

#### Trains
- **GET** `/api/trains` - Get all trains
- **GET** `/api/trains/[id]` - Get train details
- **GET** `/api/trains/[id]/pricing` - Get pricing for a train

#### Schedules
- **GET** `/api/schedules` - Get all schedules
- **GET** `/api/schedules?trainId=1` - Get schedules for a train

#### Stations
- **GET** `/api/stations` - Get all stations

#### Bookings
- **POST** `/api/bookings` - Create a new booking
- **GET** `/api/bookings?userId=1` - Get user bookings

#### Users
- **POST** `/api/users` - Create/update user profile

### Admin Endpoints

#### Admin Analytics
- **GET** `/api/admin/analytics` - Get analytics data

#### Admin Stats
- **GET** `/api/admin/stats` - Get dashboard statistics

#### Admin Trains
- **GET** `/api/admin/trains` - Get all trains
- **POST** `/api/admin/trains` - Create train
- **PUT** `/api/admin/trains/[id]` - Update train
- **DELETE** `/api/admin/trains/[id]` - Delete train

#### Admin Schedules
- **GET** `/api/admin/schedules` - Get all schedules
- **POST** `/api/admin/schedules` - Create schedule
- **PUT** `/api/admin/schedules/[id]` - Update schedule
- **DELETE** `/api/admin/schedules/[id]` - Delete schedule

#### Admin Bookings
- **GET** `/api/admin/bookings` - Get all bookings

#### Admin Passengers
- **GET** `/api/admin/passengers` - Get all passengers

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Neon PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd railway-management
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables** (see [Environment Variables](#environment-variables))

4. **Initialize the database** (see [Database Setup](#database-setup))

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   pnpm dev
   \`\`\`

6. **Open your browser**
   Navigate to \`http://localhost:3000\`

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🔐 Environment Variables

Create a \`.env.local\` file in the root directory with the following variables:

\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Application
NEXT_PUBLIC_APP_NAME=RailwayMS
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

**Note**: The \`DATABASE_URL\` should be your Neon PostgreSQL connection string.

---

## 🗄 Database Setup

### 1. Create Tables
Run the SQL migration script to create all tables:

\`\`\`bash
# Using Neon SQL Editor or psql
psql -d your_database -f scripts/01_create_railway_tables.sql
\`\`\`

### 2. Seed Initial Data
Run the seed scripts in order:

\`\`\`bash
psql -d your_database -f scripts/02_seed_stations.sql
psql -d your_database -f scripts/03_seed_trains.sql
psql -d your_database -f scripts/04_seed_routes.sql
psql -d your_database -f scripts/05_seed_pricing.sql
psql -d your_database -f scripts/06_add_missing_pricing.sql
psql -d your_database -f scripts/07_create_demo_user.sql
\`\`\`

### SQL Scripts Overview

| Script | Purpose |
|--------|---------|
| \`01_create_railway_tables.sql\` | Creates all database tables and indexes |
| \`02_seed_stations.sql\` | Inserts major Indian railway stations |
| \`03_seed_trains.sql\` | Inserts train information |
| \`04_seed_routes.sql\` | Inserts train routes |
| \`05_seed_pricing.sql\` | Inserts base fares for routes |
| \`06_add_missing_pricing.sql\` | Adds missing pricing entries |
| \`07_create_demo_user.sql\` | Creates demo user for testing |

---

## 📖 Usage

### User Flow

1. **Home Page** (\`/\`)
   - View popular routes
   - Search for trains

2. **Train Search** (\`/booking\`)
   - Enter source, destination, and date
   - Select train and class
   - Add passenger details

3. **Booking Confirmation**
   - Review booking summary
   - Complete payment
   - Receive booking reference

4. **My Bookings** (\`/my-bookings\`)
   - View all bookings
   - Check booking status
   - Download tickets

### Admin Flow

1. **Admin Dashboard** (\`/admin\`)
   - View key statistics
   - Access management sections

2. **Train Management** (\`/admin/trains\`)
   - Create/edit/delete trains
   - Manage train details

3. **Schedule Management** (\`/admin/schedules\`)
   - Create/edit/delete routes
   - Set departure/arrival times

4. **Booking Management** (\`/admin/bookings\`)
   - View all bookings
   - Track payment status

5. **Passenger Management** (\`/admin/passengers\`)
   - View passenger information
   - Track bookings

---

## 🧩 Components

### Layout Components
- **Header**: Navigation bar with logo and menu
- **AdminSidebar**: Admin navigation sidebar
- **ThemeProvider**: Dark/light theme support

### Search & Selection
- **TrainSearch**: Train search form component
- **TrainSelectionTable**: Train selection UI
- **BookingFilters**: Filter bookings
- **ScheduleFilters**: Filter schedules

### Display Components
- **BookingCard**: Display booking information
- **BookingSummary**: Booking summary card
- **QuickStats**: Dashboard statistics
- **RecentBookings**: Recent bookings list
- **ScheduleTable**: Schedule display table
- **AdminStats**: Admin dashboard statistics

### Form Components
- **PassengerForm**: Passenger details form
- **TrainManagementTable**: Train management interface
- **ScheduleManagementTable**: Schedule management interface

### UI Components (shadcn/ui)
- Button, Card, Dialog, Form, Input, Select, Table, Tabs, Badge, Alert, and more

---

## 🎨 Styling

The project uses:
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Custom theme**: Blue/teal color scheme for railway theme
- **Dark mode support**: Built-in dark mode with next-themes

### Color Scheme
- **Primary**: Blue (\`oklch(0.45 0.15 220)\`)
- **Accent**: Teal (\`oklch(0.55 0.18 200)\`)
- **Neutrals**: Grays and whites

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🔄 Data Flow

\`\`\`
User Input
    ↓
React Component
    ↓
API Route Handler
    ↓
Database Query (Neon PostgreSQL)
    ↓
Response
    ↓
UI Update
\`\`\`

---

## 🛡 Security Considerations

- Environment variables for sensitive data
- SQL parameterization to prevent injection
- Type safety with TypeScript
- Input validation with Zod
- CORS headers on API routes

---

## 📝 License

This project is part of the v0 platform and follows its terms of service.

---

## 🤝 Support

For issues or questions:
1. Check the documentation
2. Review existing code examples
3. Contact support through the v0 platform

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Seat selection UI
- [ ] Cancellation and refunds
- [ ] Multi-language support
- [ ] Real-time seat availability
- [ ] User authentication system

---

**Last Updated**: October 2025
**Version**: 1.0.0
