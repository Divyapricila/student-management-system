package com.studentmanagement.service;

import com.studentmanagement.dto.*;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SmartCampusAdminService {

    private final StudentRepository studentRepository;
    private final StudentMarksRepository studentMarksRepository;
    private final StudentAttendanceRepository studentAttendanceRepository;
    private final ExamScheduleRepository examScheduleRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudyMaterialRepository studyMaterialRepository;
    private final AnnouncementRepository announcementRepository;
    private final CampusEventRepository campusEventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final ClubRepository clubRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final SmartCampusService smartCampusService;
    private final AuditLogService auditLogService;

    public SmartCampusAdminService(
            StudentRepository studentRepository,
            StudentMarksRepository studentMarksRepository,
            StudentAttendanceRepository studentAttendanceRepository,
            ExamScheduleRepository examScheduleRepository,
            AssignmentRepository assignmentRepository,
            StudyMaterialRepository studyMaterialRepository,
            AnnouncementRepository announcementRepository,
            CampusEventRepository campusEventRepository,
            EventRegistrationRepository eventRegistrationRepository,
            ClubRepository clubRepository,
            ClubMemberRepository clubMemberRepository,
            FeePaymentRepository feePaymentRepository,
            SmartCampusService smartCampusService,
            AuditLogService auditLogService) {
        this.studentRepository = studentRepository;
        this.studentMarksRepository = studentMarksRepository;
        this.studentAttendanceRepository = studentAttendanceRepository;
        this.examScheduleRepository = examScheduleRepository;
        this.assignmentRepository = assignmentRepository;
        this.studyMaterialRepository = studyMaterialRepository;
        this.announcementRepository = announcementRepository;
        this.campusEventRepository = campusEventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.clubRepository = clubRepository;
        this.clubMemberRepository = clubMemberRepository;
        this.feePaymentRepository = feePaymentRepository;
        this.smartCampusService = smartCampusService;
        this.auditLogService = auditLogService;
    }

    // ==================== ADMIN DASHBOARD 2.0 ====================

    @Transactional(readOnly = true)
    public AdminDashboardStatsDTO getAdminDashboardStats() {
        AdminDashboardStatsDTO dto = new AdminDashboardStatsDTO();
        List<Student> students = studentRepository.findAll();

        dto.setTotalStudents((long) students.size());
        long active = students.stream().filter(s -> !"Suspended".equalsIgnoreCase(s.getAcademicStatus())).count();
        dto.setActiveStudents(active);
        dto.setDepartmentsCount(studentRepository.countDistinctDepartments());

        double totalAttendance = 0.0;
        double totalCgpa = 0.0;
        double totalPending = 0.0;
        long atRiskCount = 0;

        Map<String, Long> byDept = new LinkedHashMap<>();
        Map<String, Long> attDist = new LinkedHashMap<>();
        attDist.put("Good (≥80%)", 0L);
        attDist.put("Warning (75-79%)", 0L);
        attDist.put("Critical (<75%)", 0L);

        Map<String, Long> cgpaDist = new LinkedHashMap<>();
        cgpaDist.put("Distinction (≥9.0)", 0L);
        cgpaDist.put("First Class (8.0-8.9)", 0L);
        cgpaDist.put("Second Class (7.0-7.9)", 0L);
        cgpaDist.put("Below Average (<7.0)", 0L);

        for (Student s : students) {
            byDept.put(s.getDepartment(), byDept.getOrDefault(s.getDepartment(), 0L) + 1);

            double att = s.getAttendancePercentage() != null ? s.getAttendancePercentage() : 84.82;
            totalAttendance += att;
            if (att >= 80.0) attDist.put("Good (≥80%)", attDist.get("Good (≥80%)") + 1);
            else if (att >= 75.0) attDist.put("Warning (75-79%)", attDist.get("Warning (75-79%)") + 1);
            else attDist.put("Critical (<75%)", attDist.get("Critical (<75%)") + 1);

            double cgpa = smartCampusService.calculateCgpa(s);
            totalCgpa += cgpa;
            if (cgpa >= 9.0) cgpaDist.put("Distinction (≥9.0)", cgpaDist.get("Distinction (≥9.0)") + 1);
            else if (cgpa >= 8.0) cgpaDist.put("First Class (8.0-8.9)", cgpaDist.get("First Class (8.0-8.9)") + 1);
            else if (cgpa >= 7.0) cgpaDist.put("Second Class (7.0-7.9)", cgpaDist.get("Second Class (7.0-7.9)") + 1);
            else cgpaDist.put("Below Average (<7.0)", cgpaDist.get("Below Average (<7.0)") + 1);

            if (s.getFeeDues() != null) totalPending += s.getFeeDues();

            // Calculate if student is at risk
            if (att < 75.0 || cgpa < 6.5) {
                atRiskCount++;
            }
        }

        dto.setAverageAttendance(students.isEmpty() ? 0.0 : Math.round((totalAttendance / students.size()) * 100.0) / 100.0);
        dto.setAverageCgpa(students.isEmpty() ? 0.0 : Math.round((totalCgpa / students.size()) * 100.0) / 100.0);
        dto.setStudentsAtRiskCount(atRiskCount);
        dto.setTotalPendingFees(totalPending);
        dto.setTotalCollectedFees(Math.max(0.0, (students.size() * 150000.0) - totalPending));

        dto.setStudentsByDepartment(byDept);
        dto.setAttendanceDistribution(attDist);
        dto.setCgpaDistribution(cgpaDist);

        List<StudentDTO> recent = students.stream().limit(5).map(s -> new StudentDTO(
                s.getId(), s.getStudentId(), s.getName(), s.getDepartment(), s.getYear(),
                s.getMarks(), s.getContact(), s.getEmail(), s.getCreatedAt(), s.getUpdatedAt()
        )).collect(Collectors.toList());
        dto.setRecentStudents(recent);

        return dto;
    }

    // ==================== AT-RISK STUDENT DETECTION ====================

    @Transactional(readOnly = true)
    public List<AtRiskStudentDTO> getAtRiskStudents() {
        List<Student> allStudents = studentRepository.findAll();
        List<AtRiskStudentDTO> atRiskList = new ArrayList<>();

        for (Student s : allStudents) {
            double attendance = s.getAttendancePercentage() != null ? s.getAttendancePercentage() : 84.82;
            double cgpa = smartCampusService.calculateCgpa(s);
            long failedCount = studentMarksRepository.countByStudentAndGrade(s, "F");

            boolean hasAttRisk = attendance < 75.0;
            boolean hasCgpaRisk = cgpa < 6.8;
            boolean hasFailRisk = failedCount > 0;

            if (hasAttRisk || hasCgpaRisk || hasFailRisk) {
                AtRiskStudentDTO dto = new AtRiskStudentDTO();
                dto.setId(s.getId());
                dto.setStudentId(s.getStudentId());
                dto.setName(s.getName());
                dto.setDepartment(s.getDepartment());
                dto.setYear(s.getYear());
                dto.setSemester(s.getCurrentSemester() != null ? s.getCurrentSemester() : 5);
                dto.setAttendancePercentage(attendance);
                dto.setCgpa(cgpa);
                dto.setFailedSubjectsCount(failedCount);

                List<String> reasons = new ArrayList<>();
                int severityPoints = 0;

                if (attendance < 65.0) {
                    reasons.add("Critical attendance shortage (" + attendance + "% < 65%)");
                    severityPoints += 3;
                } else if (attendance < 75.0) {
                    reasons.add("Attendance below university norm (" + attendance + "% < 75%)");
                    severityPoints += 2;
                }

                if (failedCount > 1) {
                    reasons.add("Multiple backlogs (" + failedCount + " failed courses)");
                    severityPoints += 3;
                } else if (failedCount == 1) {
                    reasons.add("1 backlog pending");
                    severityPoints += 1;
                }

                if (cgpa < 5.5) {
                    reasons.add("Critical CGPA (" + cgpa + " < 5.5)");
                    severityPoints += 3;
                } else if (cgpa < 6.5) {
                    reasons.add("Low cumulative CGPA (" + cgpa + " < 6.5)");
                    severityPoints += 1;
                }

                dto.setRiskReason(String.join("; ", reasons));

                if (severityPoints >= 3) {
                    dto.setRiskLevel("HIGH");
                } else if (severityPoints == 2) {
                    dto.setRiskLevel("MEDIUM");
                } else {
                    dto.setRiskLevel("LOW");
                }

                atRiskList.add(dto);
            }
        }

        atRiskList.sort((a, b) -> {
            int scoreA = "HIGH".equals(a.getRiskLevel()) ? 3 : ("MEDIUM".equals(a.getRiskLevel()) ? 2 : 1);
            int scoreB = "HIGH".equals(b.getRiskLevel()) ? 3 : ("MEDIUM".equals(b.getRiskLevel()) ? 2 : 1);
            return Integer.compare(scoreB, scoreA);
        });

        return atRiskList;
    }

    // ==================== ADVANCED STUDENT SEARCH & PAGINATION ====================

    @Transactional(readOnly = true)
    public Page<StudentDTO> getStudentsPaginated(
            int page, int size, String search, String department, Integer year,
            Integer semester, Double minAttendance, Double maxAttendance, String sortBy, String sortDir) {

        Sort sort = Sort.by("asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy != null ? sortBy : "id");
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Specification<Student> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.toLowerCase().trim() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), term),
                        cb.like(cb.lower(root.get("studentId")), term),
                        cb.like(cb.lower(root.get("email")), term),
                        cb.like(cb.lower(root.get("department")), term)
                ));
            }

            if (department != null && !department.trim().isEmpty() && !"ALL".equalsIgnoreCase(department)) {
                predicates.add(cb.equal(cb.lower(root.get("department")), department.toLowerCase().trim()));
            }

            if (year != null && year > 0) {
                predicates.add(cb.equal(root.get("year"), year));
            }

            if (semester != null && semester > 0) {
                predicates.add(cb.equal(root.get("currentSemester"), semester));
            }

            if (minAttendance != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("attendancePercentage"), minAttendance));
            }

            if (maxAttendance != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("attendancePercentage"), maxAttendance));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return studentRepository.findAll(spec, pageable).map(s -> new StudentDTO(
                s.getId(), s.getStudentId(), s.getName(), s.getDepartment(), s.getYear(),
                s.getMarks(), s.getContact(), s.getEmail(), s.getCreatedAt(), s.getUpdatedAt()
        ));
    }

    // ==================== EXAMS ADMIN CRUD ====================

    @Transactional
    public ExamSchedule createExamSchedule(ExamSchedule exam, String adminUser) {
        ExamSchedule saved = examScheduleRepository.save(exam);
        auditLogService.log(adminUser, "CREATE", "EXAM", String.valueOf(saved.getId()),
                "Scheduled exam: " + saved.getSubjectName() + " on " + saved.getExamDate());
        return saved;
    }

    @Transactional
    public ExamSchedule updateExamSchedule(Long id, ExamSchedule updated, String adminUser) {
        ExamSchedule existing = examScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam schedule not found: " + id));
        existing.setSubjectCode(updated.getSubjectCode());
        existing.setSubjectName(updated.getSubjectName());
        existing.setExamType(updated.getExamType());
        existing.setExamDate(updated.getExamDate());
        existing.setExamTime(updated.getExamTime());
        existing.setRoom(updated.getRoom());
        existing.setSeatNumber(updated.getSeatNumber());
        existing.setSemester(updated.getSemester());
        existing.setDepartment(updated.getDepartment());
        ExamSchedule saved = examScheduleRepository.save(existing);
        auditLogService.log(adminUser, "UPDATE", "EXAM", String.valueOf(saved.getId()), "Updated exam: " + saved.getSubjectName());
        return saved;
    }

    @Transactional
    public void deleteExamSchedule(Long id, String adminUser) {
        examScheduleRepository.deleteById(id);
        auditLogService.log(adminUser, "DELETE", "EXAM", String.valueOf(id), "Deleted exam schedule ID " + id);
    }

    // ==================== ASSIGNMENTS ADMIN CRUD ====================

    @Transactional
    public Assignment createAssignment(Assignment assignment, String adminUser) {
        Assignment saved = assignmentRepository.save(assignment);
        auditLogService.log(adminUser, "CREATE", "ASSIGNMENT", String.valueOf(saved.getId()),
                "Created assignment: " + saved.getTitle() + " for " + saved.getSubjectCode());
        return saved;
    }

    @Transactional
    public void deleteAssignment(Long id, String adminUser) {
        assignmentRepository.deleteById(id);
        auditLogService.log(adminUser, "DELETE", "ASSIGNMENT", String.valueOf(id), "Deleted assignment ID " + id);
    }

    // ==================== STUDY MATERIALS ADMIN CRUD ====================

    @Transactional
    public StudyMaterial createStudyMaterial(StudyMaterial material, String adminUser) {
        StudyMaterial saved = studyMaterialRepository.save(material);
        auditLogService.log(adminUser, "CREATE", "MATERIAL", String.valueOf(saved.getId()),
                "Uploaded material: " + saved.getTitle());
        return saved;
    }

    @Transactional
    public void deleteStudyMaterial(Long id, String adminUser) {
        studyMaterialRepository.deleteById(id);
        auditLogService.log(adminUser, "DELETE", "MATERIAL", String.valueOf(id), "Deleted study material ID " + id);
    }

    // ==================== ANNOUNCEMENTS ADMIN CRUD ====================

    @Transactional
    public Announcement createAnnouncement(Announcement announcement, String adminUser) {
        Announcement saved = announcementRepository.save(announcement);
        auditLogService.log(adminUser, "CREATE", "ANNOUNCEMENT", String.valueOf(saved.getId()),
                "Published announcement: " + saved.getTitle() + " (" + saved.getPriority() + ")");
        return saved;
    }

    @Transactional
    public void deleteAnnouncement(Long id, String adminUser) {
        announcementRepository.deleteById(id);
        auditLogService.log(adminUser, "DELETE", "ANNOUNCEMENT", String.valueOf(id), "Deleted announcement ID " + id);
    }

    // ==================== CAMPUS EVENTS ADMIN CRUD ====================

    @Transactional
    public CampusEvent createEvent(CampusEvent event, String adminUser) {
        CampusEvent saved = campusEventRepository.save(event);
        auditLogService.log(adminUser, "CREATE", "EVENT", String.valueOf(saved.getId()), "Created campus event: " + saved.getTitle());
        return saved;
    }

    @Transactional
    public void deleteEvent(Long id, String adminUser) {
        campusEventRepository.deleteById(id);
        auditLogService.log(adminUser, "DELETE", "EVENT", String.valueOf(id), "Deleted campus event ID " + id);
    }

    // ==================== CLUBS ADMIN CRUD ====================

    @Transactional
    public Club createClub(Club club, String adminUser) {
        Club saved = clubRepository.save(club);
        auditLogService.log(adminUser, "CREATE", "CLUB", String.valueOf(saved.getId()), "Created student club: " + saved.getName());
        return saved;
    }

    @Transactional
    public void deleteClub(Long id, String adminUser) {
        clubRepository.deleteById(id);
        auditLogService.log(adminUser, "DELETE", "CLUB", String.valueOf(id), "Deleted student club ID " + id);
    }

    @Transactional(readOnly = true)
    public List<ExamSchedule> getAllExams() {
        return examScheduleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<StudyMaterial> getAllMaterials() {
        return studyMaterialRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<CampusEvent> getAllEvents() {
        return campusEventRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    // ==================== CSV REPORT EXPORTS ====================

    public byte[] exportStudentsCsv() {
        List<Student> students = studentRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Student ID,Name,Department,Year,Semester,Email,Contact,Marks %,Attendance %,Fee Dues");
            for (Student s : students) {
                writer.printf("%s,\"%s\",%s,%d,%d,%s,%s,%.2f,%.2f,%.2f%n",
                        s.getStudentId(), s.getName(), s.getDepartment(), s.getYear(),
                        s.getCurrentSemester() != null ? s.getCurrentSemester() : 1,
                        s.getEmail(), s.getContact(),
                        s.getMarks() != null ? s.getMarks() : 0.0,
                        s.getAttendancePercentage() != null ? s.getAttendancePercentage() : 0.0,
                        s.getFeeDues() != null ? s.getFeeDues() : 0.0);
            }
        }
        return out.toByteArray();
    }

    public byte[] exportAtRiskStudentsCsv() {
        List<AtRiskStudentDTO> atRisk = getAtRiskStudents();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Student ID,Name,Department,Semester,Attendance %,CGPA,Failed Subjects,Risk Level,Reasons");
            for (AtRiskStudentDTO s : atRisk) {
                writer.printf("%s,\"%s\",%s,%d,%.2f,%.2f,%d,%s,\"%s\"%n",
                        s.getStudentId(), s.getName(), s.getDepartment(), s.getSemester(),
                        s.getAttendancePercentage(), s.getCgpa(), s.getFailedSubjectsCount(),
                        s.getRiskLevel(), s.getRiskReason());
            }
        }
        return out.toByteArray();
    }

    // ==================== GLOBAL SEARCH (ADMIN) ====================

    @Transactional(readOnly = true)
    public List<GlobalSearchResultDTO> globalSearchAdmin(String query) {
        if (query == null || query.trim().length() < 2) return Collections.emptyList();
        String q = query.toLowerCase();

        List<GlobalSearchResultDTO> results = new ArrayList<>();

        // Students
        studentRepository.searchStudents(query).stream().limit(5)
                .forEach(s -> results.add(new GlobalSearchResultDTO(
                        s.getName() + " (" + s.getStudentId() + ")", s.getDepartment() + " - Year " + s.getYear(),
                        "Student", "/admin/students", "student"
                )));

        // Announcements
        announcementRepository.findAll().stream()
                .filter(a -> a.getTitle().toLowerCase().contains(q))
                .limit(3)
                .forEach(a -> results.add(new GlobalSearchResultDTO(
                        a.getTitle(), a.getPriority() + " Announcement", "Announcement", "/admin/announcements", "announcement"
                )));

        // Audit Logs
        results.add(new GlobalSearchResultDTO(
                "Audit Logs Explorer", "Security & administrative activities", "Audit", "/admin/audit-logs", "audit"
        ));

        // Reports
        results.add(new GlobalSearchResultDTO(
                "Academic Reports & Analytics", "Export CSV and PDF summaries", "Reports", "/admin/reports", "report"
        ));

        return results;
    }
}
