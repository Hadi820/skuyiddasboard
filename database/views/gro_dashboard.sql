-- GRO Performance Dashboard View
CREATE OR REPLACE VIEW gro_performance_summary AS
SELECT 
    r.gro,
    COUNT(*) as total_reservations,
    COUNT(CASE WHEN r.status = 'Selesai' THEN 1 END) as completed_reservations,
    COUNT(CASE WHEN r.status = 'Proses' THEN 1 END) as processing_reservations,
    COUNT(CASE WHEN r.status = 'Pending' THEN 1 END) as pending_reservations,
    COUNT(CASE WHEN r.status = 'Batal' THEN 1 END) as cancelled_reservations,
    
    -- Revenue metrics
    SUM(r.final_price) as total_revenue,
    SUM(r.profit) as total_profit,
    AVG(r.final_price) as avg_reservation_value,
    
    -- Commission calculations (50k per reservation)
    COUNT(*) * 50000 as total_commission,
    COUNT(CASE WHEN r.status = 'Selesai' THEN 1 END) * 50000 as earned_commission,
    COUNT(CASE WHEN r.status IN ('Pending', 'Proses') THEN 1 END) * 50000 as pending_commission,
    
    -- Performance metrics
    ROUND(
        (COUNT(CASE WHEN r.status = 'Selesai' THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(*), 0)) * 100, 2
    ) as completion_rate,
    
    -- Recent activity
    COUNT(CASE WHEN r.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as reservations_last_30_days,
    COUNT(CASE WHEN r.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as reservations_last_7_days,
    
    -- Date ranges
    MIN(r.created_at) as first_reservation_date,
    MAX(r.created_at) as last_reservation_date
    
FROM reservations r
WHERE r.gro IS NOT NULL
GROUP BY r.gro
ORDER BY total_revenue DESC;

-- Monthly GRO Performance View
CREATE OR REPLACE VIEW gro_monthly_performance AS
SELECT 
    r.gro,
    DATE_TRUNC('month', r.created_at) as month,
    TO_CHAR(DATE_TRUNC('month', r.created_at), 'YYYY-MM') as month_label,
    COUNT(*) as monthly_reservations,
    SUM(r.final_price) as monthly_revenue,
    SUM(r.profit) as monthly_profit,
    COUNT(*) * 50000 as monthly_commission,
    AVG(r.final_price) as avg_reservation_value,
    
    -- Status breakdown
    COUNT(CASE WHEN r.status = 'Selesai' THEN 1 END) as completed_count,
    COUNT(CASE WHEN r.status = 'Proses' THEN 1 END) as processing_count,
    COUNT(CASE WHEN r.status = 'Pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN r.status = 'Batal' THEN 1 END) as cancelled_count
    
FROM reservations r
WHERE r.gro IS NOT NULL
GROUP BY r.gro, DATE_TRUNC('month', r.created_at)
ORDER BY r.gro, month DESC;

-- Category Performance View
CREATE OR REPLACE VIEW category_performance AS
SELECT 
    r.category,
    COUNT(*) as total_reservations,
    SUM(r.final_price) as total_revenue,
    SUM(r.profit) as total_profit,
    AVG(r.final_price) as avg_price,
    AVG(r.profit) as avg_profit,
    
    -- Profit margin
    ROUND(
        (SUM(r.profit)::DECIMAL / NULLIF(SUM(r.final_price), 0)) * 100, 2
    ) as profit_margin_percent,
    
    -- Status distribution
    COUNT(CASE WHEN r.status = 'Selesai' THEN 1 END) as completed_count,
    COUNT(CASE WHEN r.status = 'Proses' THEN 1 END) as processing_count,
    COUNT(CASE WHEN r.status = 'Pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN r.status = 'Batal' THEN 1 END) as cancelled_count,
    
    -- Top GRO for this category
    (
        SELECT gro 
        FROM reservations r2 
        WHERE r2.category = r.category AND r2.gro IS NOT NULL
        GROUP BY gro 
        ORDER BY COUNT(*) DESC 
        LIMIT 1
    ) as top_gro
    
FROM reservations r
GROUP BY r.category
ORDER BY total_revenue DESC;

-- Daily Revenue View
CREATE OR REPLACE VIEW daily_revenue AS
SELECT 
    DATE(r.created_at) as date,
    COUNT(*) as daily_reservations,
    SUM(r.final_price) as daily_revenue,
    SUM(r.profit) as daily_profit,
    SUM(r.customer_deposit) as daily_deposits,
    
    -- Running totals
    SUM(SUM(r.final_price)) OVER (ORDER BY DATE(r.created_at)) as cumulative_revenue,
    SUM(SUM(r.profit)) OVER (ORDER BY DATE(r.created_at)) as cumulative_profit,
    
    -- Average per reservation
    AVG(r.final_price) as avg_reservation_value,
    
    -- Status breakdown
    COUNT(CASE WHEN r.status = 'Selesai' THEN 1 END) as completed_today,
    COUNT(CASE WHEN r.status = 'Proses' THEN 1 END) as processing_today,
    COUNT(CASE WHEN r.status = 'Pending' THEN 1 END) as pending_today
    
FROM reservations r
GROUP BY DATE(r.created_at)
ORDER BY date DESC;

-- Commission Tracking View
CREATE OR REPLACE VIEW commission_tracking AS
SELECT 
    r.id as reservation_id,
    r.booking_code,
    r.customer_name,
    r.gro,
    r.final_price,
    r.status,
    r.created_at,
    
    -- Commission calculation
    50000 as commission_amount,
    
    -- Commission status based on reservation status
    CASE 
        WHEN r.status = 'Selesai' THEN 'earned'
        WHEN r.status IN ('Pending', 'Proses') THEN 'pending'
        WHEN r.status = 'Batal' THEN 'cancelled'
        ELSE 'unknown'
    END as commission_status,
    
    -- Payment due date (30 days after completion)
    CASE 
        WHEN r.status = 'Selesai' THEN r.updated_at + INTERVAL '30 days'
        ELSE NULL
    END as commission_due_date
    
FROM reservations r
WHERE r.gro IS NOT NULL
ORDER BY r.created_at DESC;

-- Add indexes for views performance
CREATE INDEX IF NOT EXISTS idx_reservations_gro_created_at ON reservations(gro, created_at);
CREATE INDEX IF NOT EXISTS idx_reservations_category_status ON reservations(category, status);
CREATE INDEX IF NOT EXISTS idx_reservations_status_updated_at ON reservations(status, updated_at);

-- Grant permissions
GRANT SELECT ON gro_performance_summary TO hotel_user;
GRANT SELECT ON gro_monthly_performance TO hotel_user;
GRANT SELECT ON category_performance TO hotel_user;
GRANT SELECT ON daily_revenue TO hotel_user;
GRANT SELECT ON commission_tracking TO hotel_user;
