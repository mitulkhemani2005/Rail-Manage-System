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
