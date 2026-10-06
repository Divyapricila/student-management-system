package com.studentmanagement.dto;

import java.time.LocalDate;

public class AchievementDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String title;
    private String category;
    private LocalDate achievementDate;
    private String description;
    private String certificateUrl;
    private String issuer;

    public AchievementDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getAchievementDate() { return achievementDate; }
    public void setAchievementDate(LocalDate achievementDate) { this.achievementDate = achievementDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
}
