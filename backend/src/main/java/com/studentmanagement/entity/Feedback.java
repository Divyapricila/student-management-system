package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing student feedback submissions.
 */
@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "student_ref_id", length = 50)
    private String studentRefId;

    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @Column(name = "rating", nullable = false)
    private Integer rating; // 1 to 5

    @Column(name = "message", nullable = false, length = 1000)
    private String message;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Feedback() {
    }

    public Feedback(Long id, Student student, String studentRefId, String studentName, Integer rating, String message) {
        this.id = id;
        this.student = student;
        this.studentRefId = studentRefId;
        this.studentName = studentName;
        this.rating = rating;
        this.message = message;
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

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getStudentRefId() {
        return studentRefId;
    }

    public void setStudentRefId(String studentRefId) {
        this.studentRefId = studentRefId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
