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
  days_of_operation VARCHAR(50) NOT NULL, -- e.g., "Mon,Tue,Wed,Thu,Fri,Sat,Sun"
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
  class_type VARCHAR(20) NOT NULL, -- AC 1, AC 2, AC 3, Sleeper, General
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
