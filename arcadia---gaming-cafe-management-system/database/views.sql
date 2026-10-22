-- =============================================================
-- ARCADIA: Gaming Cafe Management System
-- Database Views: Operational Metrics & Aggregate Data
-- =============================================================

USE arcadia_db;

-- -------------------------------------------------------------
-- View 1: Real-Time Operational KPI Summary
-- Calculates high-level aggregates for the executive dashboard
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_dashboard_kpis AS
SELECT 
    (SELECT COUNT(*) FROM customers) AS total_customers,
    (SELECT COUNT(*) FROM gaming_pcs) AS total_pcs,
    (SELECT COUNT(*) FROM gaming_pcs WHERE status = 'Available') AS available_pcs,
    (SELECT COUNT(*) FROM gaming_pcs WHERE status = 'In Use') AS pcs_in_use,
    (SELECT COUNT(*) FROM gaming_pcs WHERE status = 'Maintenance') AS pcs_maintenance,
    (SELECT COUNT(*) FROM gaming_sessions WHERE status = 'Active') AS active_sessions,
    (SELECT COUNT(*) FROM customer_memberships WHERE status = 'Active' AND end_date >= CURDATE()) AS active_memberships,
    (SELECT IFNULL(SUM(amount), 0.00) FROM payments WHERE payment_status = 'Completed') AS total_revenue,
    (SELECT IFNULL(SUM(amount), 0.00) FROM payments WHERE payment_status = 'Completed' AND DATE(payment_time) = CURDATE()) AS today_revenue;

-- -------------------------------------------------------------
-- View 2: Live Active Sessions with Dynamic Billing Projection
-- Calculates real-time elapsed minutes and unbilled subtotal
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_active_sessions_live AS
SELECT 
    s.session_id,
    s.customer_id,
    c.full_name AS customer_name,
    c.phone AS customer_phone,
    s.pc_id,
    p.pc_number,
    p.specs AS pc_specs,
    p.tier AS pc_tier,
    s.applied_hourly_rate,
    s.start_time,
    TIMESTAMPDIFF(MINUTE, s.start_time, NOW()) AS current_elapsed_minutes,
    ROUND((GREATEST(TIMESTAMPDIFF(MINUTE, s.start_time, NOW()), 1) / 60.0) * s.applied_hourly_rate, 2) AS current_unbilled_cost
FROM gaming_sessions s
INNER JOIN customers c ON s.customer_id = c.customer_id
INNER JOIN gaming_pcs p ON s.pc_id = p.pc_id
WHERE s.status = 'Active';

-- -------------------------------------------------------------
-- View 3: Customer Roster with Lifetime Gaming & Financial History
-- Demonstrates multi-table LEFT JOINs, aggregate functions (COUNT, SUM), and subqueries
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_customer_roster AS
SELECT 
    c.customer_id,
    c.full_name,
    c.phone,
    c.email,
    c.created_at AS registered_on,
    COUNT(DISTINCT s.session_id) AS total_sessions_played,
    IFNULL(SUM(s.duration_minutes), 0) AS total_minutes_played,
    IFNULL(SUM(p.amount), 0.00) AS total_spent,
    (
        SELECT mp.plan_name 
        FROM customer_memberships cm
        INNER JOIN membership_plans mp ON cm.plan_id = mp.plan_id
        WHERE cm.customer_id = c.customer_id 
          AND cm.status = 'Active' 
          AND cm.end_date >= CURDATE()
        ORDER BY cm.end_date DESC 
        LIMIT 1
    ) AS active_membership_plan,
    (
        SELECT mp.discount_percentage 
        FROM customer_memberships cm
        INNER JOIN membership_plans mp ON cm.plan_id = mp.plan_id
        WHERE cm.customer_id = c.customer_id 
          AND cm.status = 'Active' 
          AND cm.end_date >= CURDATE()
        ORDER BY cm.end_date DESC 
        LIMIT 1
    ) AS active_discount_percentage
FROM customers c
LEFT JOIN gaming_sessions s ON c.customer_id = s.customer_id AND s.status = 'Completed'
LEFT JOIN payments p ON c.customer_id = p.customer_id AND p.payment_status = 'Completed'
GROUP BY c.customer_id, c.full_name, c.phone, c.email, c.created_at;

-- -------------------------------------------------------------
-- View 4: Fleet Utilization & Hardware Gross Yield Analysis
-- Useful for identifying most/least popular gaming rigs
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_rig_utilization AS
SELECT 
    p.pc_id,
    p.pc_number,
    p.tier,
    p.status AS current_status,
    p.hourly_rate,
    COUNT(s.session_id) AS total_sessions,
    IFNULL(SUM(s.duration_minutes), 0) AS total_minutes_played,
    ROUND(IFNULL(SUM(s.duration_minutes), 0) / 60.0, 1) AS total_hours_played,
    IFNULL(SUM(s.total_amount), 0.00) AS total_revenue_generated
FROM gaming_pcs p
LEFT JOIN gaming_sessions s ON p.pc_id = s.pc_id AND s.status = 'Completed'
GROUP BY p.pc_id, p.pc_number, p.tier, p.status, p.hourly_rate;
