-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    trip_schedule VARCHAR(255),
    order_details TEXT NOT NULL,
    gro VARCHAR(100),
    category VARCHAR(100) NOT NULL DEFAULT 'Akomodasi',
    final_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    customer_deposit DECIMAL(15,2) DEFAULT 0,
    partner_deposit DECIMAL(15,2) DEFAULT 0,
    remaining_payment DECIMAL(15,2) GENERATED ALWAYS AS (final_price - customer_deposit) STORED,
    base_price DECIMAL(15,2) DEFAULT 0,
    profit DECIMAL(15,2) GENERATED ALWAYS AS (final_price - base_price) STORED,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT check_dates CHECK (check_out >= check_in),
    CONSTRAINT check_amounts CHECK (
        final_price >= 0 AND 
        customer_deposit >= 0 AND 
        partner_deposit >= 0 AND 
        base_price >= 0
    ),
    CONSTRAINT check_status CHECK (status IN ('Pending', 'Proses', 'Selesai', 'Batal'))
);

-- Create indexes for better performance
CREATE INDEX idx_reservations_booking_code ON reservations(booking_code);
CREATE INDEX idx_reservations_customer_name ON reservations(customer_name);
CREATE INDEX idx_reservations_gro ON reservations(gro);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_category ON reservations(category);
CREATE INDEX idx_reservations_dates ON reservations(check_in, check_out);
CREATE INDEX idx_reservations_created_at ON reservations(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO reservations (
    client_id, booking_code, customer_name, phone_number, 
    check_in, check_out, order_details, gro, category,
    final_price, customer_deposit, base_price, status
) VALUES 
(1, 'BK-20250101-001', 'John Doe', '081234567890', '2025-01-15', '2025-01-17', 'Villa Utama - 2 Kamar', 'ILPAN', 'Akomodasi', 5000000, 2500000, 4000000, 'Selesai'),
(2, 'BK-20250102-002', 'Jane Smith', '081234567891', '2025-01-20', '2025-01-22', 'Paket Wisata Pantai', 'JAMAL', 'Trip', 3000000, 1500000, 2500000, 'Proses'),
(3, 'BK-20250103-003', 'Bob Johnson', '081234567892', '2025-01-25', '2025-01-27', 'Meeting Room + Catering', 'BANG NUNG', 'Event', 2000000, 1000000, 1500000, 'Pending');

-- Add comments for documentation
COMMENT ON TABLE reservations IS 'Hotel reservation management table';
COMMENT ON COLUMN reservations.booking_code IS 'Unique booking reference code';
COMMENT ON COLUMN reservations.gro IS 'Guest Relations Officer responsible for this reservation';
COMMENT ON COLUMN reservations.final_price IS 'Final price charged to customer';
COMMENT ON COLUMN reservations.base_price IS 'Base cost price (stor price)';
COMMENT ON COLUMN reservations.profit IS 'Calculated profit (final_price - base_price)';
