package com.studentmanagement.repository;

import com.studentmanagement.entity.Student;
import com.studentmanagement.entity.StudentAttendance;
import com.studentmanagement.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAttendanceRepository extends JpaRepository<StudentAttendance, Long> {
    List<StudentAttendance> findByStudentAndSemesterOrderBySubjectCodeAsc(Student student, Integer semester);
    List<StudentAttendance> findByStudent(Student student);
    Optional<StudentAttendance> findByStudentAndSubjectAndSemester(Student student, Subject subject, Integer semester);
}
