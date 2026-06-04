-- ============================================================
-- Labor Connect — Full MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS labor_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE labor_connect;

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: job_providers
-- ============================================================
CREATE TABLE IF NOT EXISTS job_providers (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE,
  phone         VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  company_name  VARCHAR(150),
  profile_photo VARCHAR(255),
  address       TEXT,
  lat           DECIMAL(10,8),
  lng           DECIMAL(11,8),
  is_verified   TINYINT(1) DEFAULT 0,
  is_suspended  TINYINT(1) DEFAULT 0,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: workers
-- ============================================================
CREATE TABLE IF NOT EXISTS workers (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) UNIQUE,
  phone           VARCHAR(20) UNIQUE,
  password_hash   VARCHAR(255),
  photo_url       VARCHAR(255),
  bio             TEXT,
  skills          JSON,
  category        VARCHAR(100),
  experience_yrs  INT DEFAULT 0,
  wage_per_day    DECIMAL(10,2) DEFAULT 0,
  working_area    VARCHAR(200),
  availability    ENUM('available','busy','offline') DEFAULT 'offline',
  is_verified     TINYINT(1) DEFAULT 0,
  is_suspended    TINYINT(1) DEFAULT 0,
  rating_avg      DECIMAL(3,2) DEFAULT 0.00,
  rating_count    INT DEFAULT 0,
  lat             DECIMAL(10,8),
  lng             DECIMAL(11,8),
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: job_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS job_requests (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider_id           INT UNSIGNED NOT NULL,
  worker_id             INT UNSIGNED NOT NULL,
  title                 VARCHAR(200) NOT NULL,
  description           TEXT,
  work_location_lat     DECIMAL(10,8),
  work_location_lng     DECIMAL(11,8),
  work_location_address TEXT,
  expected_wage         DECIMAL(10,2),
  is_urgent             TINYINT(1) DEFAULT 0,
  status                ENUM('pending','accepted','rejected','completed','cancelled') DEFAULT 'pending',
  scheduled_at          DATETIME,
  completed_at          DATETIME,
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES job_providers(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id)   REFERENCES workers(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: ratings_reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS ratings_reviews (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_request_id INT UNSIGNED NOT NULL,
  reviewer_id   INT UNSIGNED NOT NULL,
  reviewer_role ENUM('admin','provider','worker') NOT NULL,
  reviewee_id   INT UNSIGNED NOT NULL,
  reviewee_role ENUM('admin','provider','worker') NOT NULL,
  rating        TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text   TEXT,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_request_id) REFERENCES job_requests(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED NOT NULL,
  user_role      ENUM('admin','provider','worker') NOT NULL,
  title          VARCHAR(200) NOT NULL,
  body           TEXT,
  is_read        TINYINT(1) DEFAULT 0,
  job_request_id INT UNSIGNED,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: chat_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_request_id INT UNSIGNED NOT NULL,
  sender_id      INT UNSIGNED NOT NULL,
  sender_role    ENUM('admin','provider','worker') NOT NULL,
  message        TEXT NOT NULL,
  sent_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_request_id) REFERENCES job_requests(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: locations
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  user_role  ENUM('admin','provider','worker') NOT NULL,
  lat        DECIMAL(10,8),
  lng        DECIMAL(11,8),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_role (user_id, user_role)
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin (password: Admin@123)
INSERT INTO admins (name, email, password_hash) VALUES
('Super Admin', 'admin@laborconnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Job Providers (password: Test@1234)
INSERT INTO job_providers (name, email, phone, password_hash, company_name, address, lat, lng, is_verified) VALUES
('Rajesh Kumar', 'rajesh@example.com', '9876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kumar Constructions', 'MG Road, Bengaluru', 12.9716, 77.5946, 1),
('Priya Sharma', 'priya@example.com', '9876543211', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sharma Enterprises', 'Indiranagar, Bengaluru', 12.9784, 77.6408, 1);

-- Workers (password: Test@1234)
INSERT INTO workers (name, email, phone, password_hash, bio, skills, category, experience_yrs, wage_per_day, working_area, availability, is_verified, rating_avg, rating_count, lat, lng) VALUES
('Suresh Naik', 'suresh@example.com', '9123456789', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Experienced electrician with 5+ years', '["Electrician","Wiring","Panel Installation"]', 'Electrician', 5, 800.00, 'Bengaluru North', 'available', 1, 4.50, 12, 12.9800, 77.5900),
('Manoj Reddy', 'manoj@example.com', '9123456790', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Skilled plumber for residential and commercial', '["Plumbing","Pipe Fitting","Drainage"]', 'Plumber', 3, 650.00, 'Bengaluru South', 'available', 1, 4.20, 8, 12.9500, 77.6100),
('Ravi Shankar', 'ravi@example.com', '9123456791', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'General construction and carpentry worker', '["Carpentry","Masonry","Painting"]', 'Carpenter', 7, 700.00, 'Bengaluru East', 'busy', 0, 3.80, 5, 12.9900, 77.6500);
