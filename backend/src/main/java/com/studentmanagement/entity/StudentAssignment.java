package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_assignments")
public class StudentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PENDING"; // "PENDING", "SUBMITTED", "OVERDUE"

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "submission_notes", length = 2000)
    private String submissionNotes;

    @Column(name = "marks_awarded")
    private Double marksAwarded;

    public StudentAssignment() {}

    public StudentAssignment(Long id, Assignment assignment, Student student, String status) {
        this.id = id;
        this.assignment = assignment;
        this.student = student;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public String getSubmissionNotes() { return submissionNotes; }
    public void setSubmissionNotes(String submissionNotes) { this.submissionNotes = submissionNotes; }

    public Double getMarksAwarded() { return marksAwarded; }
    public void setMarksAwarded(Double marksAwarded) { this.marksAwarded = marksAwarded; }
}
