package com.studentmanagement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studentmanagement.dto.StudentDTO;
import com.studentmanagement.entity.Student;
import com.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private com.studentmanagement.repository.UserRepository userRepository;

    @Autowired
    private com.studentmanagement.repository.StudentMarksRepository marksRepository;

    @Autowired
    private com.studentmanagement.repository.StudentAttendanceRepository attendanceRepository;

    @Autowired
    private com.studentmanagement.repository.FeedbackRepository feedbackRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        feedbackRepository.deleteAll();
        marksRepository.deleteAll();
        attendanceRepository.deleteAll();
        userRepository.deleteAll();
        studentRepository.deleteAll();
    }

    @Test
    void testCreateAndGetStudent() throws Exception {
        StudentDTO newStudent = new StudentDTO(
                null,
                "TEST001",
                "Alice Smith",
                "Computer Science",
                2,
                89.5,
                "9876543210",
                "alice@example.com",
                null,
                null
        );

        // Test POST /api/students
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newStudent)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.studentId", is("TEST001")))
                .andExpect(jsonPath("$.data.name", is("Alice Smith")));

        // Test GET /api/students
        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].studentId", is("TEST001")));
    }

    @Test
    void testDuplicateStudentIdFails() throws Exception {
        studentRepository.save(new Student(null, "DUP001", "Existing Student", "IT", 1, 75.0, "9876543210", "existing@example.com"));

        StudentDTO duplicate = new StudentDTO(
                null,
                "DUP001",
                "New Student",
                "ECE",
                3,
                90.0,
                "9876543211",
                "new@example.com",
                null,
                null
        );

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    void testValidationFailure() throws Exception {
        StudentDTO invalid = new StudentDTO(
                null,
                "", // empty studentId
                "", // empty name
                "", // empty dept
                0,  // invalid year
                150.0, // invalid marks > 100
                "abc", // invalid contact
                "invalid-email", // invalid email
                null,
                null
        );

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.errors", notNullValue()));
    }

    @Test
    void testDashboardStats() throws Exception {
        studentRepository.save(new Student(null, "DASH1", "Student One", "CSE", 1, 80.0, "9876543210", "one@example.com"));
        studentRepository.save(new Student(null, "DASH2", "Student Two", "ECE", 2, 90.0, "9876543211", "two@example.com"));

        mockMvc.perform(get("/api/students/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalStudents", is(2)))
                .andExpect(jsonPath("$.data.totalDepartments", is(2)))
                .andExpect(jsonPath("$.data.averageMarks", is(85.0)))
                .andExpect(jsonPath("$.data.highestMarks", is(90.0)));
    }
}
