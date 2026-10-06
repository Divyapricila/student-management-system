package com.studentmanagement.repository;

import com.studentmanagement.entity.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {
    List<ExamSchedule> findBySemester(Integer semester);
    List<ExamSchedule> findBySemesterAndDepartment(Integer semester, String department);
    List<ExamSchedule> findAllByOrderByExamDateAsc();
    List<ExamSchedule> findByExamDateGreaterThanEqualOrderByExamDateAsc(LocalDate date);
}
