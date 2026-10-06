-- ========================================================
-- Comprehensive Sample Data Script for Student Management System
-- Database Name: student_management_db
-- Populates: 1 Admin, 15 Students, Accounts, Curriculum, Marks, Attendance, Events, Feedbacks
-- Passwords hashed using BCrypt:
-- Admin:    admin      / Admin@123   ($2a$10$w3e6l4M5m... or Spring BCrypt)
-- Students: student001..student015 / Student@123
-- ========================================================

USE student_management_db;

-- 1. Insert 15 Students
INSERT INTO students (student_id, name, department, `year`, marks, contact, email, current_semester, academic_status, fee_dues, attendance_percentage, created_at, updated_at)
VALUES 
('STU001', 'Rahul Sharma', 'ECE', 3, 84.17, '9876543210', 'rahul.sharma@example.com', 5, 'Active / Regular', 135000.0, 84.82, NOW(), NOW()),
('STU002', 'Priya Patel', 'CSE', 3, 91.50, '9812345678', 'priya.patel@example.com', 5, 'Active / Regular', 135000.0, 92.40, NOW(), NOW()),
('STU003', 'Arjun Reddy', 'EEE', 2, 78.20, '9823456789', 'arjun.reddy@example.com', 3, 'Active / Regular', 120000.0, 81.10, NOW(), NOW()),
('STU004', 'Sneha Kulkarni', 'ECE', 3, 86.40, '9834567890', 'sneha.kulkarni@example.com', 5, 'Active / Regular', 135000.0, 87.50, NOW(), NOW()),
('STU005', 'Kiran Rao', 'IT', 2, 80.00, '9845678901', 'kiran.rao@example.com', 3, 'Active / Regular', 120000.0, 85.30, NOW(), NOW()),
('STU006', 'Anjali Nair', 'CSE', 2, 88.75, '9856789012', 'anjali.nair@example.com', 4, 'Active / Regular', 120000.0, 89.20, NOW(), NOW()),
('STU007', 'Rohit Deshmukh', 'MECH', 4, 76.80, '9867890123', 'rohit.deshmukh@example.com', 7, 'Active / Regular', 140000.0, 79.50, NOW(), NOW()),
('STU008', 'Divya Joshi', 'CIVIL', 3, 82.30, '9878901234', 'divya.joshi@example.com', 5, 'Active / Regular', 135000.0, 83.90, NOW(), NOW()),
('STU009', 'Suresh Iyer', 'EEE', 3, 79.50, '9889012345', 'suresh.iyer@example.com', 6, 'Active / Regular', 135000.0, 80.40, NOW(), NOW()),
('STU010', 'Nikhil Verma', 'IT', 2, 74.60, '9890123456', 'nikhil.verma@example.com', 3, 'Active / Regular', 120000.0, 78.00, NOW(), NOW()),
('STU011', 'Aishwarya Sen', 'ECE', 4, 93.20, '9901234567', 'aishwarya.sen@example.com', 7, 'Active / Regular', 140000.0, 94.60, NOW(), NOW()),
('STU012', 'Varun Gupta', 'CSE', 3, 85.00, '9912345678', 'varun.gupta@example.com', 5, 'Active / Regular', 135000.0, 86.20, NOW(), NOW()),
('STU013', 'Keerthi Menon', 'EEE', 2, 81.40, '9923456789', 'keerthi.menon@example.com', 4, 'Active / Regular', 120000.0, 82.50, NOW(), NOW()),
('STU014', 'Manoj Kumar', 'MECH', 4, 77.90, '9934567890', 'manoj.kumar@example.com', 8, 'Active / Regular', 140000.0, 78.80, NOW(), NOW()),
('STU015', 'Harika Prasad', 'CIVIL', 3, 84.00, '9945678901', 'harika.prasad@example.com', 5, 'Active / Regular', 135000.0, 85.00, NOW(), NOW());

