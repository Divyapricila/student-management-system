package com.studentmanagement.service.impl;

import com.studentmanagement.dto.DashboardStatsDTO;
import com.studentmanagement.dto.StudentDTO;
import com.studentmanagement.entity.Student;
import com.studentmanagement.exception.DuplicateResourceException;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service implementation for Student business logic.
 */
@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final com.studentmanagement.repository.UserRepository userRepository;
    private final com.studentmanagement.repository.StudentMarksRepository marksRepository;
    private final com.studentmanagement.repository.StudentAttendanceRepository attendanceRepository;
    private final com.studentmanagement.repository.FeedbackRepository feedbackRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public StudentServiceImpl(StudentRepository studentRepository,
                              com.studentmanagement.repository.UserRepository userRepository,
                              com.studentmanagement.repository.StudentMarksRepository marksRepository,
                              com.studentmanagement.repository.StudentAttendanceRepository attendanceRepository,
                              com.studentmanagement.repository.FeedbackRepository feedbackRepository,
                              org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.marksRepository = marksRepository;
        this.attendanceRepository = attendanceRepository;
        this.feedbackRepository = feedbackRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return toDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with Student ID: " + studentId));
        return toDTO(student);
    }

    @Override
    public StudentDTO createStudent(StudentDTO studentDTO) {
        String trimmedStudentId = studentDTO.getStudentId().trim();
        if (studentRepository.existsByStudentId(trimmedStudentId)) {
            throw new DuplicateResourceException("Student ID '" + trimmedStudentId + "' already exists.");
        }

        Student student = toEntity(studentDTO);
        student.setStudentId(trimmedStudentId);
        Student savedStudent = studentRepository.save(student);

        // Auto-create login user if none exists
        String defaultUsername = trimmedStudentId.toLowerCase();
        if (!userRepository.existsByUsername(defaultUsername)) {
            userRepository.save(new com.studentmanagement.entity.User(
                    null,
                    defaultUsername,
                    passwordEncoder.encode("Student@123"),
                    "ROLE_STUDENT",
                    trimmedStudentId,
                    true
            ));
        }

        return toDTO(savedStudent);
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        String trimmedStudentId = studentDTO.getStudentId().trim();
        if (studentRepository.existsByStudentIdAndIdNot(trimmedStudentId, id)) {
            throw new DuplicateResourceException("Student ID '" + trimmedStudentId + "' already exists for another student.");
        }

        existingStudent.setStudentId(trimmedStudentId);
        existingStudent.setName(studentDTO.getName().trim());
        existingStudent.setDepartment(studentDTO.getDepartment().trim());
        existingStudent.setYear(studentDTO.getYear());
        existingStudent.setMarks(studentDTO.getMarks());
        existingStudent.setContact(studentDTO.getContact().trim());
        existingStudent.setEmail(studentDTO.getEmail().trim());

        Student updatedStudent = studentRepository.save(existingStudent);
        return toDTO(updatedStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        // Cascade delete child relations
        userRepository.findByStudentId(student.getStudentId()).ifPresent(userRepository::delete);
        marksRepository.deleteAll(marksRepository.findByStudent(student));
        attendanceRepository.deleteAll(attendanceRepository.findByStudent(student));

        studentRepository.delete(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> searchStudents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(keyword.trim())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getStudentsByDepartment(String department) {
        if (department == null || department.trim().isEmpty() || "All".equalsIgnoreCase(department.trim())) {
            return getAllStudents();
        }
        return studentRepository.findByDepartmentIgnoreCase(department.trim())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long totalStudents = studentRepository.count();
        Long totalDepartments = studentRepository.countDistinctDepartments();
        Double avgMarks = studentRepository.getAverageMarks();
        Double highestMarks = studentRepository.getHighestMarks();

        double roundedAvg = 0.0;
        if (avgMarks != null) {
            roundedAvg = BigDecimal.valueOf(avgMarks)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        double maxMarks = (highestMarks != null) ? highestMarks : 0.0;

        List<Object[]> deptCounts = studentRepository.countStudentsByDepartment();
        Map<String, Long> studentsByDepartment = new LinkedHashMap<>();
        for (Object[] row : deptCounts) {
            String deptName = (String) row[0];
            Long count = (Long) row[1];
            studentsByDepartment.put(deptName, count);
        }

        List<String> departments = studentRepository.findDistinctDepartments();

        return new DashboardStatsDTO(
                totalStudents,
                totalDepartments != null ? totalDepartments : 0,
                roundedAvg,
                maxMarks,
                studentsByDepartment,
                departments
        );
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isStudentIdAvailable(String studentId, Long excludeId) {
        if (studentId == null || studentId.trim().isEmpty()) {
            return false;
        }
        String trimmed = studentId.trim();
        if (excludeId != null && excludeId > 0) {
            return !studentRepository.existsByStudentIdAndIdNot(trimmed, excludeId);
        }
        return !studentRepository.existsByStudentId(trimmed);
    }

    // Helper conversion methods
    private StudentDTO toDTO(Student student) {
        return new StudentDTO(
                student.getId(),
                student.getStudentId(),
                student.getName(),
                student.getDepartment(),
                student.getYear(),
                student.getMarks(),
                student.getContact(),
                student.getEmail(),
                student.getCreatedAt(),
                student.getUpdatedAt()
        );
    }

    private Student toEntity(StudentDTO dto) {
        return new Student(
                dto.getId(),
                dto.getStudentId(),
                dto.getName(),
                dto.getDepartment(),
                dto.getYear(),
                dto.getMarks(),
                dto.getContact(),
                dto.getEmail()
        );
    }
}
