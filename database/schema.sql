-- ========================================================
-- Complete Database Schema for Student Management System
-- Database Engine: MySQL 8.x / MariaDB
-- Database Name: student_management_db
-- Supports: Admin Portal & Student Portal with Role-based Auth
-- ========================================================

CREATE DATABASE IF NOT EXISTS student_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_management_db;

-- 1. Table: students
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    `year` INT NOT NULL,
    marks DOUBLE NOT NULL,
    contact VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    current_semester INT DEFAULT 1,
    academic_status VARCHAR(50) DEFAULT 'Active / Regular',
    fee_dues DOUBLE DEFAULT 135000.0,
    attendance_percentage DOUBLE DEFAULT 84.82,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_marks CHECK (marks >= 0.0 AND marks <= 100.0),
    CONSTRAINT chk_year CHECK (`year` >= 1 AND `year` <= 5)
);

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_department ON students(department);

-- 2. Table: users (Authentication and Roles)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL, -- 'ROLE_ADMIN' or 'ROLE_STUDENT'
    student_id VARCHAR(50) NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_student_id FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE INDEX idx_users_username ON users(username);

-- 3. Table: subjects (Curriculum courses across Semesters 1 to 8)
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL DEFAULT 3
);

CREATE INDEX idx_subjects_semester ON subjects(semester);

-- 4. Table: student_marks (Semester-wise marks)
CREATE TABLE IF NOT EXISTS student_marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    semester INT NOT NULL,
    internal_marks DOUBLE NOT NULL DEFAULT 0.0,
    external_marks DOUBLE NOT NULL DEFAULT 0.0,
    total_marks DOUBLE NOT NULL DEFAULT 0.0,
    grade VARCHAR(10) DEFAULT 'A',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_marks_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_marks_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE INDEX idx_marks_student_sem ON student_marks(student_id, semester);

-- 5. Table: student_attendance (Semester-wise attendance)
CREATE TABLE IF NOT EXISTS student_attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    semester INT NOT NULL,
    present_classes INT NOT NULL DEFAULT 0,
    total_classes INT NOT NULL DEFAULT 0,
    percentage DOUBLE NOT NULL DEFAULT 0.0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_att_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE INDEX idx_att_student_sem ON student_attendance(student_id, semester);

-- 6. Table: calendar_events (Semester & Institute Academic Events)
CREATE TABLE IF NOT EXISTS calendar_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- CLASS, EXAM, INTERNAL_EXAM, HOLIDAY, ASSIGNMENT, PROJECT_REVIEW, EVENT
    event_date DATE NOT NULL,
    department VARCHAR(100) DEFAULT 'ALL',
    semester INT NULL,
    description VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cal_event_date ON calendar_events(event_date);

-- 7. Table: feedbacks (Student submissions)
CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NULL,
    student_ref_id VARCHAR(50),
    student_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedbacks_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);
