package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", length = 50)
    private String studentId; // Specific STU001 or "ALL"

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "message", nullable = false, length = 2000)
    private String message;

    @Column(name = "type", length = 50)
    private String type = "GENERAL"; // MARKS, ATTENDANCE, ASSIGNMENT, EXAM, FEE, ANNOUNCEMENT

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "action_url", length = 255)
    private String actionUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public Notification(Long id, String studentId, String title, String message, String type, Boolean isRead, String actionUrl) {
        this.id = id;
        this.studentId = studentId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = isRead != null ? isRead : false;
        this.actionUrl = actionUrl;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean read) { isRead = read; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
