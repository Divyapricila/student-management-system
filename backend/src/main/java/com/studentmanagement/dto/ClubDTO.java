package com.studentmanagement.dto;

public class ClubDTO {
    private Long id;
    private String name;
    private String description;
    private String coordinator;
    private String meetingDay;
    private String category;
    private Integer memberCount;
    private String icon;
    private Boolean isMember;
    private String role;

    public ClubDTO() {}

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

    public Boolean getIsMember() { return isMember; }
    public void setIsMember(Boolean member) { isMember = member; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