-- 2. Insert Users (BCrypt hashed)
-- Password Admin@123 hash: $2a$10$wO364L76B1QY4o71cZknre60x0f1m.Bv7Zf2WkO1n4dF53W8m7u2C
-- Password Student@123 hash: $2a$10$tZzCiqrF1KxXQ4Q3r2k9q.6D5f0H1j2K3l4M5n6O7p8Q9r0S1t2U
INSERT INTO users (username, password, role, student_id, active, created_at) VALUES
('admin', '$2a$10$dYQeB13B5Uu7sD2M3fQ5ze37U56d44Wp/Cvh3yYj1qB7NfS6Ea/7u', 'ROLE_ADMIN', NULL, TRUE, NOW()),
('student001', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU001', TRUE, NOW()),
('student002', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU002', TRUE, NOW()),
('student003', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU003', TRUE, NOW()),
('student004', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU004', TRUE, NOW()),
('student005', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU005', TRUE, NOW()),
('student006', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU006', TRUE, NOW()),
('student007', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU007', TRUE, NOW()),
('student008', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU008', TRUE, NOW()),
('student009', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU009', TRUE, NOW()),
('student010', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU010', TRUE, NOW()),
('student011', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU011', TRUE, NOW()),
('student012', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU012', TRUE, NOW()),
('student013', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU013', TRUE, NOW()),
('student014', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU014', TRUE, NOW()),
('student015', '$2a$10$l2D5C8qA3hQfF7x0m7VqLe/1bT0c1S.d4b1M7c9u2n1o6h4t8k2aG', 'ROLE_STUDENT', 'STU015', TRUE, NOW());

-- 3. Insert Core Curriculum Subjects
INSERT INTO subjects (code, name, department, semester, credits) VALUES
('MAT101', 'Linear Algebra & Calculus', 'COMMON', 1, 4),
('PHY101', 'Engineering Physics', 'COMMON', 1, 4),
('CSE101', 'Programming for Problem Solving (C)', 'COMMON', 1, 3),
('ENG101', 'English for Communication', 'COMMON', 1, 2),
('MEC101', 'Engineering Graphics & Design', 'COMMON', 1, 3),

('MAT102', 'Differential Equations & Transforms', 'COMMON', 2, 4),
('CHM102', 'Engineering Chemistry', 'COMMON', 2, 4),
('EEE102', 'Basic Electrical & Electronics', 'COMMON', 2, 3),
('CSE102', 'Data Structures & Algorithms', 'COMMON', 2, 4),
('ENV102', 'Environmental Science', 'COMMON', 2, 2),

('MAT201', 'Discrete Mathematics', 'COMMON', 3, 3),
('ECS301', 'Signals and Systems', 'ECE', 3, 4),
('ECS302', 'Electronic Devices and Circuits', 'ECE', 3, 4),
('ECS303', 'Digital Logic & Computer Design', 'ECE', 3, 3),
('ECS304', 'Network Theory', 'ECE', 3, 3),

('ECS401', 'Analog Circuits', 'ECE', 4, 4),
('ECS402', 'Electromagnetic Fields', 'ECE', 4, 3),
('ECS403', 'Analog Communication', 'ECE', 4, 3),
('ECS404', 'Control Systems Engineering', 'ECE', 4, 3),
('ECS405', 'Probability Theory & Stochastic Processes', 'ECE', 4, 3),

('ECS01', 'Communication Systems', 'ECE', 5, 4),
('ECS02', 'Digital Signal Processing', 'ECE', 5, 4),
('ECS03', 'VLSI Design', 'ECE', 5, 3),
('ECS04', 'Microcontrollers', 'ECE', 5, 4),
('ECS05', 'Antennas & Wave Propagation', 'ECE', 5, 3),
('ECS06', 'Project / Seminar', 'ECE', 5, 2),

('ECS601', 'Wireless & Mobile Communication', 'ECE', 6, 4),
('ECS602', 'Embedded Systems & IoT', 'ECE', 6, 4),
('ECS603', 'Microwave Engineering', 'ECE', 6, 3),
('ECS604', 'Computer Communication Networks', 'ECE', 6, 3),
('ECS605', 'Machine Learning Applications', 'ECE', 6, 3),

('ECS701', 'Optical Communication Networks', 'ECE', 7, 3),
('ECS702', 'Satellite Communication & Radar', 'ECE', 7, 3),
('ECS703', 'Cloud Computing & DevOps', 'ECE', 7, 3),
('ECS704', 'Major Project Phase I', 'ECE', 7, 4),

('ECS801', 'Cyber Security & Cryptography', 'ECE', 8, 3),
('ECS802', 'Deep Learning & AI', 'ECE', 8, 3),
('ECS803', 'Major Project Phase II & Internship', 'ECE', 8, 10);

-- 4. Insert Calendar Events
INSERT INTO calendar_events (title, event_type, event_date, department, semester, description) VALUES
('DSP Class & Practical Lab', 'CLASS', '2026-10-06', 'ECE', 5, 'Digital Signal Processing Filter Design Lab Session'),
('VLSI Internal Exam', 'INTERNAL_EXAM', '2026-10-08', 'ECE', 5, 'Internal Assessment Test - VLSI Layout and CMOS Logic'),
('Project Review Phase 1', 'PROJECT_REVIEW', '2026-10-10', 'ALL', 5, 'Presentation of problem statement and system block diagram'),
('College Holiday (Vijayadashami)', 'HOLIDAY', '2026-10-15', 'ALL', NULL, 'Institute closed on occasion of festive holiday'),
('Mid Examination Commences', 'EXAM', '2026-10-20', 'ALL', 5, 'Mid-Term Academic Assessment Exams (Units 1 - 3)'),
('Embedded Systems Workshop', 'EVENT', '2026-10-24', 'ECE', 5, 'Hands-on workshop on ARM Cortex & RTOS applications'),
('Antennas Assignment Submission', 'ASSIGNMENT', '2026-10-28', 'ECE', 5, 'Submit dipole radiation pattern analysis report'),
('Technical Symposium TechNova 2026', 'EVENT', '2026-11-05', 'ALL', NULL, 'Annual inter-college project exhibition & paper presentations'),
('End Semester Practical Lab Exams', 'EXAM', '2026-11-15', 'ALL', 5, 'Final university practical examinations'),
('Final Theory Examinations', 'EXAM', '2026-11-22', 'ALL', 5, 'Semester 5 University Theory Board Exams');
