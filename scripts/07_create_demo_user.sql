-- Create a demo user for testing bookings
-- This allows bookings to work without authentication setup

INSERT INTO railway_users (
  id,
  full_name,
  email,
  phone,
  date_of_birth,
  gender,
  city,
  state
) VALUES (
  1,
  'Demo User',
  'demo@railwaymanagement.com',
  '+91-9876543210',
  '1990-01-01',
  'Other',
  'Mumbai',
  'Maharashtra'
)
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence to start from 2 for future users
SELECT setval('railway_users_id_seq', (SELECT MAX(id) FROM railway_users));
