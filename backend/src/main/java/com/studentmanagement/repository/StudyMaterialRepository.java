package com.studentmanagement.repository;

import com.studentmanagement.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    List<StudyMaterial> findBySemester(Integer semester);
    List<StudyMaterial> findBySemesterAndDepartment(Integer semester, String department);
    List<StudyMaterial> findAllByOrderByUploadedDateDesc();
}
