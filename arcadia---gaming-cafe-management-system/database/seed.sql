-- =============================================================
-- ARCADIA: Gaming Cafe Management System
-- Sample Seed Data for Demonstrations & Testing
-- =============================================================

USE arcadia_db;

-- 1. Global Cafe Settings
INSERT INTO cafe_settings (setting_id, cafe_name, default_hourly_rate, contact_email, contact_phone, currency_symbol)
VALUES (1, 'ARCADIA Esports Arena', 10.00, 'ops@arcadiaesports.com', '+1 (800) 555-RIGS', '$')
ON DUPLICATE KEY UPDATE setting_id=1;

-- 2. Administrators & Staff
-- Password for all seed accounts is: admin123 (bcrypt hashed)
INSERT INTO admins (username, email, password_hash, role) VALUES 
('admin', 'admin@arcadia.lan', '$2a$10$wT8m9i/2O6P9z4h6eE4gUuKzXjT0f1xK.V5QWbYgY7N3mQ3Rk1h7O', 'SuperAdmin'),
('operator_neo', 'neo@arcadia.lan', '$2a$10$wT8m9i/2O6P9z4h6eE4gUuKzXjT0f1xK.V5QWbYgY7N3mQ3Rk1h7O', 'Operator');

-- 3. Membership Tier Plans
INSERT INTO membership_plans (plan_id, plan_name, price, validity_days, discount_percentage, benefits, is_active) VALUES
(1, 'Bronze Casual', 25.00, 30, 5.00, '5% discount on all rigs, reserved weekend seating.', TRUE),
(2, 'Silver Pro Gamer', 60.00, 60, 15.00, '15% hourly discount, 1 complimentary energy beverage per visit, VIP rig access.', TRUE),
(3, 'Elite Esports Champion', 120.00, 90, 25.00, '25% hourly discount, custom per-game peripheral profile, private booth access, tournament entry.', TRUE);

-- 4. Gaming PC Fleet (8 Rigs across tiers)
INSERT INTO gaming_pcs (pc_id, pc_number, specs, tier, hourly_rate, status, purchase_date) VALUES
(1, 'RIG-01-VIP', 'Intel Core i9-14900K, RTX 4090 24GB, 64GB DDR5, 360Hz Alienware OLED', 'VIP_Ultra', 16.00, 'Available', '2025-01-15'),
(2, 'RIG-02-VIP', 'Intel Core i9-14900K, RTX 4090 24GB, 64GB DDR5, 360Hz Alienware OLED', 'VIP_Ultra', 16.00, 'Available', '2025-01-15'),
(3, 'RIG-03-PERF', 'AMD Ryzen 7 7800X3D, RTX 4080 Super, 32GB DDR5, 240Hz ROG OLED', 'Performance', 12.00, 'Available', '2025-02-10'),
(4, 'RIG-04-PERF', 'AMD Ryzen 7 7800X3D, RTX 4080 Super, 32GB DDR5, 240Hz ROG OLED', 'Performance', 12.00, 'Available', '2025-02-10'),
(5, 'RIG-05-STD', 'Intel Core i5-14600KF, RTX 4070 12GB, 32GB DDR5, 180Hz Fast-IPS', 'Standard', 8.00, 'Available', '2025-03-01'),
(6, 'RIG-06-STD', 'Intel Core i5-14600KF, RTX 4070 12GB, 32GB DDR5, 180Hz Fast-IPS', 'Standard', 8.00, 'Available', '2025-03-01'),
(7, 'RIG-07-STD', 'Intel Core i5-13400F, RTX 3060 Ti, 16GB RAM, 144Hz IPS', 'Standard', 6.00, 'Maintenance', '2024-11-20'),
(8, 'RIG-08-STREAM', 'Dual Rig Setup: Ryzen 9 7950X, RTX 4090, 4K Elgato Cam Link, Shure SM7B', 'Streaming', 20.00, 'Available', '2025-04-05');

-- 5. Customer Registry
INSERT INTO customers (customer_id, full_name, phone, email, created_at) VALUES
(1, 'Marcus Vance', '+1 (555) 234-5678', 'marcus.v@nightcity.io', DATE_SUB(NOW(), INTERVAL 45 DAY)),
(2, 'Seraphina Lin', '+1 (555) 345-6789', 'lin.seraphina@vertex.gg', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(3, 'Dante Alighieri', '+1 (555) 456-7890', 'dante@inferno.org', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(4, 'Kaelen Voss', '+1 (555) 567-8901', 'kael.voss@chronos.net', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(5, 'Aria Sterling', '+1 (555) 678-9012', 'aria.s@valkyrie.com', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(6, 'Victor Creed', '+1 (555) 789-0123', 'victor.creed@apex.org', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 6. Customer Membership Subscriptions
INSERT INTO customer_memberships (customer_id, plan_id, start_date, end_date, status) VALUES
(1, 3, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 70 DAY), 'Active'),
(2, 2, DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Active'),
(3, 1, DATE_SUB(CURDATE(), INTERVAL 40 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Expired'),
(5, 1, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_ADD(CURDATE(), INTERVAL 26 DAY), 'Active');

-- 7. Completed Gaming Sessions
INSERT INTO gaming_sessions (session_id, customer_id, pc_id, start_time, end_time, duration_minutes, applied_hourly_rate, total_amount, status) VALUES
(1, 1, 1, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 DAY), INTERVAL 180 MINUTE), 180, 12.00, 36.00, 'Completed'), -- VIP rig $16 - 25% discount = $12/hr
(2, 2, 3, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 DAY), INTERVAL 120 MINUTE), 120, 10.20, 20.40, 'Completed'), -- Perf rig $12 - 15% discount = $10.20/hr
(3, 3, 5, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 DAY), INTERVAL 90 MINUTE), 90, 8.00, 12.00, 'Completed'),   -- Standard rig $8 (Expired plan, full price)
(4, 4, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 240 MINUTE), 240, 16.00, 64.00, 'Completed'), -- Non-member, $16/hr * 4 hrs
(5, 5, 4, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 150 MINUTE), 150, 11.40, 28.50, 'Completed'); -- Perf rig $12 - 5% discount = $11.40/hr

-- 8. Payment Receipts
INSERT INTO payments (payment_id, session_id, customer_id, amount, payment_method, payment_status, payment_time) VALUES
(1, 1, 1, 36.00, 'UPI', 'Completed', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, NULL, 1, 120.00, 'Card', 'Completed', DATE_SUB(NOW(), INTERVAL 20 DAY)), -- Elite Plan subscription fee
(3, 2, 2, 20.40, 'Card', 'Completed', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, NULL, 2, 60.00, 'Cash', 'Completed', DATE_SUB(NOW(), INTERVAL 15 DAY)),  -- Silver Plan fee
(5, 3, 3, 12.00, 'Cash', 'Completed', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 4, 4, 64.00, 'UPI', 'Completed', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(7, 5, 5, 28.50, 'Card', 'Completed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(8, NULL, 5, 25.00, 'UPI', 'Completed', DATE_SUB(NOW(), INTERVAL 4 DAY));   -- Bronze Plan fee
