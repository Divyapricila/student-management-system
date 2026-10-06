package com.studentmanagement.repository;

import com.studentmanagement.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByStudentId(Long studentId);
    Optional<EventRegistration> findByEventIdAndStudentId(Long eventId, Long studentId);
    List<EventRegistration> findByEventId(Long eventId);
    boolean existsByEventIdAndStudentId(Long eventId, Long studentId);
}
