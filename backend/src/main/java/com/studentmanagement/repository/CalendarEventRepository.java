package com.studentmanagement.repository;

import com.studentmanagement.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findAllByOrderByEventDateAsc();

    @Query("SELECT c FROM CalendarEvent c WHERE c.semester = :semester OR c.semester IS NULL ORDER BY c.eventDate ASC")
    List<CalendarEvent> findBySemesterOrAllSemestersOrderByEventDateAsc(@Param("semester") Integer semester);
}
