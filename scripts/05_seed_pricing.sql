-- Seed Pricing for Routes

-- Mumbai to Delhi (Rajdhani)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12951') LIMIT 1), 'AC 1', 3500.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12951') LIMIT 1), 'AC 2', 2200.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12951') LIMIT 1), 'AC 3', 1500.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12951') LIMIT 1), 'Sleeper', 800.00);

-- Delhi to Howrah (Rajdhani)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12301') LIMIT 1), 'AC 1', 3800.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12301') LIMIT 1), 'AC 2', 2400.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12301') LIMIT 1), 'AC 3', 1600.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12301') LIMIT 1), 'Sleeper', 850.00);

-- Delhi to Bangalore (Shatabdi)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12009') LIMIT 1), 'AC 2', 2800.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12009') LIMIT 1), 'AC 3', 1900.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12009') LIMIT 1), 'Sleeper', 950.00);

-- Mumbai to Chennai (Vande Bharat)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '22691') LIMIT 1), 'AC 2', 2600.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '22691') LIMIT 1), 'AC 3', 1800.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '22691') LIMIT 1), 'Sleeper', 900.00);

-- Delhi to Mumbai (Duronto)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12213') LIMIT 1), 'AC 1', 3600.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12213') LIMIT 1), 'AC 2', 2300.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12213') LIMIT 1), 'AC 3', 1550.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12213') LIMIT 1), 'Sleeper', 820.00);

-- Jaipur to Bangalore (Garib Rath)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12909') LIMIT 1), 'AC 3', 1700.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12909') LIMIT 1), 'Sleeper', 880.00);

-- Ahmedabad to Chennai (Humsafar)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12430') LIMIT 1), 'AC 3', 1650.00);

-- Pune to Hyderabad (Superfast)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12617') LIMIT 1), 'AC 1', 2200.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12617') LIMIT 1), 'AC 2', 1400.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12617') LIMIT 1), 'AC 3', 950.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12617') LIMIT 1), 'Sleeper', 500.00);

-- Delhi to Varanasi (Rajdhani)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12423') LIMIT 1), 'AC 1', 2800.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12423') LIMIT 1), 'AC 2', 1800.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12423') LIMIT 1), 'AC 3', 1200.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12423') LIMIT 1), 'Sleeper', 650.00);

-- Delhi to Bhopal (Shatabdi)
INSERT INTO pricing (route_id, class_type, base_fare) VALUES
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12002') LIMIT 1), 'AC 2', 1600.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12002') LIMIT 1), 'AC 3', 1100.00),
((SELECT id FROM routes WHERE train_id = (SELECT id FROM trains WHERE train_number = '12002') LIMIT 1), 'Sleeper', 580.00);
