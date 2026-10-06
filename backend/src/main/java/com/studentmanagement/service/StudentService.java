package com.studentmanagement.service;

import com.studentmanagement.dto.DashboardStatsDTO;
import com.studentmanagement.dto.StudentDTO;

import java.util.List;

/**
 * Service interface for Student management operations.
 */
public interface StudentService {

    List<StudentDTO> getAllStudents();

    StudentDTO getStudentById(Long id);

    StudentDTO getStudentByStudentId(String studentId);

    StudentDTO createStudent(StudentDTO studentDTO);

    StudentDTO updateStudent(Long id, StudentDTO studentDTO);

    void deleteStudent(Long id);

    List<StudentDTO> searchStudents(String keyword);

    List<StudentDTO> getStudentsByDepartment(String department);

    DashboardStatsDTO getDashboardStats();

    boolean isStudentIdAvailable(String studentId, Long excludeId);
}
