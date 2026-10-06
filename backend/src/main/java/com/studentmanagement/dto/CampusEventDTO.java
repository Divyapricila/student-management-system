package com.studentmanagement.dto;

import java.time.LocalDate;

public class CampusEventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate eventDate;
    private String eventTime;
    private String venue;
    private String organizer;
    private String category;
    private Integer capacity;
    private Integer registeredCount;
    private Boolean isRegistered;

    public CampusEventDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getEventTime() { return eventTime; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }

    public Boolean getIsRegistered() { return isRegistered; }
    public void setIsRegistered(Boolean registered) { isRegistered = registered; }
}
