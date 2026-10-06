package com.studentmanagement.repository;

import com.studentmanagement.entity.StudentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAssignmentRepository extends JpaRepository<StudentAssignment, Long> {
    List<StudentAssignment> findByStudentId(Long studentId);
    Optional<StudentAssignment> findByStudentIdAndAssignmentId(Long studentId, Long assignmentId);
    List<StudentAssignment> findByStudentIdAndStatus(Long studentId, String status);
    long countByStudentIdAndStatus(Long studentId, String status);
}
