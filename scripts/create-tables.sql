-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    rating DECIMAL(2,1) DEFAULT 0.0,
    specialties TEXT[],
    doctors_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    hospital_id INTEGER REFERENCES hospitals(id),
    qualification TEXT,
    experience INTEGER,
    consultation_fee DECIMAL(10,2),
    available_days TEXT[],
    available_times TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    hospital_id INTEGER REFERENCES hospitals(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_age INTEGER,
    symptoms TEXT,
    appointment_type VARCHAR(50) DEFAULT 'consultation',
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_payments_appointment_id ON payments(appointment_id);
