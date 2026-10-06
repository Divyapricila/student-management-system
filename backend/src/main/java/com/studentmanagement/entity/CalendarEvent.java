package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing an academic calendar event (Classes, Exams, Holidays, Deadlines, etc.).
 */
@Entity
@Table(name = "calendar_events")
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType; // "CLASS", "EXAM", "INTERNAL_EXAM", "HOLIDAY", "ASSIGNMENT", "PROJECT_REVIEW", "EVENT"

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "department", length = 100)
    private String department = "ALL";

    @Column(name = "semester")
    private Integer semester; // null means applies to all semesters

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public CalendarEvent() {
    }

    public CalendarEvent(Long id, String title, String eventType, LocalDate eventDate, String department, Integer semester, String description) {
        this.id = id;
        this.title = title;
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.department = department != null ? department : "ALL";
        this.semester = semester;
        this.description = description;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
