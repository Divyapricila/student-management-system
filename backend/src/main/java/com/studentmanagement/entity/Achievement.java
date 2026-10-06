package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "category", nullable = false, length = 50)
    private String category; // "Certificate", "Hackathon", "Workshop", "Competition", "Academic"

    @Column(name = "achievement_date", nullable = false)
    private LocalDate achievementDate;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "certificate_url", length = 500)
    private String certificateUrl;

    @Column(name = "issuer", length = 150)
    private String issuer;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Achievement() {}

    public Achievement(Long id, Student student, String title, String category, LocalDate achievementDate, String description, String certificateUrl, String issuer) {
        this.id = id;
        this.student = student;
        this.title = title;
        this.category = category;
        this.achievementDate = achievementDate;
        this.description = description;
        this.certificateUrl = certificateUrl;
        this.issuer = issuer;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
