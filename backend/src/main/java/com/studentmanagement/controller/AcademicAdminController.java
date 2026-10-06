package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.entity.StudentAttendance;
import com.studentmanagement.entity.StudentMarks;
import com.studentmanagement.entity.Subject;
import com.studentmanagement.service.AcademicManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AcademicAdminController {

    private final AcademicManagementService academicService;

    public AcademicAdminController(AcademicManagementService academicService) {
        this.academicService = academicService;
    }

    @GetMapping("/academics/semesters")
    public ResponseEntity<ApiResponse<List<Integer>>> getSemesters() {
        return ResponseEntity.ok(ApiResponse.success("Semesters retrieved.", academicService.getAllSemesters()));
    }

    @GetMapping("/academics/subjects")
    public ResponseEntity<ApiResponse<List<Subject>>> getSubjects(
            @RequestParam Integer semester,
            @RequestParam(required = false) String department) {
        List<Subject> subjects = academicService.getSubjects(semester, department);
        return ResponseEntity.ok(ApiResponse.success("Subjects retrieved.", subjects));
    }

    @GetMapping("/academics/marks")
    public ResponseEntity<ApiResponse<SemesterMarksSummaryDTO>> getStudentMarks(
            @RequestParam String studentId,
            @RequestParam Integer semester) {
        SemesterMarksSummaryDTO marks = academicService.getMarksForStudent(studentId, semester);
        return ResponseEntity.ok(ApiResponse.success("Student marks retrieved.", marks));
    }

    @PutMapping("/academics/marks")
    public ResponseEntity<ApiResponse<StudentMarks>> updateStudentMarks(@Valid @RequestBody AcademicUpdateDTO dto) {
        StudentMarks updated = academicService.updateMarks(dto);
        return ResponseEntity.ok(ApiResponse.success("Marks updated successfully.", updated));
    }

    @GetMapping("/academics/attendance")
    public ResponseEntity<ApiResponse<SemesterAttendanceSummaryDTO>> getStudentAttendance(
            @RequestParam String studentId,
            @RequestParam Integer semester) {
        SemesterAttendanceSummaryDTO att = academicService.getAttendanceForStudent(studentId, semester);
        return ResponseEntity.ok(ApiResponse.success("Student attendance retrieved.", att));
    }

    @PutMapping("/academics/attendance")
    public ResponseEntity<ApiResponse<StudentAttendance>> updateStudentAttendance(@Valid @RequestBody AcademicUpdateDTO dto) {
        StudentAttendance updated = academicService.updateAttendance(dto);
        return ResponseEntity.ok(ApiResponse.success("Attendance updated successfully.", updated));
    }

    @GetMapping("/academics/calendar")
    public ResponseEntity<ApiResponse<List<CalendarEventDTO>>> getAllCalendarEvents() {
        List<CalendarEventDTO> events = academicService.getAllCalendarEvents();
        return ResponseEntity.ok(ApiResponse.success("Calendar events retrieved.", events));
    }

    @PostMapping("/academics/calendar")
    public ResponseEntity<ApiResponse<CalendarEventDTO>> createCalendarEvent(@Valid @RequestBody CalendarEventDTO dto) {
        CalendarEventDTO created = academicService.createCalendarEvent(dto);
        return new ResponseEntity<>(ApiResponse.success("Calendar event created.", created), HttpStatus.CREATED);
    }

    @DeleteMapping("/academics/calendar/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCalendarEvent(@PathVariable Long id) {
        academicService.deleteCalendarEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Calendar event deleted.", null));
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getFeedbacks() {
        List<FeedbackDTO> feedbacks = academicService.getAllFeedbacks();
        return ResponseEntity.ok(ApiResponse.success("Student feedbacks retrieved.", feedbacks));
    }
}
