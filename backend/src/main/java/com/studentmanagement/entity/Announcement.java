package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "message", nullable = false, length = 2000)
    private String message;

    @Column(name = "priority", nullable = false, length = 30)
    private String priority = "NORMAL"; // NORMAL, IMPORTANT, URGENT

    @Column(name = "target_department", length = 50)
    private String targetDepartment = "ALL"; // ALL or ECE, CSE...

    @Column(name = "target_year")
    private Integer targetYear; // null means all years

    @Column(name = "publish_date", nullable = false)
    private LocalDate publishDate = LocalDate.now();

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "created_by", length = 100)
    private String createdBy = "Academic Office";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Announcement() {}

    public Announcement(Long id, String title, String message, String priority, String targetDepartment, Integer targetYear, LocalDate publishDate, LocalDate expiryDate, String createdBy) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.priority = priority;
        this.targetDepartment = targetDepartment;
        this.targetYear = targetYear;
        this.publishDate = publishDate;
        this.expiryDate = expiryDate;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getTargetDepartment() { return targetDepartment; }
    public void setTargetDepartment(String targetDepartment) { this.targetDepartment = targetDepartment; }

    public Integer getTargetYear() { return targetYear; }
    public void setTargetYear(Integer targetYear) { this.targetYear = targetYear; }

    public LocalDate getPublishDate() { return publishDate; }
    public void setPublishDate(LocalDate publishDate) { this.publishDate = publishDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
