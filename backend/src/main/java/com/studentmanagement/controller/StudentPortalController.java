package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.service.AuthService;
import com.studentmanagement.service.StudentPortalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/me")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudentPortalController {

    private final StudentPortalService studentPortalService;
    private final AuthService authService;

    public StudentPortalController(StudentPortalService studentPortalService, AuthService authService) {
        this.studentPortalService = studentPortalService;
        this.authService = authService;
    }

    /**
     * GET /api/student/me/profile
     * Fetch profile of currently authenticated student
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getMyProfile(Authentication authentication) {
        StudentProfileDTO profile = studentPortalService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile loaded successfully.", profile));
    }

    /**
     * GET /api/student/me/marks?semester=5
     * Fetch marks of currently authenticated student for selected semester
     */
    @GetMapping("/marks")
    public ResponseEntity<ApiResponse<SemesterMarksSummaryDTO>> getMyMarks(
            @RequestParam(required = false) Integer semester,
            Authentication authentication) {
        SemesterMarksSummaryDTO marks = studentPortalService.getMarks(authentication.getName(), semester);
        return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully.", marks));
    }

    /**
     * GET /api/student/me/attendance?semester=5
     * Fetch attendance of currently authenticated student for selected semester
     */
    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<SemesterAttendanceSummaryDTO>> getMyAttendance(
            @RequestParam(required = false) Integer semester,
            Authentication authentication) {
        SemesterAttendanceSummaryDTO attendance = studentPortalService.getAttendance(authentication.getName(), semester);
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved successfully.", attendance));
    }

    /**
     * GET /api/student/me/calendar?semester=5
     * Fetch academic calendar events for currently authenticated student
     */
    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<List<CalendarEventDTO>>> getMyCalendar(
            @RequestParam(required = false) Integer semester,
            Authentication authentication) {
        List<CalendarEventDTO> events = studentPortalService.getCalendar(authentication.getName(), semester);
        return ResponseEntity.ok(ApiResponse.success("Calendar events retrieved successfully.", events));
    }

    /**
     * PUT /api/student/me/password
     * Change password of currently authenticated student
     */
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully.", "SUCCESS"));
    }

    /**
     * POST /api/student/me/feedback
     * Submit feedback from authenticated student
     */
    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<FeedbackDTO>> submitFeedback(
            @Valid @RequestBody FeedbackDTO request,
            Authentication authentication) {
        FeedbackDTO saved = studentPortalService.submitFeedback(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully. Thank you!", saved));
    }
}
