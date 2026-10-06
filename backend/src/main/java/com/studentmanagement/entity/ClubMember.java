package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "club_members")
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "role", length = 50)
    private String role = "MEMBER"; // MEMBER, CORE_TEAM, LEAD

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public ClubMember() {}

    public ClubMember(Long id, Club club, Student student, String role) {
        this.id = id;
        this.club = club;
        this.student = student;
        this.role = role != null ? role : "MEMBER";
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
