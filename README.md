# RailwayMS - Indian Railways Management System

A comprehensive full-stack web application for managing train bookings, schedules, and passenger information across Indian Railways. Built with Next.js 16, React 19, TypeScript, and Neon PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
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
\`\`\`sql
CREATE TABLE stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### **trains**
Stores train information and seat capacity.
\`\`\`sql
CREATE TABLE trains (
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
\`\`\`

#### **routes**
Stores train routes between stations.
\`\`\`sql
CREATE TABLE routes (
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
\`\`\`

#### **route_stops**
Stores intermediate stops for routes.
\`\`\`sql
CREATE TABLE route_stops (
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
\`\`\`

#### **pricing**
Stores fare information for different classes.
\`\`\`sql
CREATE TABLE pricing (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
  class_type VARCHAR(20) NOT NULL,
  base_fare DECIMAL(10, 2) NOT NULL,
  dynamic_pricing_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(route_id, class_type)
);
\`\`\`

#### **railway_users**
Stores user/passenger information.
\`\`\`sql
CREATE TABLE railway_users (
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
\`\`\`

#### **bookings**
Stores booking information.
\`\`\`sql
CREATE TABLE bookings (
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
\`\`\`

#### **passengers**
Stores individual passenger details for each booking.
\`\`\`sql
CREATE TABLE passengers (
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
\`\`\`

### Indexes
- `idx_trains_number` on trains(train_number)
- `idx_stations_code` on stations(code)
- `idx_routes_train` on routes(train_id)
- `idx_bookings_user` on bookings(user_id)
- `idx_bookings_reference` on bookings(booking_reference)
- `idx_bookings_date` on bookings(journey_date)
- `idx_passengers_booking` on passengers(booking_id)

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
   Navigate to `http://localhost:3000`

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Application
NEXT_PUBLIC_APP_NAME=RailwayMS
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

**Note**: The `DATABASE_URL` should be your Neon PostgreSQL connection string.

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
| `01_create_railway_tables.sql` | Creates all database tables and indexes |
| `02_seed_stations.sql` | Inserts major Indian railway stations |
| `03_seed_trains.sql` | Inserts train information |
| `04_seed_routes.sql` | Inserts train routes |
| `05_seed_pricing.sql` | Inserts base fares for routes |
| `06_add_missing_pricing.sql` | Adds missing pricing entries |
| `07_create_demo_user.sql` | Creates demo user for testing |

---

## 📖 Usage

### User Flow

1. **Home Page** (`/`)
   - View popular routes
   - Search for trains

2. **Train Search** (`/booking`)
   - Enter source, destination, and date
   - Select train and class
   - Add passenger details

3. **Booking Confirmation**
   - Review booking summary
   - Complete payment
   - Receive booking reference

4. **My Bookings** (`/my-bookings`)
   - View all bookings
   - Check booking status
   - Download tickets

### Admin Flow

1. **Admin Dashboard** (`/admin`)
   - View key statistics
   - Access management sections

2. **Train Management** (`/admin/trains`)
   - Create/edit/delete trains
   - Manage train details

3. **Schedule Management** (`/admin/schedules`)
   - Create/edit/delete routes
   - Set departure/arrival times

4. **Booking Management** (`/admin/bookings`)
   - View all bookings
   - Track payment status

5. **Passenger Management** (`/admin/passengers`)
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
- **Primary**: Blue (`oklch(0.45 0.15 220)`)
- **Accent**: Teal (`oklch(0.55 0.18 200)`)
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
