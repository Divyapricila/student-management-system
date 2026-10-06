package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.service.SmartCampusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student/me")
@Tag(name = "Smart Campus Student Portal", description = "Student self-service APIs for analytics, exams, assignments, fees and clubs")
public class SmartCampusStudentController {

    private final SmartCampusService smartCampusService;

    public SmartCampusStudentController(SmartCampusService smartCampusService) {
        this.smartCampusService = smartCampusService;
    }

    @GetMapping("/dashboard-summary")
    @Operation(summary = "Get Student Dashboard 2.0 KPIs (SGPA, CGPA, attendance%, fee dues, upcoming exams)")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getDashboardSummary(@AuthenticationPrincipal UserDetails userDetails) {
        DashboardSummaryDTO summary = smartCampusService.getDashboardSummary(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary loaded", summary));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get Academic Performance Analytics (SGPA trends, CGPA, attendance curves)")
    public ResponseEntity<ApiResponse<AcademicAnalyticsDTO>> getAnalytics(@AuthenticationPrincipal UserDetails userDetails) {
        AcademicAnalyticsDTO analytics = smartCampusService.getAcademicAnalytics(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Academic analytics loaded", analytics));
    }

    @GetMapping("/attendance-analysis")
    @Operation(summary = "Smart Attendance Analyzer with formula-based recovery calculations")
    public ResponseEntity<ApiResponse<AttendanceAnalysisDTO>> getAttendanceAnalysis(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Integer semester) {
        AttendanceAnalysisDTO analysis = smartCampusService.getAttendanceAnalysis(userDetails.getUsername(), semester);
        return ResponseEntity.ok(ApiResponse.success("Attendance analysis loaded", analysis));
    }

    @GetMapping("/exams")
    @Operation(summary = "Get upcoming examination timetable and seat allocations")
    public ResponseEntity<ApiResponse<List<ExamScheduleDTO>>> getExams(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Integer semester) {
        List<ExamScheduleDTO> exams = smartCampusService.getExamSchedule(userDetails.getUsername(), semester);
        return ResponseEntity.ok(ApiResponse.success("Exam schedule loaded", exams));
    }

    @GetMapping("/assignments")
    @Operation(summary = "Get course assignments and submission statuses")
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getAssignments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Integer semester) {
        List<AssignmentDTO> assignments = smartCampusService.getAssignments(userDetails.getUsername(), semester);
        return ResponseEntity.ok(ApiResponse.success("Assignments loaded", assignments));
    }

    @PostMapping("/assignments/{id}/submit")
    @Operation(summary = "Submit an assignment")
    public ResponseEntity<ApiResponse<AssignmentDTO>> submitAssignment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = (body != null) ? body.get("notes") : null;
        AssignmentDTO submitted = smartCampusService.submitAssignment(userDetails.getUsername(), id, notes);
        return ResponseEntity.ok(ApiResponse.success("Assignment submitted successfully", submitted));
    }

    @GetMapping("/materials")
    @Operation(summary = "Get syllabus resources and lecture study materials")
    public ResponseEntity<ApiResponse<List<StudyMaterialDTO>>> getMaterials(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Integer semester) {
        List<StudyMaterialDTO> materials = smartCampusService.getStudyMaterials(userDetails.getUsername(), semester);
        return ResponseEntity.ok(ApiResponse.success("Study materials loaded", materials));
    }

    @GetMapping("/notifications")
    @Operation(summary = "Get student notifications and alerts")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        List<NotificationDTO> notifs = smartCampusService.getNotifications(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notifications loaded", notifs));
    }

    @PutMapping("/notifications/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markNotificationRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        smartCampusService.markNotificationRead(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/notifications/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllNotificationsRead(@AuthenticationPrincipal UserDetails userDetails) {
        smartCampusService.markAllNotificationsRead(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @GetMapping("/announcements")
    @Operation(summary = "Get targeted campus notices and announcements")
    public ResponseEntity<ApiResponse<List<AnnouncementDTO>>> getAnnouncements(@AuthenticationPrincipal UserDetails userDetails) {
        List<AnnouncementDTO> announcements = smartCampusService.getAnnouncements(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Announcements loaded", announcements));
    }

    @GetMapping("/fees")
    @Operation(summary = "Get student fee summary and payment history")
    public ResponseEntity<ApiResponse<FeeSummaryDTO>> getFees(@AuthenticationPrincipal UserDetails userDetails) {
        FeeSummaryDTO summary = smartCampusService.getFeeSummary(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Fee summary loaded", summary));
    }

    @PostMapping("/fees/pay")
    @Operation(summary = "Process demo tuition fee payment")
    public ResponseEntity<ApiResponse<FeePaymentDTO>> payFee(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) Map<String, Object> body) {
        Double amount = (body != null && body.get("amount") != null) ? Double.valueOf(body.get("amount").toString()) : 50000.0;
        String method = (body != null && body.get("method") != null) ? body.get("method").toString() : "UPI (Demo)";
        FeePaymentDTO payment = smartCampusService.payFeeDemo(userDetails.getUsername(), amount, method);
        return ResponseEntity.ok(ApiResponse.success("Payment recorded successfully", payment));
    }

    @GetMapping("/events")
    @Operation(summary = "Get campus events and registration status")
    public ResponseEntity<ApiResponse<List<CampusEventDTO>>> getEvents(@AuthenticationPrincipal UserDetails userDetails) {
        List<CampusEventDTO> events = smartCampusService.getCampusEvents(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Campus events loaded", events));
    }

    @PostMapping("/events/{id}/register")
    @Operation(summary = "Register for a campus event")
    public ResponseEntity<ApiResponse<Void>> registerEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        smartCampusService.registerForEvent(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Registered for event successfully", null));
    }

    @DeleteMapping("/events/{id}/register")
    @Operation(summary = "Cancel registration for a campus event")
    public ResponseEntity<ApiResponse<Void>> cancelEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        smartCampusService.cancelEventRegistration(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Event registration cancelled", null));
    }

    @GetMapping("/clubs")
    @Operation(summary = "Get campus student clubs and membership status")
    public ResponseEntity<ApiResponse<List<ClubDTO>>> getClubs(@AuthenticationPrincipal UserDetails userDetails) {
        List<ClubDTO> clubs = smartCampusService.getClubs(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Clubs loaded", clubs));
    }

    @PostMapping("/clubs/{id}/join")
    @Operation(summary = "Join a student club")
    public ResponseEntity<ApiResponse<Void>> joinClub(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        smartCampusService.joinClub(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Joined club successfully", null));
    }

    @DeleteMapping("/clubs/{id}/leave")
    @Operation(summary = "Leave a student club")
    public ResponseEntity<ApiResponse<Void>> leaveClub(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        smartCampusService.leaveClub(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Left club successfully", null));
    }

    @GetMapping("/achievements")
    @Operation(summary = "Get student certificates and hackathon awards")
    public ResponseEntity<ApiResponse<List<AchievementDTO>>> getAchievements(@AuthenticationPrincipal UserDetails userDetails) {
        List<AchievementDTO> achievements = smartCampusService.getAchievements(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Achievements loaded", achievements));
    }

    @GetMapping("/search")
    @Operation(summary = "Global search for student portal items")
    public ResponseEntity<ApiResponse<List<GlobalSearchResultDTO>>> search(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String q) {
        List<GlobalSearchResultDTO> results = smartCampusService.globalSearchStudent(userDetails.getUsername(), q);
        return ResponseEntity.ok(ApiResponse.success("Search results", results));
    }
}
