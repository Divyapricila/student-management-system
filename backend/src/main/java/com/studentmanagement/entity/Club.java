package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "campus_clubs")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "coordinator", nullable = false, length = 100)
    private String coordinator;

    @Column(name = "meeting_day", length = 50)
    private String meetingDay = "Every Wednesday, 4:00 PM";

    @Column(name = "category", length = 50)
    private String category = "Technical"; // Technical, Cultural, Sports, Social

    @Column(name = "member_count")
    private Integer memberCount = 0;

    @Column(name = "icon", length = 50)
    private String icon = "code";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Club() {}

    public Club(Long id, String name, String description, String coordinator, String meetingDay, String category, Integer memberCount, String icon) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.coordinator = coordinator;
        this.meetingDay = meetingDay;
        this.category = category;
        this.memberCount = memberCount;
        this.icon = icon;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoordinator() { return coordinator; }
    public void setCoordinator(String coordinator) { this.coordinator = coordinator; }

    public String getMeetingDay() { return meetingDay; }
    public void setMeetingDay(String meetingDay) { this.meetingDay = meetingDay; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
