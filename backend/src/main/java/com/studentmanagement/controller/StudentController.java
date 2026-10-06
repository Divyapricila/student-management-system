package com.studentmanagement.controller;

import com.studentmanagement.dto.ApiResponse;
import com.studentmanagement.dto.DashboardStatsDTO;
import com.studentmanagement.dto.StudentDTO;
import com.studentmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller providing API endpoints for Student management operations.
 */
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * GET /api/students
     * Retrieve all students, optionally filtered by department.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentDTO>>> getAllStudents(
            @RequestParam(required = false) String department) {
        List<StudentDTO> students;
        if (department != null && !department.trim().isEmpty()) {
            students = studentService.getStudentsByDepartment(department);
        } else {
            students = studentService.getAllStudents();
        }
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully.", students));
    }

    /**
     * GET /api/students/{id}
     * Retrieve a student by primary key ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDTO>> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully.", student));
    }

    /**
     * POST /api/students
     * Add a new student record.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<StudentDTO>> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO createdStudent = studentService.createStudent(studentDTO);
        return new ResponseEntity<>(ApiResponse.success("Student added successfully.", createdStudent), HttpStatus.CREATED);
    }

    /**
     * PUT /api/students/{id}
     * Update an existing student record.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDTO>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully.", updatedStudent));
    }

    /**
     * DELETE /api/students/{id}
     * Delete a student by primary key ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully.", null));
    }

    /**
     * GET /api/students/search?keyword=value
     * Search students by studentId, name, or department.
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StudentDTO>>> searchStudents(@RequestParam(required = false) String keyword) {
        List<StudentDTO> students = studentService.searchStudents(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully.", students));
    }

    /**
     * GET /api/students/dashboard
     * Get aggregate statistics for the dashboard.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = studentService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully.", stats));
    }

    /**
     * GET /api/students/check-id?studentId=STU001&excludeId=1
     * Check if a student ID is available for use.
     */
    @GetMapping("/check-id")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkStudentId(
            @RequestParam String studentId,
            @RequestParam(required = false) Long excludeId) {
        boolean available = studentService.isStudentIdAvailable(studentId, excludeId);
        return ResponseEntity.ok(ApiResponse.success("Student ID check completed.", Map.of("available", available)));
    }
}
