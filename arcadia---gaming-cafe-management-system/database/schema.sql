-- =============================================================
-- ARCADIA: Gaming Cafe Management System
-- Database Schema: Tables, Primary Keys, Foreign Keys & Constraints
-- DBMS Target: MySQL 8.0+
-- Engine: InnoDB (for ACID Transaction & Foreign Key Support)
-- =============================================================

DROP DATABASE IF EXISTS arcadia_db;
CREATE DATABASE arcadia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE arcadia_db;

-- -------------------------------------------------------------
-- 1. System Administration & Operators
-- -------------------------------------------------------------
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SuperAdmin', 'Operator') NOT NULL DEFAULT 'Operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_username (username),
    INDEX idx_admin_email (email)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 2. Customer Profiles
-- -------------------------------------------------------------
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cust_phone (phone),
    INDEX idx_cust_email (email),
    INDEX idx_cust_name (full_name)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 3. Membership Tier Plans
-- -------------------------------------------------------------
CREATE TABLE membership_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    validity_days INT NOT NULL CHECK (validity_days > 0),
    discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00 CHECK (discount_percentage BETWEEN 0.00 AND 100.00),
    benefits TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 4. Customer Membership Subscriptions (Junction Table)
-- -------------------------------------------------------------
CREATE TABLE customer_memberships (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Active', 'Expired', 'Cancelled') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES membership_plans(plan_id) ON DELETE RESTRICT,
    INDEX idx_member_status (status),
    INDEX idx_member_dates (start_date, end_date),
    INDEX idx_member_customer (customer_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 5. Gaming Rig Fleet
-- -------------------------------------------------------------
CREATE TABLE gaming_pcs (
    pc_id INT AUTO_INCREMENT PRIMARY KEY,
    pc_number VARCHAR(20) NOT NULL UNIQUE,
    specs VARCHAR(255) NOT NULL,
    tier ENUM('Standard', 'Performance', 'VIP_Ultra', 'Streaming') NOT NULL DEFAULT 'Standard',
    hourly_rate DECIMAL(10, 2) NOT NULL CHECK (hourly_rate >= 0),
    status ENUM('Available', 'In Use', 'Maintenance') NOT NULL DEFAULT 'Available',
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pc_status (status),
    INDEX idx_pc_rate (hourly_rate)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 6. Gaming Sessions Log
-- -------------------------------------------------------------
CREATE TABLE gaming_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    pc_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NULL,
    duration_minutes INT DEFAULT 0 CHECK (duration_minutes >= 0),
    applied_hourly_rate DECIMAL(10, 2) NOT NULL CHECK (applied_hourly_rate >= 0),
    total_amount DECIMAL(10, 2) DEFAULT 0.00 CHECK (total_amount >= 0),
    status ENUM('Active', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (pc_id) REFERENCES gaming_pcs(pc_id) ON DELETE RESTRICT,
    INDEX idx_session_status (status),
    INDEX idx_session_timeline (start_time, end_time),
    INDEX idx_session_customer (customer_id),
    INDEX idx_session_pc (pc_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 7. Payment Receipts Ledger
-- -------------------------------------------------------------
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NULL,
    customer_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    payment_method ENUM('Cash', 'UPI', 'Card') NOT NULL,
    payment_status ENUM('Completed', 'Refunded', 'Failed') NOT NULL DEFAULT 'Completed',
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES gaming_sessions(session_id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_payment_time (payment_time),
    INDEX idx_payment_method (payment_method),
    INDEX idx_payment_customer (customer_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 8. Global Cafe Configuration
-- -------------------------------------------------------------
CREATE TABLE cafe_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    cafe_name VARCHAR(100) NOT NULL DEFAULT 'ARCADIA Esports Arena',
    default_hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 8.00,
    contact_email VARCHAR(100) NOT NULL DEFAULT 'operations@arcadia.lan',
    contact_phone VARCHAR(20) NOT NULL DEFAULT '+1 (555) 019-4830',
    currency_symbol VARCHAR(5) NOT NULL DEFAULT '$',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
