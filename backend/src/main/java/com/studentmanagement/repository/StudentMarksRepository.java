package com.studentmanagement.repository;

import com.studentmanagement.entity.Student;
import com.studentmanagement.entity.StudentMarks;
import com.studentmanagement.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentMarksRepository extends JpaRepository<StudentMarks, Long> {
    List<StudentMarks> findByStudentAndSemesterOrderBySubjectCodeAsc(Student student, Integer semester);
    List<StudentMarks> findByStudent(Student student);
    List<StudentMarks> findByStudentOrderBySemesterAsc(Student student);
    List<StudentMarks> findByStudentAndGrade(Student student, String grade);
    long countByStudentAndGrade(Student student, String grade);
    Optional<StudentMarks> findByStudentAndSubjectAndSemester(Student student, Subject subject, Integer semester);
}
