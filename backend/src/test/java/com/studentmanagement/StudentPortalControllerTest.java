package com.studentmanagement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studentmanagement.dto.AuthRequest;
import com.studentmanagement.dto.ChangePasswordRequest;
import com.studentmanagement.dto.FeedbackDTO;
import com.studentmanagement.entity.Student;
import com.studentmanagement.entity.Subject;
import com.studentmanagement.entity.User;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.repository.SubjectRepository;
import com.studentmanagement.repository.UserRepository;
import com.studentmanagement.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class StudentPortalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private com.studentmanagement.repository.FeedbackRepository feedbackRepository;

    @Autowired
    private com.studentmanagement.repository.StudentMarksRepository marksRepository;

    @Autowired
    private com.studentmanagement.repository.StudentAttendanceRepository attendanceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        feedbackRepository.deleteAll();
        marksRepository.deleteAll();
        attendanceRepository.deleteAll();
        userRepository.deleteAll();
        studentRepository.deleteAll();
        subjectRepository.deleteAll();

        // Seed a test student
        Student student = new Student(
                null,
                "STU001",
                "Rahul Sharma",
                "ECE",
                3,
                84.17,
                "9876543210",
                "rahul@example.com",
                5,
                "Active / Regular",
                135000.0,
                84.82
        );
        studentRepository.save(student);

        // Seed student user
        User user = new User(
                null,
                "student001",
                passwordEncoder.encode("Student@123"),
                "ROLE_STUDENT",
                "STU001",
                true
        );
        userRepository.save(user);

        // Seed admin user
        User admin = new User(
                null,
                "admin",
                passwordEncoder.encode("Admin@123"),
                "ROLE_ADMIN",
                null,
                true
        );
        userRepository.save(admin);

        // Seed subject
        Subject subject = new Subject(null, "ECS01", "Communication Systems", "ECE", 5, 4);
        subjectRepository.save(subject);
    }

    @Test
    void testStudentLoginSuccess() throws Exception {
        AuthRequest req = new AuthRequest("student001", "Student@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.role", is("ROLE_STUDENT")))
                .andExpect(jsonPath("$.data.studentId", is("STU001")))
                .andExpect(jsonPath("$.data.studentName", is("Rahul Sharma")));
    }

    @Test
    void testStudentLoginInvalidPassword() throws Exception {
        AuthRequest req = new AuthRequest("student001", "WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void testGetStudentProfileWithToken() throws Exception {
        String token = jwtTokenProvider.generateToken("student001", "ROLE_STUDENT", "STU001", "Rahul Sharma");

        mockMvc.perform(get("/api/student/me/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.studentId", is("STU001")))
                .andExpect(jsonPath("$.data.department", is("ECE")))
                .andExpect(jsonPath("$.data.semester", is(5)));
    }

    @Test
    void testStudentCannotAccessAdminEndpoint() throws Exception {
        String studentToken = jwtTokenProvider.generateToken("student001", "ROLE_STUDENT", "STU001", "Rahul Sharma");

        mockMvc.perform(get("/api/admin/academics/calendar")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminCanAccessAdminEndpoint() throws Exception {
        String adminToken = jwtTokenProvider.generateToken("admin", "ROLE_ADMIN", null, "System Administrator");

        mockMvc.perform(get("/api/admin/academics/calendar")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void testSubmitFeedback() throws Exception {
        String token = jwtTokenProvider.generateToken("student001", "ROLE_STUDENT", "STU001", "Rahul Sharma");
        FeedbackDTO feedback = new FeedbackDTO(null, "STU001", "Rahul Sharma", 5, "Excellent dashboard experience!", null);

        mockMvc.perform(post("/api/student/me/feedback")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(feedback)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.rating", is(5)));
    }
}
