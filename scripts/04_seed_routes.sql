-- Seed Routes

INSERT INTO routes (train_id, source_station_id, destination_station_id, departure_time, arrival_time, duration_minutes, distance_km, days_of_operation) VALUES
-- Mumbai to Delhi
((SELECT id FROM trains WHERE train_number = '12951'), 
 (SELECT id FROM stations WHERE code = 'MMCT'), 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 '16:40', '08:35', 955, 1384.0, 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'),

-- Delhi to Howrah
((SELECT id FROM trains WHERE train_number = '12301'), 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'HWH'), 
 '17:00', '10:05', 1025, 1441.0, 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'),

-- Delhi to Bangalore
((SELECT id FROM trains WHERE train_number = '12009'), 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'SBC'), 
 '06:00', '11:30', 2070, 2444.0, 'Mon,Wed,Fri,Sun'),

-- Mumbai to Chennai
((SELECT id FROM trains WHERE train_number = '22691'), 
 (SELECT id FROM stations WHERE code = 'MMCT'), 
 (SELECT id FROM stations WHERE code = 'MAS'), 
 '05:50', '21:30', 940, 1279.0, 'Tue,Thu,Sat'),

-- Delhi to Mumbai
((SELECT id FROM trains WHERE train_number = '12213'), 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'MMCT'), 
 '22:30', '14:25', 955, 1384.0, 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'),

-- Jaipur to Bangalore
((SELECT id FROM trains WHERE train_number = '12909'), 
 (SELECT id FROM stations WHERE code = 'JP'), 
 (SELECT id FROM stations WHERE code = 'SBC'), 
 '18:15', '22:30', 1935, 2156.0, 'Mon,Wed,Fri'),

-- Ahmedabad to Chennai
((SELECT id FROM trains WHERE train_number = '12430'), 
 (SELECT id FROM stations WHERE code = 'ADI'), 
 (SELECT id FROM stations WHERE code = 'MAS'), 
 '20:45', '05:30', 1605, 1871.0, 'Tue,Thu,Sat,Sun'),

-- Pune to Hyderabad
((SELECT id FROM trains WHERE train_number = '12617'), 
 (SELECT id FROM stations WHERE code = 'PUNE'), 
 (SELECT id FROM stations WHERE code = 'HYB'), 
 '14:20', '22:45', 505, 562.0, 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'),

-- Delhi to Varanasi
((SELECT id FROM trains WHERE train_number = '12423'), 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'BSB'), 
 '19:50', '07:15', 685, 764.0, 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'),

-- Delhi to Bhopal
((SELECT id FROM trains WHERE train_number = '12002'), 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'BPL'), 
 '06:15', '13:45', 450, 707.0, 'Mon,Tue,Wed,Thu,Fri,Sat,Sun');
