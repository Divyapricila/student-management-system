package com.studentmanagement.repository;

import com.studentmanagement.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByStudentIdOrderByAchievementDateDesc(Long studentId);
}
