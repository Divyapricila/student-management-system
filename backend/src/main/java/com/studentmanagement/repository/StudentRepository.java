package com.studentmanagement.repository;

import com.studentmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Student entity.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    /**
     * Find a student by studentId (e.g. STU001).
     */
    Optional<Student> findByStudentId(String studentId);

    /**
     * Check if a student ID already exists.
     */
    boolean existsByStudentId(String studentId);

    /**
     * Check if student ID exists for another record (useful when editing).
     */
    boolean existsByStudentIdAndIdNot(String studentId, Long id);

    /**
     * Search students across studentId, name, or department with case-insensitive matching.
     */
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.studentId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.department) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchStudents(@Param("keyword") String keyword);

    /**
     * Filter students by department.
     */
    List<Student> findByDepartmentIgnoreCase(String department);

    /**
     * Distinct department count.
     */
    @Query("SELECT COUNT(DISTINCT s.department) FROM Student s")
    Long countDistinctDepartments();

    /**
     * Calculate average marks of all students.
     */
    @Query("SELECT AVG(s.marks) FROM Student s")
    Double getAverageMarks();

    /**
     * Find the highest marks scored.
     */
    @Query("SELECT MAX(s.marks) FROM Student s")
    Double getHighestMarks();

    /**
     * Count students grouped by department.
     */
    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department")
    List<Object[]> countStudentsByDepartment();

    /**
     * Retrieve list of distinct department names.
     */
    @Query("SELECT DISTINCT s.department FROM Student s ORDER BY s.department ASC")
    List<String> findDistinctDepartments();
}
