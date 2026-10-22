-- =============================================================
-- ARCADIA: Gaming Cafe Management System
-- Database Triggers: Automated State Synchronization & Safeguards
-- =============================================================

USE arcadia_db;

DELIMITER $$

-- -------------------------------------------------------------
-- Trigger 1: Hardware State Synchronization on Session Start
-- Automatically flips the PC status to 'In Use' when a session starts.
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_session_insert$$
CREATE TRIGGER trg_after_session_insert
AFTER INSERT ON gaming_sessions
FOR EACH ROW
BEGIN
    IF NEW.status = 'Active' THEN
        UPDATE gaming_pcs 
        SET status = 'In Use' 
        WHERE pc_id = NEW.pc_id;
    END IF;
END$$

-- -------------------------------------------------------------
-- Trigger 2: Hardware Availability Enforcement Guard
-- Prevents starting a session on a PC that is currently 'In Use' or 'Maintenance'.
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_before_session_insert_guard$$
CREATE TRIGGER trg_before_session_insert_guard
BEFORE INSERT ON gaming_sessions
FOR EACH ROW
BEGIN
    DECLARE v_rig_status VARCHAR(20);
    
    SELECT status INTO v_rig_status 
    FROM gaming_pcs 
    WHERE pc_id = NEW.pc_id 
    FOR UPDATE;

    IF v_rig_status IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Integrity Error: Selected Gaming PC does not exist.';
    END IF;

    IF v_rig_status <> 'Available' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Conflict Error: Gaming PC is not available (In Use or Maintenance).';
    END IF;
END$$

-- -------------------------------------------------------------
-- Trigger 3: Automatic Hardware Release on Session Termination
-- When a session changes from 'Active' to 'Completed' or 'Cancelled',
-- the associated PC is automatically restored to 'Available'.
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_session_update_release$$
CREATE TRIGGER trg_after_session_update_release
AFTER UPDATE ON gaming_sessions
FOR EACH ROW
BEGIN
    IF OLD.status = 'Active' AND NEW.status IN ('Completed', 'Cancelled') THEN
        UPDATE gaming_pcs 
        SET status = 'Available' 
        WHERE pc_id = NEW.pc_id;
    END IF;
END$$

-- -------------------------------------------------------------
-- Trigger 4: Membership Expiration Status Automated Guard
-- Automatically validates if end_date has passed when updating memberships.
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_before_membership_check$$
CREATE TRIGGER trg_before_membership_check
BEFORE UPDATE ON customer_memberships
FOR EACH ROW
BEGIN
    IF NEW.end_date < CURDATE() AND NEW.status = 'Active' THEN
        SET NEW.status = 'Expired';
    END IF;
END$$

DELIMITER ;
