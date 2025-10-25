-- Seed Indian Trains

INSERT INTO trains (train_number, train_name, train_type, total_seats, ac_1_seats, ac_2_seats, ac_3_seats, sleeper_seats, general_seats, status) VALUES
('12951', 'Mumbai Rajdhani Express', 'Rajdhani', 500, 50, 100, 150, 200, 0, 'Active'),
('12301', 'Howrah Rajdhani Express', 'Rajdhani', 480, 48, 96, 144, 192, 0, 'Active'),
('12009', 'Shatabdi Express', 'Shatabdi', 400, 0, 120, 180, 100, 0, 'Active'),
('22691', 'Vande Bharat Express', 'Vande Bharat', 450, 0, 150, 200, 100, 0, 'Active'),
('12213', 'Duronto Express', 'Duronto', 520, 52, 104, 156, 208, 0, 'Active'),
('12909', 'Garib Rath Express', 'Garib Rath', 600, 0, 0, 300, 300, 0, 'Active'),
('12430', 'Humsafar Express', 'Humsafar', 400, 0, 0, 400, 0, 0, 'Active'),
('12617', 'Mangala Lakshadweep Express', 'Superfast', 550, 55, 110, 165, 220, 0, 'Active'),
('12423', 'Dibrugarh Rajdhani', 'Rajdhani', 500, 50, 100, 150, 200, 0, 'Active'),
('12002', 'Bhopal Shatabdi', 'Shatabdi', 380, 0, 100, 180, 100, 0, 'Active')
ON CONFLICT (train_number) DO NOTHING;
