package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_code", nullable = false, length = 50)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false, length = 150)
    private String subjectName;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "department", length = 50)
    private String department;

    @Column(name = "max_marks")
    private Integer maxMarks = 100;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Assignment() {}

    public Assignment(Long id, String subjectCode, String subjectName, String title, String description, LocalDate dueDate, Integer semester, String department, Integer maxMarks) {
        this.id = id;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.semester = semester;
        this.department = department;
        this.maxMarks = maxMarks;
        this.createdAt = LocalDateTime.now();
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
