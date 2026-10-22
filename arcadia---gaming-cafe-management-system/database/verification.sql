-- =============================================================
-- ARCADIA: Gaming Cafe Management System
-- Verification Script: Automated Tests & DBMS Concept Checks
-- =============================================================

USE arcadia_db;

-- 1. Table Record Verification
SELECT 'admins' AS table_name, COUNT(*) AS record_count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'membership_plans', COUNT(*) FROM membership_plans
UNION ALL
SELECT 'customer_memberships', COUNT(*) FROM customer_memberships
UNION ALL
SELECT 'gaming_pcs', COUNT(*) FROM gaming_pcs
UNION ALL
SELECT 'gaming_sessions', COUNT(*) FROM gaming_sessions
UNION ALL
SELECT 'payments', COUNT(*) FROM payments;

-- 2. Verify Dashboard View
SELECT * FROM vw_dashboard_kpis;

-- 3. Verify Customer History View
SELECT * FROM vw_customer_roster LIMIT 3;

-- 4. Test Trigger 1 & 2: Start a Session via Stored Procedure
-- Marcus Vance (ID 1 - has 25% Elite discount) starts session on RIG-01-VIP (ID 1 - base $16/hr)
CALL sp_start_gaming_session(1, 1, @created_session_id);
SELECT @created_session_id AS new_session_id;

-- Verify PC status was flipped to 'In Use' by Trigger trg_after_session_insert
SELECT pc_id, pc_number, status FROM gaming_pcs WHERE pc_id = 1;

-- Verify Trigger 2 Guard: Attempting to start another session on RIG-01-VIP MUST FAIL
-- (Uncomment to test expected error: Conflict Error: Gaming PC is not available)
-- CALL sp_start_gaming_session(2, 1, @fail_session_id);

-- 5. Test Procedure 2: Conclude Session & Settle Payment with ACID Transaction
CALL sp_end_session_and_settle(@created_session_id, 'UPI', @duration_mins, @billed_cost, @receipt_id);
SELECT @duration_mins AS billed_minutes, @billed_cost AS charged_dollars, @receipt_id AS payment_id;

-- Verify Trigger 3: RIG-01-VIP must be automatically released back to 'Available'
SELECT pc_id, pc_number, status FROM gaming_pcs WHERE pc_id = 1;

-- 6. Test Procedure 3: Cursor-based Financial Audit
CALL sp_cursor_financial_audit('2025-01-01', '2026-12-31', @audit_total, @audit_count, @audit_cash, @audit_card, @audit_upi);
SELECT 
    @audit_total AS total_reconciled_revenue, 
    @audit_count AS total_transactions_audited, 
    @audit_cash AS cash_volume, 
    @audit_card AS card_volume, 
    @audit_upi AS upi_volume;
