package com.studentmanagement.dto;

import java.time.LocalDate;

public class CalendarEventDTO {

    private Long id;
    private String title;
    private String eventType;
    private LocalDate eventDate;
    private String department;
    private Integer semester;
    private String description;

    public CalendarEventDTO() {
    }

    public CalendarEventDTO(Long id, String title, String eventType, LocalDate eventDate, String department, Integer semester, String description) {
        this.id = id;
        this.title = title;
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.department = department;
        this.semester = semester;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
