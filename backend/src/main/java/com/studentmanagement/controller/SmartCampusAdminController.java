package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.entity.*;
import com.studentmanagement.service.AuditLogService;
import com.studentmanagement.service.SmartCampusAdminService;
import com.studentmanagement.service.SystemSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Smart Campus Admin Console", description = "Administrative operations for analytics, at-risk detection, exams, clubs, audit and settings")
public class SmartCampusAdminController {

    private final SmartCampusAdminService adminService;
    private final AuditLogService auditLogService;
    private final SystemSettingsService systemSettingsService;

    public SmartCampusAdminController(
            SmartCampusAdminService adminService,
            AuditLogService auditLogService,
            SystemSettingsService systemSettingsService) {
        this.adminService = adminService;
        this.auditLogService = auditLogService;
        this.systemSettingsService = systemSettingsService;
    }

    @GetMapping("/dashboard-stats")
    @Operation(summary = "Get Admin Dashboard 2.0 KPIs, analytics and distributions")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDTO>> getDashboardStats() {
        AdminDashboardStatsDTO stats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard stats loaded", stats));
    }

    @GetMapping("/at-risk")
    @Operation(summary = "Get automatically detected at-risk students")
    public ResponseEntity<ApiResponse<List<AtRiskStudentDTO>>> getAtRiskStudents() {
        List<AtRiskStudentDTO> atRisk = adminService.getAtRiskStudents();
        return ResponseEntity.ok(ApiResponse.success("At-risk students evaluated", atRisk));
    }

