package com.studentmanagement.repository;

import com.studentmanagement.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findBySemester(Integer semester);
    List<Assignment> findBySemesterAndDepartment(Integer semester, String department);
    List<Assignment> findAllByOrderByDueDateAsc();
}
