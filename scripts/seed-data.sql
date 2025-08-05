-- Insert sample hospitals
INSERT INTO hospitals (name, address, city, state, phone, rating, specialties, doctors_count) VALUES
('Apollo Hospital', 'Sarita Vihar, Mathura Road', 'New Delhi', 'Delhi', '+91 11 2692 5858', 4.5, ARRAY['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'], 45),
('Fortis Hospital', 'Sector 62, Phase VIII', 'Mohali', 'Punjab', '+91 172 521 0000', 4.3, ARRAY['Cardiology', 'Gastroenterology', 'Nephrology'], 38),
('Max Super Speciality Hospital', 'Press Enclave Road, Saket', 'New Delhi', 'Delhi', '+91 11 2651 5050', 4.4, ARRAY['Oncology', 'Neurology', 'Cardiology', 'Pediatrics'], 52),
('Manipal Hospital', 'HAL Airport Road', 'Bangalore', 'Karnataka', '+91 80 2502 4444', 4.2, ARRAY['Orthopedics', 'Dermatology', 'ENT', 'Ophthalmology'], 41),
('Kokilaben Dhirubhai Ambani Hospital', 'Rao Saheb Achutrao Patwardhan Marg', 'Mumbai', 'Maharashtra', '+91 22 4269 6969', 4.6, ARRAY['Cardiology', 'Neurology', 'Oncology', 'Transplant'], 67),
('AIIMS', 'Ansari Nagar', 'New Delhi', 'Delhi', '+91 11 2658 8500', 4.7, ARRAY['All Specialties', 'Research', 'Emergency'], 89);

-- Insert sample doctors
INSERT INTO doctors (name, specialty, hospital_id, qualification, experience, consultation_fee, available_days, available_times) VALUES
('Dr. Rajesh Kumar', 'Cardiology', 1, 'MBBS, MD, DM Cardiology', 15, 1200.00, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Friday'], ARRAY['09:00', '10:00', '11:00', '14:00', '15:00']),
('Dr. Priya Sharma', 'Neurology', 1, 'MBBS, MD, DM Neurology', 12, 1500.00, ARRAY['Tuesday', 'Thursday', 'Saturday'], ARRAY['10:00', '11:00', '14:30', '15:30']),
('Dr. Amit Singh', 'Orthopedics', 2, 'MBBS, MS Orthopedics', 10, 1000.00, ARRAY['Monday', 'Wednesday', 'Friday'], ARRAY['09:30', '10:30', '11:30', '14:00']),
('Dr. Sunita Gupta', 'Pediatrics', 3, 'MBBS, MD Pediatrics', 8, 800.00, ARRAY['Monday', 'Tuesday', 'Thursday', 'Friday'], ARRAY['09:00', '10:00', '16:00', '17:00']),
('Dr. Vikram Mehta', 'General Medicine', 4, 'MBBS, MD Internal Medicine', 20, 600.00, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], ARRAY['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']);

-- Insert demo users (passwords are hashed versions of 'password123')
INSERT INTO users (name, email, password, role) VALUES
('Demo Patient', 'patient@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/Hm', 'patient'),
('Demo Admin', 'admin@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/Hm', 'admin'),
('John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/Hm', 'patient'),
('Jane Smith', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/Hm', 'patient');
