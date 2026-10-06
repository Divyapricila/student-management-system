package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "campus_events_master")
public class CampusEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "event_time", nullable = false, length = 50)
    private String eventTime = "10:00 AM - 04:00 PM";

    @Column(name = "venue", nullable = false, length = 100)
    private String venue;

    @Column(name = "organizer", nullable = false, length = 100)
    private String organizer;

    @Column(name = "category", length = 50)
    private String category = "TECH"; // TECH, CULTURAL, SPORTS, WORKSHOP

    @Column(name = "capacity")
    private Integer capacity = 200;

    @Column(name = "registered_count")
    private Integer registeredCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public CampusEvent() {}

    public CampusEvent(Long id, String title, String description, LocalDate eventDate, String eventTime, String venue, String organizer, String category, Integer capacity) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.venue = venue;
        this.organizer = organizer;
        this.category = category;
        this.capacity = capacity;
        this.registeredCount = 0;
        this.createdAt = LocalDateTime.now();
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
