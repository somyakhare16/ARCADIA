-- =============================================================
-- ARCADIA: Gaming Cafe Management System
-- Stored Procedures: Business Logic, ACID Transactions & Cursors
-- =============================================================

USE arcadia_db;

DELIMITER $$

-- -------------------------------------------------------------
-- Procedure 1: Start Gaming Session with Dynamic Membership Discount
-- Validates customer & rig, calculates discounted rate, and starts session
-- -------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_start_gaming_session$$
CREATE PROCEDURE sp_start_gaming_session(
    IN p_customer_id INT,
    IN p_pc_id INT,
    OUT p_session_id INT
)
proc_scope: BEGIN
    DECLARE v_pc_status VARCHAR(20);
    DECLARE v_base_rate DECIMAL(10, 2);
    DECLARE v_discount DECIMAL(5, 2) DEFAULT 0.00;
    DECLARE v_effective_rate DECIMAL(10, 2);
    DECLARE v_customer_exists INT;

    -- Validate Customer Existence
    SELECT COUNT(*) INTO v_customer_exists FROM customers WHERE customer_id = p_customer_id;
    IF v_customer_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Validation Error: Customer not found.';
    END IF;

    -- Lookup Rig Status and Base Hourly Rate
    SELECT status, hourly_rate INTO v_pc_status, v_base_rate
    FROM gaming_pcs
    WHERE pc_id = p_pc_id;

    IF v_pc_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Validation Error: Gaming Rig does not exist.';
    END IF;

    IF v_pc_status <> 'Available' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conflict Error: Rig is currently in use or under maintenance.';
    END IF;

    -- Check for Active Membership discount
    SELECT IFNULL(mp.discount_percentage, 0.00) INTO v_discount
    FROM customer_memberships cm
    INNER JOIN membership_plans mp ON cm.plan_id = mp.plan_id
    WHERE cm.customer_id = p_customer_id 
      AND cm.status = 'Active' 
      AND cm.end_date >= CURDATE()
    ORDER BY mp.discount_percentage DESC
    LIMIT 1;

    -- Calculate Effective Rate (Base - Discount %)
    SET v_effective_rate = ROUND(v_base_rate * (1.00 - (v_discount / 100.00)), 2);

    -- Insert active session (Trigger trg_after_session_insert will mark PC as 'In Use')
    INSERT INTO gaming_sessions (customer_id, pc_id, start_time, applied_hourly_rate, status)
    VALUES (p_customer_id, p_pc_id, NOW(), v_effective_rate, 'Active');

    SET p_session_id = LAST_INSERT_ID();
END proc_scope$$

-- -------------------------------------------------------------
-- Procedure 2: Conclude Session & Settle Payment (ACID Transaction)
-- Demonstrates START TRANSACTION, COMMIT, ROLLBACK, row locking (FOR UPDATE)
-- -------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_end_session_and_settle$$
CREATE PROCEDURE sp_end_session_and_settle(
    IN p_session_id INT,
    IN p_payment_method VARCHAR(20),
    OUT p_duration_minutes INT,
    OUT p_total_amount DECIMAL(10, 2),
    OUT p_payment_id INT
)
tx_scope: BEGIN
    DECLARE v_start_time DATETIME;
    DECLARE v_applied_rate DECIMAL(10, 2);
    DECLARE v_customer_id INT;
    DECLARE v_current_status VARCHAR(20);
    DECLARE v_minutes INT;
    DECLARE v_charge DECIMAL(10, 2);

    -- Transaction Error Handler: Rollback on any SQL exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Atomic Unit of Work
    START TRANSACTION;

    -- Acquire row-level lock
    SELECT status, start_time, applied_hourly_rate, customer_id
    INTO v_current_status, v_start_time, v_applied_rate, v_customer_id
    FROM gaming_sessions
    WHERE session_id = p_session_id
    FOR UPDATE;

    IF v_current_status IS NULL OR v_current_status <> 'Active' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Action: Session is not currently active.';
    END IF;

    -- Calculate elapsed minutes with 1-minute minimum billing
    SET v_minutes = TIMESTAMPDIFF(MINUTE, v_start_time, NOW());
    IF v_minutes < 1 THEN
        SET v_minutes = 1;
    END IF;

    -- Calculate charge: (Minutes / 60) * Applied Hourly Rate
    SET v_charge = ROUND((v_minutes / 60.0) * v_applied_rate, 2);

    -- Update session log (Trigger trg_after_session_update_release releases PC to 'Available')
    UPDATE gaming_sessions
    SET end_time = NOW(),
        duration_minutes = v_minutes,
        total_amount = v_charge,
        status = 'Completed'
    WHERE session_id = p_session_id;

    -- Record corresponding payment receipt
    INSERT INTO payments (session_id, customer_id, amount, payment_method, payment_status, payment_time)
    VALUES (p_session_id, v_customer_id, v_charge, p_payment_method, 'Completed', NOW());

    SET p_payment_id = LAST_INSERT_ID();
    SET p_duration_minutes = v_minutes;
    SET p_total_amount = v_charge;

    COMMIT;
END tx_scope$$

-- -------------------------------------------------------------
-- Procedure 3: Revenue & Reconciliation Audit Report Using a CURSOR
-- Iterates through payment transactions row-by-row using an explicit MySQL CURSOR
-- -------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_cursor_financial_audit$$
CREATE PROCEDURE sp_cursor_financial_audit(
    IN p_start_date DATE,
    IN p_end_date DATE,
    OUT p_total_collected DECIMAL(10, 2),
    OUT p_transaction_count INT,
    OUT p_cash_volume DECIMAL(10, 2),
    OUT p_card_volume DECIMAL(10, 2),
    OUT p_upi_volume DECIMAL(10, 2)
)
cursor_scope: BEGIN
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_amount DECIMAL(10, 2);
    DECLARE v_method VARCHAR(20);

    -- 1. Declare Cursor
    DECLARE cur_payments CURSOR FOR
        SELECT amount, payment_method
        FROM payments
        WHERE payment_status = 'Completed'
          AND DATE(payment_time) BETWEEN p_start_date AND p_end_date;

    -- 2. Declare NOT FOUND condition handler
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    -- Initialize output accumulators
    SET p_total_collected = 0.00;
    SET p_transaction_count = 0;
    SET p_cash_volume = 0.00;
    SET p_card_volume = 0.00;
    SET p_upi_volume = 0.00;

    -- 3. Open Cursor
    OPEN cur_payments;

    -- 4. Iteration Loop with FETCH
    audit_loop: LOOP
        FETCH cur_payments INTO v_amount, v_method;
        IF v_done THEN
            LEAVE audit_loop;
        END IF;

        SET p_total_collected = p_total_collected + v_amount;
        SET p_transaction_count = p_transaction_count + 1;

        CASE v_method
            WHEN 'Cash' THEN SET p_cash_volume = p_cash_volume + v_amount;
            WHEN 'Card' THEN SET p_card_volume = p_card_volume + v_amount;
            WHEN 'UPI'  THEN SET p_upi_volume  = p_upi_volume  + v_amount;
        END CASE;
    END LOOP audit_loop;

    -- 5. Close Cursor to release resources
    CLOSE cur_payments;
END cursor_scope$$

DELIMITER ;
