-- Add pricing for trains that are missing pricing data

-- Bangalore to Bhopal (Ram Rahim Express - 12212)
INSERT INTO pricing (route_id, class_type, base_fare) 
SELECT r.id, 'AC 1', 2800.00
FROM routes r
JOIN trains t ON r.train_id = t.id
WHERE t.train_number = '12212'
AND NOT EXISTS (
  SELECT 1 FROM pricing p WHERE p.route_id = r.id AND p.class_type = 'AC 1'
);

INSERT INTO pricing (route_id, class_type, base_fare) 
SELECT r.id, 'AC 2', 1800.00
FROM routes r
JOIN trains t ON r.train_id = t.id
WHERE t.train_number = '12212'
AND NOT EXISTS (
  SELECT 1 FROM pricing p WHERE p.route_id = r.id AND p.class_type = 'AC 2'
);

INSERT INTO pricing (route_id, class_type, base_fare) 
SELECT r.id, 'AC 3', 1200.00
FROM routes r
JOIN trains t ON r.train_id = t.id
WHERE t.train_number = '12212'
AND NOT EXISTS (
  SELECT 1 FROM pricing p WHERE p.route_id = r.id AND p.class_type = 'AC 3'
);

INSERT INTO pricing (route_id, class_type, base_fare) 
SELECT r.id, 'Sleeper', 650.00
FROM routes r
JOIN trains t ON r.train_id = t.id
WHERE t.train_number = '12212'
AND NOT EXISTS (
  SELECT 1 FROM pricing p WHERE p.route_id = r.id AND p.class_type = 'Sleeper'
);

-- Add default pricing for any other routes that don't have pricing
-- This ensures all routes have at least basic pricing

INSERT INTO pricing (route_id, class_type, base_fare)
SELECT DISTINCT r.id, 'AC 1', 2500.00
FROM routes r
WHERE NOT EXISTS (
  SELECT 1 FROM pricing p WHERE p.route_id = r.id AND p.class_type = 'AC 1'
);

INSERT INTO pricing (route_id, class_type, base_fare)
SELECT DISTINCT r.id, 'AC 2', 1600.00
FROM routes r
WHERE NOT EXISTS (
  SELECT 1 FROM pricing p WHERE p.route_id = r.id AND p.class_type = 'AC 2'
);

INSERT INTO pricing (route_id, class_type, base_fare)
SELECT DISTINCT r.id, 'AC 3', 1100.00
FROM routes r
WHERE NOT EXISTS (
  SELECT 1 FROM pricing p WHERE p.route_id = r.id AND p.class_type = 'AC 3'
);

INSERT INTO pricing (route_id, class_type, base_fare)
SELECT DISTINCT r.id, 'Sleeper', 600.00
FROM routes r
WHERE NOT EXISTS (
  SELECT 1 FROM pricing p WHERE p.route_id = r.id AND p.class_type = 'Sleeper'
);
