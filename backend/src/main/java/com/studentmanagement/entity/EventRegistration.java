package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private CampusEvent event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Column(name = "status", nullable = false, length = 30)
    private String status = "CONFIRMED"; // CONFIRMED, CANCELLED

    public EventRegistration() {}

    public EventRegistration(Long id, CampusEvent event, Student student) {
        this.id = id;
        this.event = event;
        this.student = student;
        this.registeredAt = LocalDateTime.now();
        this.status = "CONFIRMED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CampusEvent getEvent() { return event; }
    public void setEvent(CampusEvent event) { this.event = event; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
