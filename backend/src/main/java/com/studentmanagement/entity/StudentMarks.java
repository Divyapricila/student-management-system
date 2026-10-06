package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing academic marks scored by a student in a subject for a semester.
 */
@Entity
@Table(name = "student_marks")
public class StudentMarks {

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

    @Column(name = "internal_marks", nullable = false)
    private Double internalMarks = 0.0;

    @Column(name = "external_marks", nullable = false)
    private Double externalMarks = 0.0;

    @Column(name = "total_marks", nullable = false)
    private Double totalMarks = 0.0;

    @Column(name = "grade", length = 10)
    private String grade = "A";

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public StudentMarks() {
    }

    public StudentMarks(Long id, Student student, Subject subject, Integer semester, Double internalMarks, Double externalMarks) {
        this.id = id;
        this.student = student;
        this.subject = subject;
        this.semester = semester;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        calculateTotalAndGrade();
    }

    @PrePersist
    @PreUpdate
    public void calculateTotalAndGrade() {
        double internal = (this.internalMarks != null) ? this.internalMarks : 0.0;
        double external = (this.externalMarks != null) ? this.externalMarks : 0.0;
        this.totalMarks = Math.round((internal + external) * 100.0) / 100.0;

        if (this.totalMarks >= 90.0) {
            this.grade = "O";
        } else if (this.totalMarks >= 80.0) {
            this.grade = "A+";
        } else if (this.totalMarks >= 70.0) {
            this.grade = "A";
        } else if (this.totalMarks >= 60.0) {
            this.grade = "B+";
        } else if (this.totalMarks >= 50.0) {
            this.grade = "B";
        } else if (this.totalMarks >= 40.0) {
            this.grade = "C";
        } else {
            this.grade = "F";
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

    public Double getInternalMarks() {
        return internalMarks;
    }

    public void setInternalMarks(Double internalMarks) {
        this.internalMarks = internalMarks;
        calculateTotalAndGrade();
    }

    public Double getExternalMarks() {
        return externalMarks;
    }

    public void setExternalMarks(Double externalMarks) {
        this.externalMarks = externalMarks;
        calculateTotalAndGrade();
    }

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Double getGradePoint() {
        if ("O".equalsIgnoreCase(this.grade)) return 10.0;
        if ("A+".equalsIgnoreCase(this.grade)) return 9.0;
        if ("A".equalsIgnoreCase(this.grade)) return 8.0;
        if ("B+".equalsIgnoreCase(this.grade)) return 7.0;
        if ("B".equalsIgnoreCase(this.grade)) return 6.0;
        if ("C".equalsIgnoreCase(this.grade)) return 5.0;
        return 0.0;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