    @GetMapping("/students/paginated")
    @Operation(summary = "Advanced student directory with multi-field search, filters, sorting and pagination")
    public ResponseEntity<ApiResponse<Page<StudentDTO>>> getStudentsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) Double minAttendance,
            @RequestParam(required = false) Double maxAttendance,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Page<StudentDTO> students = adminService.getStudentsPaginated(
                page, size, search, department, year, semester, minAttendance, maxAttendance, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", students));
    }

    @GetMapping("/exams")
    @Operation(summary = "Get all exam schedules")
    public ResponseEntity<ApiResponse<List<ExamSchedule>>> getAllExams() {
        return ResponseEntity.ok(ApiResponse.success("Exams retrieved", adminService.getAllExams()));
    }

    @PostMapping("/exams")
    @Operation(summary = "Schedule a new examination")
    public ResponseEntity<ApiResponse<ExamSchedule>> createExam(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody ExamSchedule exam) {
        ExamSchedule created = adminService.createExamSchedule(exam, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Exam scheduled successfully", created));
    }

    @PutMapping("/exams/{id}")
    @Operation(summary = "Update an exam schedule")
    public ResponseEntity<ApiResponse<ExamSchedule>> updateExam(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id,
            @RequestBody ExamSchedule exam) {
        ExamSchedule updated = adminService.updateExamSchedule(id, exam, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Exam schedule updated", updated));
    }

    @DeleteMapping("/exams/{id}")
    @Operation(summary = "Cancel an exam schedule")
    public ResponseEntity<ApiResponse<Void>> deleteExam(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        adminService.deleteExamSchedule(id, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Exam schedule removed", null));
    }

    @GetMapping("/assignments")
    @Operation(summary = "Get all course assignments")
    public ResponseEntity<ApiResponse<List<Assignment>>> getAllAssignments() {
        return ResponseEntity.ok(ApiResponse.success("Assignments retrieved", adminService.getAllAssignments()));
    }

    @PostMapping("/assignments")
    @Operation(summary = "Create a course assignment")
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody Assignment assignment) {
        Assignment created = adminService.createAssignment(assignment, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Assignment created successfully", created));
    }

    @DeleteMapping("/assignments/{id}")
    @Operation(summary = "Delete an assignment")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        adminService.deleteAssignment(id, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted", null));
    }

    // ==================== MATERIALS ====================

    @GetMapping("/materials")
    @Operation(summary = "Get all study materials")
    public ResponseEntity<ApiResponse<List<StudyMaterial>>> getAllMaterials() {
        return ResponseEntity.ok(ApiResponse.success("Study materials retrieved", adminService.getAllMaterials()));
    }

    @PostMapping("/materials")
    @Operation(summary = "Upload syllabus study material")
    public ResponseEntity<ApiResponse<StudyMaterial>> createMaterial(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody StudyMaterial material) {
        StudyMaterial created = adminService.createStudyMaterial(material, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Material uploaded successfully", created));
    }

    @DeleteMapping("/materials/{id}")
    @Operation(summary = "Delete study material")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        adminService.deleteStudyMaterial(id, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Material deleted", null));
    }

    // ==================== ANNOUNCEMENTS ====================

    @GetMapping("/announcements")
    @Operation(summary = "Get all campus announcements")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAllAnnouncements() {
        return ResponseEntity.ok(ApiResponse.success("Announcements retrieved", adminService.getAllAnnouncements()));
    }

    @PostMapping("/announcements")
    @Operation(summary = "Publish campus notice or announcement")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody Announcement announcement) {
        Announcement created = adminService.createAnnouncement(announcement, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Announcement published", created));
    }

    @DeleteMapping("/announcements/{id}")
    @Operation(summary = "Delete an announcement")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        adminService.deleteAnnouncement(id, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted", null));
    }

    // ==================== EVENTS ====================

    @GetMapping("/events")
    @Operation(summary = "Get all campus events")
    public ResponseEntity<ApiResponse<List<CampusEvent>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.success("Events retrieved", adminService.getAllEvents()));
    }

    @PostMapping("/events")
    @Operation(summary = "Create campus event")
    public ResponseEntity<ApiResponse<CampusEvent>> createEvent(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody CampusEvent event) {
        CampusEvent created = adminService.createEvent(event, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Campus event created", created));
    }

    @DeleteMapping("/events/{id}")
    @Operation(summary = "Delete campus event")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        adminService.deleteEvent(id, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Campus event deleted", null));
    }

    // ==================== CLUBS ====================

    @GetMapping("/clubs")
    @Operation(summary = "Get all student clubs")
    public ResponseEntity<ApiResponse<List<Club>>> getAllClubs() {
        return ResponseEntity.ok(ApiResponse.success("Clubs retrieved", adminService.getAllClubs()));
    }

    @PostMapping("/clubs")
    @Operation(summary = "Create student club")
    public ResponseEntity<ApiResponse<Club>> createClub(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody Club club) {
        Club created = adminService.createClub(club, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Student club created", created));
    }

    @DeleteMapping("/clubs/{id}")
    @Operation(summary = "Delete student club")
    public ResponseEntity<ApiResponse<Void>> deleteClub(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        adminService.deleteClub(id, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Student club deleted", null));
    }

    // ==================== AUDIT LOGS ====================

    @GetMapping("/audit-logs")
    @Operation(summary = "View security audit logs")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogs() {
        List<AuditLogDTO> logs = auditLogService.getAllAuditLogs();
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", logs));
    }

    // ==================== SETTINGS ====================

    @GetMapping("/settings")
    @Operation(summary = "Get all configurable campus parameters")
    public ResponseEntity<ApiResponse<List<SystemSettingDTO>>> getSettings() {
        List<SystemSettingDTO> settings = systemSettingsService.getAllSettings();
        return ResponseEntity.ok(ApiResponse.success("Settings loaded", settings));
    }

    @PutMapping("/settings")
    @Operation(summary = "Update system setting parameter")
    public ResponseEntity<ApiResponse<SystemSettingDTO>> updateSetting(@RequestBody SystemSettingDTO dto) {
        SystemSettingDTO updated = systemSettingsService.updateSetting(dto.getSettingKey(), dto.getSettingValue(), dto.getDescription());
        return ResponseEntity.ok(ApiResponse.success("Setting updated", updated));
    }

    // ==================== CSV EXPORTS ====================

    @GetMapping("/reports/csv/students")
    @Operation(summary = "Export student master records as CSV")
    public ResponseEntity<ByteArrayResource> exportStudentsCsv() {
        byte[] csvData = adminService.exportStudentsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=students_master_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new ByteArrayResource(csvData));
    }

    @GetMapping("/reports/csv/at-risk")
    @Operation(summary = "Export at-risk students report as CSV")
    public ResponseEntity<ByteArrayResource> exportAtRiskCsv() {
        byte[] csvData = adminService.exportAtRiskStudentsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=at_risk_students_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new ByteArrayResource(csvData));
    }

    // ==================== GLOBAL SEARCH ====================

    @GetMapping("/search")
    @Operation(summary = "Global search for administrative items")
    public ResponseEntity<ApiResponse<List<GlobalSearchResultDTO>>> searchAdmin(@RequestParam String q) {
        List<GlobalSearchResultDTO> results = adminService.globalSearchAdmin(q);
        return ResponseEntity.ok(ApiResponse.success("Admin search results", results));
    }
}
