package com.studentmanagement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AnnouncementDTO {
    private Long id;
    private String title;
    private String message;
    private String priority; // NORMAL, IMPORTANT, URGENT
    private String targetDepartment;
    private Integer targetYear;
    private LocalDate publishDate;
    private LocalDate expiryDate;
    private String createdBy;
    private LocalDateTime createdAt;
    private Boolean isUrgent;

    public AnnouncementDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) {
        this.priority = priority;
        this.isUrgent = "URGENT".equalsIgnoreCase(priority);
    }

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

    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean urgent) { isUrgent = urgent; }
}
