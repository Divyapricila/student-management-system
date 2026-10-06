package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing student attendance for a subject in a semester.
 */
@Entity
@Table(name = "student_attendance")
public class StudentAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "present_classes", nullable = false)
    private Integer presentClasses = 0;

    @Column(name = "total_classes", nullable = false)
    private Integer totalClasses = 0;

    @Column(name = "percentage", nullable = false)
    private Double percentage = 0.0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public StudentAttendance() {
    }

    public StudentAttendance(Long id, Student student, Subject subject, Integer semester, Integer presentClasses, Integer totalClasses) {
        this.id = id;
        this.student = student;
        this.subject = subject;
        this.semester = semester;
        this.presentClasses = presentClasses;
        this.totalClasses = totalClasses;
        calculatePercentage();
    }

    @PrePersist
    @PreUpdate
    public void calculatePercentage() {
        if (totalClasses != null && totalClasses > 0 && presentClasses != null) {
            this.percentage = Math.round(((double) presentClasses / totalClasses * 100.0) * 100.0) / 100.0;
        } else {
            this.percentage = 0.0;
        }
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Integer getPresentClasses() {
        return presentClasses;
    }

    public void setPresentClasses(Integer presentClasses) {
        this.presentClasses = presentClasses;
        calculatePercentage();
    }

    public Integer getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(Integer totalClasses) {
        this.totalClasses = totalClasses;
        calculatePercentage();
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
