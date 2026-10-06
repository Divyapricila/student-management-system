package com.studentmanagement.repository;

import com.studentmanagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByStudentIdOrStudentIdOrderByCreatedAtDesc(String studentId, String allKeyword);
    long countByStudentIdAndIsReadFalse(String studentId);
    long countByStudentIdInAndIsReadFalse(List<String> studentIds);
}
