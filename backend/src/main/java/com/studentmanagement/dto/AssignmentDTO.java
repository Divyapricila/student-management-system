package com.studentmanagement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssignmentDTO {
    private Long id;
    private String subjectCode;
    private String subjectName;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer semester;
    private String department;
    private Integer maxMarks;
    private String status; // PENDING, SUBMITTED, OVERDUE
    private LocalDateTime submittedAt;
    private String submissionNotes;
    private Double marksAwarded;
    private Long daysRemaining;

    public AssignmentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Integer maxMarks) { this.maxMarks = maxMarks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public String getSubmissionNotes() { return submissionNotes; }
    public void setSubmissionNotes(String submissionNotes) { this.submissionNotes = submissionNotes; }

    public Double getMarksAwarded() { return marksAwarded; }
    public void setMarksAwarded(Double marksAwarded) { this.marksAwarded = marksAwarded; }

    public Long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; }
}
