package com.studentmanagement.config;

import com.studentmanagement.entity.*;
import com.studentmanagement.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Initializes realistic sample student records, user accounts, subjects,
 * semester marks, attendance, and calendar events.
 */
@Configuration
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final StudentMarksRepository marksRepository;
    private final StudentAttendanceRepository attendanceRepository;
    private final CalendarEventRepository calendarRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;

    private final ExamScheduleRepository examScheduleRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentAssignmentRepository studentAssignmentRepository;
    private final StudyMaterialRepository studyMaterialRepository;
    private final NotificationRepository notificationRepository;
    private final AnnouncementRepository announcementRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final CampusEventRepository campusEventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final ClubRepository clubRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final AchievementRepository achievementRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final AuditLogRepository auditLogRepository;

    public DataInitializer(StudentRepository studentRepository,
                           UserRepository userRepository,
                           SubjectRepository subjectRepository,
                           StudentMarksRepository marksRepository,
                           StudentAttendanceRepository attendanceRepository,
                           CalendarEventRepository calendarRepository,
                           FeedbackRepository feedbackRepository,
                           PasswordEncoder passwordEncoder,
                           ExamScheduleRepository examScheduleRepository,
                           AssignmentRepository assignmentRepository,
                           StudentAssignmentRepository studentAssignmentRepository,
                           StudyMaterialRepository studyMaterialRepository,
                           NotificationRepository notificationRepository,
                           AnnouncementRepository announcementRepository,
                           FeePaymentRepository feePaymentRepository,
                           CampusEventRepository campusEventRepository,
                           EventRegistrationRepository eventRegistrationRepository,
                           ClubRepository clubRepository,
                           ClubMemberRepository clubMemberRepository,
                           AchievementRepository achievementRepository,
                           SystemSettingRepository systemSettingRepository,
                           AuditLogRepository auditLogRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.marksRepository = marksRepository;
        this.attendanceRepository = attendanceRepository;
        this.calendarRepository = calendarRepository;
        this.feedbackRepository = feedbackRepository;
        this.passwordEncoder = passwordEncoder;
        this.examScheduleRepository = examScheduleRepository;
        this.assignmentRepository = assignmentRepository;
        this.studentAssignmentRepository = studentAssignmentRepository;
        this.studyMaterialRepository = studyMaterialRepository;
        this.notificationRepository = notificationRepository;
        this.announcementRepository = announcementRepository;
        this.feePaymentRepository = feePaymentRepository;
        this.campusEventRepository = campusEventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.clubRepository = clubRepository;
        this.clubMemberRepository = clubMemberRepository;
        this.achievementRepository = achievementRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void run(String... args) {
        initUsersAndStudents();
        initSubjects();
        initMarksAndAttendance();
        initCalendarEvents();
        initFeedbacks();
        initExams();
        initAssignments();
        initStudyMaterials();
        initNotifications();
        initAnnouncements();
        initFeePayments();
        initCampusEvents();
        initClubs();
        initAchievements();
        initSystemSettings();
        initAuditLogs();
    }

    private void initUsersAndStudents() {
        // 1. Admin account
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(null, "admin", passwordEncoder.encode("Admin@123"), "ROLE_ADMIN", null, true);
            userRepository.save(admin);
            log.info("Created Admin account: admin / Admin@123");
        }

        // 2. Demo 15 Students
        if (studentRepository.count() == 0) {
            log.info("Seeding 15 realistic student records...");

            List<Student> students = List.of(
                    new Student(null, "STU001", "Rahul Sharma", "ECE", 3, 84.17, "9876543210", "rahul.sharma@example.com", 5, "Active / Regular", 135000.0, 84.82),
                    new Student(null, "STU002", "Priya Patel", "CSE", 3, 91.50, "9812345678", "priya.patel@example.com", 5, "Active / Regular", 135000.0, 92.40),
                    new Student(null, "STU003", "Arjun Reddy", "EEE", 2, 78.20, "9823456789", "arjun.reddy@example.com", 3, "Active / Regular", 120000.0, 81.10),
                    new Student(null, "STU004", "Sneha Kulkarni", "ECE", 3, 86.40, "9834567890", "sneha.kulkarni@example.com", 5, "Active / Regular", 135000.0, 87.50),
                    new Student(null, "STU005", "Kiran Rao", "IT", 2, 80.00, "9845678901", "kiran.rao@example.com", 3, "Active / Regular", 120000.0, 85.30),
                    new Student(null, "STU006", "Anjali Nair", "CSE", 2, 88.75, "9856789012", "anjali.nair@example.com", 4, "Active / Regular", 120000.0, 89.20),
                    new Student(null, "STU007", "Rohit Deshmukh", "MECH", 4, 62.40, "9867890123", "rohit.deshmukh@example.com", 7, "Active / Warning", 140000.0, 64.50),
                    new Student(null, "STU008", "Divya Joshi", "CIVIL", 3, 82.30, "9878901234", "divya.joshi@example.com", 5, "Active / Regular", 135000.0, 83.90),
                    new Student(null, "STU009", "Suresh Iyer", "EEE", 3, 79.50, "9889012345", "suresh.iyer@example.com", 6, "Active / Regular", 135000.0, 80.40),
                    new Student(null, "STU010", "Nikhil Verma", "IT", 2, 70.10, "9890123456", "nikhil.verma@example.com", 3, "Active / Warning", 120000.0, 71.00),
                    new Student(null, "STU011", "Aishwarya Sen", "ECE", 4, 93.20, "9901234567", "aishwarya.sen@example.com", 7, "Active / Regular", 140000.0, 94.60),
                    new Student(null, "STU012", "Varun Gupta", "CSE", 3, 85.00, "9912345678", "varun.gupta@example.com", 5, "Active / Regular", 135000.0, 86.20),
                    new Student(null, "STU013", "Keerthi Menon", "EEE", 2, 81.40, "9923456789", "keerthi.menon@example.com", 4, "Active / Regular", 120000.0, 82.50),
                    new Student(null, "STU014", "Manoj Kumar", "MECH", 4, 77.90, "9934567890", "manoj.kumar@example.com", 8, "Active / Regular", 140000.0, 78.80),
                    new Student(null, "STU015", "Harika Prasad", "CIVIL", 3, 84.00, "9945678901", "harika.prasad@example.com", 5, "Active / Regular", 135000.0, 85.00)
            );

            studentRepository.saveAll(students);
            log.info("Saved 15 student records.");

            // Create matching 15 user accounts: student001 to student015 with password Student@123
            String encodedStudentPassword = passwordEncoder.encode("Student@123");
            List<User> userAccounts = new ArrayList<>();
            for (int i = 1; i <= 15; i++) {
                String username = String.format("student%03d", i);
                String studentId = String.format("STU%03d", i);
                if (!userRepository.existsByUsername(username)) {
                    userAccounts.add(new User(null, username, encodedStudentPassword, "ROLE_STUDENT", studentId, true));
                }
            }
            userRepository.saveAll(userAccounts);
            log.info("Created 15 student user accounts (student001..student015) with password Student@123.");
        }
    }

    private void initSubjects() {
        if (subjectRepository.count() == 0) {
            log.info("Seeding academic curriculum subjects across Semesters 1 to 8...");

            List<Subject> subjects = new ArrayList<>();

            // Semester 1 (Common First Year)
            subjects.add(new Subject(null, "MAT101", "Linear Algebra & Calculus", "COMMON", 1, 4));
            subjects.add(new Subject(null, "PHY101", "Engineering Physics", "COMMON", 1, 4));
            subjects.add(new Subject(null, "CSE101", "Programming for Problem Solving (C)", "COMMON", 1, 3));
            subjects.add(new Subject(null, "ENG101", "English for Communication", "COMMON", 1, 2));
            subjects.add(new Subject(null, "MEC101", "Engineering Graphics & Design", "COMMON", 1, 3));

            // Semester 2
            subjects.add(new Subject(null, "MAT102", "Differential Equations & Transforms", "COMMON", 2, 4));
            subjects.add(new Subject(null, "CHM102", "Engineering Chemistry", "COMMON", 2, 4));
            subjects.add(new Subject(null, "EEE102", "Basic Electrical & Electronics Engineering", "COMMON", 2, 3));
            subjects.add(new Subject(null, "CSE102", "Data Structures & Algorithms", "COMMON", 2, 4));
            subjects.add(new Subject(null, "ENV102", "Environmental Science", "COMMON", 2, 2));

            // Semester 3
            subjects.add(new Subject(null, "MAT201", "Discrete Mathematics", "COMMON", 3, 3));
            subjects.add(new Subject(null, "ECS301", "Signals and Systems", "ECE", 3, 4));
            subjects.add(new Subject(null, "ECS302", "Electronic Devices and Circuits", "ECE", 3, 4));
            subjects.add(new Subject(null, "ECS303", "Digital Logic & Computer Design", "ECE", 3, 3));
            subjects.add(new Subject(null, "ECS304", "Network Theory", "ECE", 3, 3));

            // Semester 4
            subjects.add(new Subject(null, "ECS401", "Analog Circuits", "ECE", 4, 4));
            subjects.add(new Subject(null, "ECS402", "Electromagnetic Fields", "ECE", 4, 3));
            subjects.add(new Subject(null, "ECS403", "Analog Communication", "ECE", 4, 3));
            subjects.add(new Subject(null, "ECS404", "Control Systems Engineering", "ECE", 4, 3));
            subjects.add(new Subject(null, "ECS405", "Probability Theory & Stochastic Processes", "ECE", 4, 3));

            // Semester 5 (Core requirement from prompt!)
            subjects.add(new Subject(null, "ECS01", "Communication Systems", "ECE", 5, 4));
            subjects.add(new Subject(null, "ECS02", "Digital Signal Processing", "ECE", 5, 4));
            subjects.add(new Subject(null, "ECS03", "VLSI Design", "ECE", 5, 3));
            subjects.add(new Subject(null, "ECS04", "Microcontrollers", "ECE", 5, 4));
            subjects.add(new Subject(null, "ECS05", "Antennas & Wave Propagation", "ECE", 5, 3));
            subjects.add(new Subject(null, "ECS06", "Project / Seminar", "ECE", 5, 2));

            // Semester 6
            subjects.add(new Subject(null, "ECS601", "Wireless & Mobile Communication", "ECE", 6, 4));
            subjects.add(new Subject(null, "ECS602", "Embedded Systems & IoT", "ECE", 6, 4));
            subjects.add(new Subject(null, "ECS603", "Microwave Engineering", "ECE", 6, 3));
            subjects.add(new Subject(null, "ECS604", "Computer Communication Networks", "ECE", 6, 3));
            subjects.add(new Subject(null, "ECS605", "Machine Learning Applications", "ECE", 6, 3));

            // Semester 7
            subjects.add(new Subject(null, "ECS701", "Optical Communication Networks", "ECE", 7, 3));
            subjects.add(new Subject(null, "ECS702", "Satellite Communication & Radar", "ECE", 7, 3));
            subjects.add(new Subject(null, "ECS703", "Cloud Computing & DevOps", "ECE", 7, 3));
            subjects.add(new Subject(null, "ECS704", "Major Project Phase I", "ECE", 7, 4));

            // Semester 8
            subjects.add(new Subject(null, "ECS801", "Cyber Security & Cryptography", "ECE", 8, 3));
            subjects.add(new Subject(null, "ECS802", "Deep Learning & AI", "ECE", 8, 3));
            subjects.add(new Subject(null, "ECS803", "Major Project Phase II & Internship", "ECE", 8, 10));

            subjectRepository.saveAll(subjects);
            log.info("Saved {} subjects for curriculum.", subjects.size());
        }
    }

    private void initMarksAndAttendance() {
        if (marksRepository.count() == 0) {
            log.info("Seeding academic marks and attendance for students...");

            List<Student> students = studentRepository.findAll();
            List<Subject> sem5Subjects = subjectRepository.findBySemesterOrderByCodeAsc(5);

            for (Student student : students) {
                // Seed Semester 5 (or their current semester)
                if ("STU001".equals(student.getStudentId())) {
                    // Exact marks and attendance requested in prompt for STU001 (Rahul Sharma):
                    // ECS01 | Communication Systems | 16 | 68 | 84 | Present 42 / 48 (87.5%)
                    // ECS02 | Digital Signal Processing | 17 | 68 | 85 | Present 40 / 48 (83.3%)
                    // ECS03 | VLSI Design | 15 | 58 | 73 | Present 43 / 48 (89.6%)
                    // ECS04 | Microcontrollers | 18 | 70 | 88 | Present 39 / 48 (81.2%)
                    // ECS05 | Antennas & Wave Propagation | 16 | 64 | 80 | Present 41 / 48 (85.4%)
                    // ECS06 | Project / Seminar | 19 | 76 | 95 | Present 46 / 48 (95.8%)
                    for (Subject sub : sem5Subjects) {
                        double internal = 16.0;
                        double external = 68.0;
                        int present = 42;
                        int total = 48;

                        switch (sub.getCode()) {
                            case "ECS01" -> { internal = 16.0; external = 68.0; present = 42; }
                            case "ECS02" -> { internal = 17.0; external = 68.0; present = 40; }
                            case "ECS03" -> { internal = 15.0; external = 58.0; present = 43; }
                            case "ECS04" -> { internal = 18.0; external = 70.0; present = 39; }
                            case "ECS05" -> { internal = 16.0; external = 64.0; present = 41; }
                            case "ECS06" -> { internal = 19.0; external = 76.0; present = 46; }
                        }

                        marksRepository.save(new StudentMarks(null, student, sub, 5, internal, external));
                        attendanceRepository.save(new StudentAttendance(null, student, sub, 5, present, total));
                    }
                } else if ("STU007".equals(student.getStudentId())) {
                    // STU007: 1 backlog in sem 5 (e.g. 1st subject failed) and critical attendance shortage
                    int idx = 0;
                    for (Subject sub : sem5Subjects) {
                        double internal = (idx == 0) ? 8.0 : 13.0;
                        double external = (idx == 0) ? 24.0 : 48.0; // total 32 (Grade F)
                        int total = 48;
                        int present = (idx == 0) ? 26 : 30;
                        marksRepository.save(new StudentMarks(null, student, sub, 5, internal, external));
                        attendanceRepository.save(new StudentAttendance(null, student, sub, 5, present, total));
                        idx++;
                    }
                } else if ("STU010".equals(student.getStudentId())) {
                    // STU010: attendance ~ 70.8% (below 75% university norm)
                    for (Subject sub : sem5Subjects) {
                        double internal = 14.0;
                        double external = 52.0;
                        int total = 48;
                        int present = 34; // 70.8%
                        marksRepository.save(new StudentMarks(null, student, sub, 5, internal, external));
                        attendanceRepository.save(new StudentAttendance(null, student, sub, 5, present, total));
                    }
                } else {
                    // Realistic marks for other demo students
                    for (Subject sub : sem5Subjects) {
                        double internal = 14.0 + (int)(Math.random() * 6);
                        double external = 55.0 + (int)(Math.random() * 25);
                        int total = 48;
                        int present = 36 + (int)(Math.random() * 12);

                        marksRepository.save(new StudentMarks(null, student, sub, 5, internal, external));
                        attendanceRepository.save(new StudentAttendance(null, student, sub, 5, present, total));
                    }
                }

                // Also seed Semester 4 marks & attendance so students can test semester dropdown switching
                List<Subject> sem4Subjects = subjectRepository.findBySemesterOrderByCodeAsc(4);
                for (Subject sub : sem4Subjects) {
                    double internal = 15.0 + (int)(Math.random() * 5);
                    double external = 60.0 + (int)(Math.random() * 20);
                    int total = 45;
                    int present = 37 + (int)(Math.random() * 8);

                    marksRepository.save(new StudentMarks(null, student, sub, 4, internal, external));
                    attendanceRepository.save(new StudentAttendance(null, student, sub, 4, present, total));
                }

                // And Semester 3
                List<Subject> sem3Subjects = subjectRepository.findBySemesterOrderByCodeAsc(3);
                for (Subject sub : sem3Subjects) {
                    double internal = 15.0 + (int)(Math.random() * 5);
                    double external = 58.0 + (int)(Math.random() * 22);
                    int total = 45;
                    int present = 36 + (int)(Math.random() * 9);

                    marksRepository.save(new StudentMarks(null, student, sub, 3, internal, external));
                    attendanceRepository.save(new StudentAttendance(null, student, sub, 3, present, total));
                }
            }
            log.info("Saved academic marks and attendance records.");
        }
    }

    private void initCalendarEvents() {
        if (calendarRepository.count() == 0) {
            log.info("Seeding academic calendar events...");

            List<CalendarEvent> events = List.of(
                    new CalendarEvent(null, "DSP Class & Practical Lab", "CLASS", LocalDate.of(2026, 10, 6), "ECE", 5, "Digital Signal Processing Filter Design Lab Session"),
                    new CalendarEvent(null, "VLSI Internal Exam", "INTERNAL_EXAM", LocalDate.of(2026, 10, 8), "ECE", 5, "Internal Assessment Test - VLSI Layout and CMOS Logic"),
                    new CalendarEvent(null, "Project Review Phase 1", "PROJECT_REVIEW", LocalDate.of(2026, 10, 10), "ALL", 5, "Presentation of problem statement and system block diagram"),
                    new CalendarEvent(null, "College Holiday (Vijayadashami)", "HOLIDAY", LocalDate.of(2026, 10, 15), "ALL", null, "Institute closed on occasion of festive holiday"),
                    new CalendarEvent(null, "Mid Examination Commences", "EXAM", LocalDate.of(2026, 10, 20), "ALL", 5, "Mid-Term Academic Assessment Exams (Units 1 - 3)"),
                    new CalendarEvent(null, "Embedded Systems Workshop", "EVENT", LocalDate.of(2026, 10, 24), "ECE", 5, "Hands-on workshop on ARM Cortex & RTOS applications"),
                    new CalendarEvent(null, "Antennas Assignment Submission", "ASSIGNMENT", LocalDate.of(2026, 10, 28), "ECE", 5, "Submit dipole radiation pattern analysis report"),
                    new CalendarEvent(null, "Technical Symposium 'TechNova 2026'", "EVENT", LocalDate.of(2026, 11, 5), "ALL", null, "Annual inter-college project exhibition & paper presentations"),
                    new CalendarEvent(null, "End Semester Practical Lab Exams", "EXAM", LocalDate.of(2026, 11, 15), "ALL", 5, "Final university practical examinations"),
                    new CalendarEvent(null, "Final Theory Examinations", "EXAM", LocalDate.of(2026, 11, 22), "ALL", 5, "Semester 5 University Theory Board Exams")
            );

            calendarRepository.saveAll(events);
            log.info("Saved {} calendar events.", events.size());
        }
    }

    private void initFeedbacks() {
        if (feedbackRepository.count() == 0) {
            log.info("Seeding initial student feedbacks...");

            List<Feedback> feedbacks = List.of(
                    new Feedback(null, null, "STU001", "Rahul Sharma", 5, "The semester dashboard and attendance tracking are very intuitive and helpful!"),
                    new Feedback(null, null, "STU002", "Priya Patel", 5, "Quick access to previous semester marks and calendar makes preparing for exams much simpler."),
                    new Feedback(null, null, "STU004", "Sneha Kulkarni", 4, "Great platform. Clean interface and fast loading times.")
            );

            feedbackRepository.saveAll(feedbacks);
            log.info("Saved sample feedbacks.");
        }
    }

    private void initExams() {
        if (examScheduleRepository.count() == 0) {
            log.info("Seeding examination schedules...");
            List<ExamSchedule> exams = List.of(
                    new ExamSchedule(null, "ECS03", "VLSI Design", "Internal Exam", LocalDate.now().plusDays(8), "10:00 AM - 01:00 PM", "Room E-204", "E-204-12", 5, "ECE"),
                    new ExamSchedule(null, "ECS04", "Microcontrollers", "Internal Exam", LocalDate.now().plusDays(12), "10:00 AM - 01:00 PM", "Room E-205", "E-205-08", 5, "ECE"),
                    new ExamSchedule(null, "ECS02", "Digital Signal Processing", "Practical Lab Exam", LocalDate.now().plusDays(16), "02:00 PM - 05:00 PM", "DSP Lab 1", "LAB-14", 5, "ECE"),
                    new ExamSchedule(null, "ECS01", "Communication Systems", "Semester End Exam", LocalDate.now().plusDays(35), "09:30 AM - 12:30 PM", "Exam Hall A", "EH-45", 5, "ECE"),
                    new ExamSchedule(null, "ECS05", "Antennas & Wave Propagation", "Semester End Exam", LocalDate.now().plusDays(39), "09:30 AM - 12:30 PM", "Exam Hall B", "EH-12", 5, "ECE")
            );
            examScheduleRepository.saveAll(exams);
        }
    }

    private void initAssignments() {
        if (assignmentRepository.count() == 0) {
            log.info("Seeding assignments...");
            Assignment a1 = new Assignment(null, "ECS03", "VLSI Design", "CMOS Inverter Layout & Propagation Delay Analysis", "Design a CMOS inverter in Cadence/Spice and plot transient response curve with propagation delay calculation.", LocalDate.now().plusDays(14), 5, "ECE", 100);
            Assignment a2 = new Assignment(null, "ECS02", "Digital Signal Processing", "FFT Implementation & Filtering of ECG Signals", "Implement Radix-2 DIT FFT in MATLAB/Python to filter 50Hz power line noise from synthetic ECG signals.", LocalDate.now().plusDays(19), 5, "ECE", 100);
            Assignment a3 = new Assignment(null, "ECS04", "Microcontrollers", "8051 Interfacing with 16x2 LCD & Keypad", "Write an assembly/embedded C program to display matrix keypad input onto an LCD with debouncing logic.", LocalDate.now().minusDays(2), 5, "ECE", 50);

            List<Assignment> saved = assignmentRepository.saveAll(List.of(a1, a2, a3));

            studentRepository.findByStudentId("STU001").ifPresent(stu -> {
                StudentAssignment sa1 = new StudentAssignment(null, saved.get(0), stu, "PENDING");
                StudentAssignment sa2 = new StudentAssignment(null, saved.get(1), stu, "PENDING");
                StudentAssignment sa3 = new StudentAssignment(null, saved.get(2), stu, "SUBMITTED");
                sa3.setMarksAwarded(48.0);
                sa3.setSubmissionNotes("Completed assembly code and tested on Proteus simulator. Output verified.");
                studentAssignmentRepository.saveAll(List.of(sa1, sa2, sa3));
            });
        }
    }

    private void initStudyMaterials() {
        if (studyMaterialRepository.count() == 0) {
            log.info("Seeding study materials...");
            List<StudyMaterial> materials = List.of(
                    new StudyMaterial(null, "ECS02", "Digital Signal Processing", "Unit 1 - Discrete Time Signals & Systems Notes", "Detailed lecture notes covering LTI systems, linear convolution, and stability criteria.", "PDF", "DSP_Unit1_Signals_Systems.pdf", "#", "2.4 MB", LocalDate.now().minusDays(10), 5, "ECE"),
                    new StudyMaterial(null, "ECS02", "Digital Signal Processing", "Unit 2 - Z-Transform & ROC Properties", "Derivations of Z-transform pairs, Region of Convergence rules, and inverse Z-transform methods.", "PDF", "DSP_Unit2_ZTransform.pdf", "#", "3.1 MB", LocalDate.now().minusDays(8), 5, "ECE"),
                    new StudyMaterial(null, "ECS03", "VLSI Design", "Unit 1 - MOSFET Physics & Fabrication Steps", "MOS capacitor fundamentals, threshold voltage equations, and n-well CMOS fabrication flow.", "PDF", "VLSI_Unit1_MOSFET_Fab.pdf", "#", "4.2 MB", LocalDate.now().minusDays(5), 5, "ECE"),
                    new StudyMaterial(null, "ECS04", "Microcontrollers", "Unit 1 - 8051 Architecture & Assembly Programming", "Pin description, memory organization, SFRs, and addressing modes with assembly examples.", "PDF", "MCU_Unit1_8051_Arch.pdf", "#", "1.8 MB", LocalDate.now().minusDays(3), 5, "ECE")
            );
            studyMaterialRepository.saveAll(materials);
        }
    }

    private void initNotifications() {
        if (notificationRepository.count() == 0) {
            log.info("Seeding notifications...");
            List<Notification> notifs = List.of(
                    new Notification(null, "STU001", "Internal Exam Timetable Released", "Semester 5 mid-term examination schedule has been published. First exam on Oct 15.", "EXAM", false, "/student/exams"),
                    new Notification(null, "STU001", "Assignment Graded: Microcontrollers", "Your submission for 8051 Interfacing was evaluated. Score: 48/50.", "ASSIGNMENT", false, "/student/assignments"),
                    new Notification(null, "ALL", "Campus Placement Drive 2026-27", "TCS, Infosys, and Cognizant registrations open on campus placement portal.", "ANNOUNCEMENT", false, "/student/announcements"),
                    new Notification(null, "STU001", "Fee Payment Reminder", "Tuition fee balance of ₹1,35,000 is due by end of month.", "FEE", true, "/student/fees")
            );
            notificationRepository.saveAll(notifs);
        }
    }

    private void initAnnouncements() {
        if (announcementRepository.count() == 0) {
            log.info("Seeding campus announcements...");
            List<Announcement> announcements = List.of(
                    new Announcement(null, "Annual Technical Fest: INVENTO 2026", "Registrations are now open for inter-college project competitions, paper presentations, and robotics tracks.", "URGENT", "ALL", null, LocalDate.now().minusDays(2), LocalDate.now().plusDays(30), "Dean of Student Affairs"),
                    new Announcement(null, "Library Book Return Notice for Odd Semester", "All students are requested to return or renew reference books borrowed for mid-semester preparations.", "IMPORTANT", "ALL", null, LocalDate.now().minusDays(4), LocalDate.now().plusDays(15), "Chief Librarian"),
                    new Announcement(null, "ECE Department Industrial Visit to ISRO Satellite Center", "Students of 3rd Year ECE are invited to enroll for the one-day technical visit scheduled next month.", "NORMAL", "ECE", 3, LocalDate.now().minusDays(6), LocalDate.now().plusDays(20), "HOD ECE")
            );
            announcementRepository.saveAll(announcements);
        }
    }

    private void initFeePayments() {
        if (feePaymentRepository.count() == 0) {
            log.info("Seeding fee transactions...");
            studentRepository.findByStudentId("STU001").ifPresent(stu -> {
                FeePayment p1 = new FeePayment(null, stu, 5, 50000.0, LocalDate.of(2026, 7, 1), "Net Banking (Demo)", "TXN-20260701-01", "PAID", "Semester 5 Admission & Tuition Fee - Part 1");
                FeePayment p2 = new FeePayment(null, stu, 5, 50000.0, LocalDate.of(2026, 8, 1), "UPI (Demo)", "TXN-20260801-02", "PAID", "Semester 5 Laboratory & Library Fee - Part 2");
                feePaymentRepository.saveAll(List.of(p1, p2));
            });
        }
    }

    private void initCampusEvents() {
        if (campusEventRepository.count() == 0) {
            log.info("Seeding campus events master...");
            List<CampusEvent> events = List.of(
                    new CampusEvent(null, "Annual Hackathon: HackCamp 2026", "36-hour sprint creating AI, Web3 and IoT solutions with industry mentors.", LocalDate.now().plusDays(22), "09:00 AM - 09:00 PM", "Main Auditorium & Computing Center", "ACM & IEEE Student Chapter", "TECH", 300),
                    new CampusEvent(null, "Tech Fest: INVENTO 2026", "Flagship technical exhibition with 50+ project demos and robotics tracks.", LocalDate.now().plusDays(30), "10:00 AM - 06:00 PM", "Campus Open Ground", "Department of Engineering", "TECH", 1000),
                    new CampusEvent(null, "IEEE Hands-On Robotics Workshop", "Building autonomous line followers and obstacle avoiders with Arduino.", LocalDate.now().plusDays(37), "02:00 PM - 05:00 PM", "Robotics & Embedded Lab", "IEEE Student Branch", "WORKSHOP", 80),
                    new CampusEvent(null, "Annual Cultural Fest: SPANDAN", "3 days of musical performances, street plays, and cultural competitions.", LocalDate.now().plusDays(57), "05:00 PM - 10:00 PM", "Open Air Theatre", "Cultural Council", "CULTURAL", 1500)
            );
            List<CampusEvent> saved = campusEventRepository.saveAll(events);

            studentRepository.findByStudentId("STU001").ifPresent(stu -> {
                EventRegistration reg = new EventRegistration(null, saved.get(0), stu);
                eventRegistrationRepository.save(reg);
                saved.get(0).setRegisteredCount(1);
                campusEventRepository.save(saved.get(0));
            });
        }
    }

    private void initClubs() {
        if (clubRepository.count() == 0) {
            log.info("Seeding campus clubs...");
            List<Club> clubs = List.of(
                    new Club(null, "Coding Club", "DSA, full-stack web development, and competitive programming meetups.", "Prof. Sharma", "Every Wednesday, 4:00 PM", "Technical", 124, "code"),
                    new Club(null, "Robotics Club", "Building autonomous rovers, drones, and IoT automation hardware.", "Dr. Verma", "Every Thursday, 4:30 PM", "Technical", 86, "bot"),
                    new Club(null, "Cultural Society", "Music, dance, theatre and performing arts across all college events.", "Prof. Ananya", "Every Friday, 5:00 PM", "Cultural", 140, "music"),
                    new Club(null, "Photography Club", "Digital photography, video cinematography, and visual storytelling.", "Dr. Karthik", "Every Saturday, 10:00 AM", "Arts", 65, "camera"),
                    new Club(null, "Sports & Athletics", "Inter-college sports, football, badminton, and track training.", "Coach Rawat", "Daily 6:00 AM & 5:00 PM", "Sports", 110, "activity")
            );
            List<Club> saved = clubRepository.saveAll(clubs);

            studentRepository.findByStudentId("STU001").ifPresent(stu -> {
                ClubMember m1 = new ClubMember(null, saved.get(0), stu, "CORE_TEAM");
                ClubMember m2 = new ClubMember(null, saved.get(1), stu, "MEMBER");
                clubMemberRepository.saveAll(List.of(m1, m2));
            });
        }
    }

    private void initAchievements() {
        if (achievementRepository.count() == 0) {
            log.info("Seeding student achievements...");
            studentRepository.findByStudentId("STU001").ifPresent(stu -> {
                List<Achievement> list = List.of(
                        new Achievement(null, stu, "First Prize - Smart India Hackathon Regional Round", "Hackathon", LocalDate.of(2026, 8, 15), "Built an AI-driven automated crop disease detection and diagnosis system.", "#", "Ministry of Education"),
                        new Achievement(null, stu, "NPTEL Elite Gold Certificate in Deep Learning", "Certificate", LocalDate.of(2026, 7, 20), "Ranked in top 1% across 12-week intensive course with 94% final examination score.", "#", "IIT Madras"),
                        new Achievement(null, stu, "Best Technical Paper Presentation at IEEE Conclave", "Academic", LocalDate.of(2026, 6, 10), "Presented paper on 'Low Power 32-bit ALU Architecture using FinFET Technology'.", "#", "IEEE Bangalore Section")
                );
                achievementRepository.saveAll(list);
            });
        }
    }

    private void initSystemSettings() {
        if (systemSettingRepository.count() == 0) {
            log.info("Seeding system configuration settings...");
            List<SystemSetting> settings = List.of(
                    new SystemSetting(null, "min_attendance_percentage", "75.0", "Minimum attendance required to appear for university exams"),
                    new SystemSetting(null, "current_academic_year", "2026-2027", "Active college academic year"),
                    new SystemSetting(null, "current_semester", "5", "Current ongoing semester"),
                    new SystemSetting(null, "grading_scale", "10-POINT-UGC", "UGC 10-point relative and absolute grading scale"),
                    new SystemSetting(null, "at_risk_attendance_threshold", "75.0", "Attendance trigger threshold for automated risk detection"),
                    new SystemSetting(null, "at_risk_cgpa_threshold", "6.5", "CGPA trigger threshold for academic risk alerts")
            );
            systemSettingRepository.saveAll(settings);
        }
    }

    private void initAuditLogs() {
        if (auditLogRepository.count() == 0) {
            log.info("Seeding system audit logs...");
            List<AuditLog> logs = List.of(
                    new AuditLog(null, "admin", "INITIALIZATION", "SYSTEM", "SYS-001", "Campus Management Platform initialized with Phase 2 capabilities"),
                    new AuditLog(null, "admin", "PUBLISH", "EXAM", "EXAM-SEM5", "Published Semester 5 Mid-Term examination schedule"),
                    new AuditLog(null, "admin", "BROADCAST", "ANNOUNCEMENT", "ANN-001", "Broadcasted campus placement and annual tech fest notifications"),
                    new AuditLog(null, "admin", "UPDATE", "SETTING", "CFG-ATT", "Enforced UGC minimum attendance threshold at 75%")
            );
            auditLogRepository.saveAll(logs);
        }
    }
}
