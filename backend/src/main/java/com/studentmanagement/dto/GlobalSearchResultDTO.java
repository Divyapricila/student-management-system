package com.studentmanagement.dto;

public class GlobalSearchResultDTO {
    private String title;
    private String subtitle;
    private String category; // Student, Department, Exam, Material, Event, Announcement
    private String url;
    private String type;

    public GlobalSearchResultDTO() {}

    public GlobalSearchResultDTO(String title, String subtitle, String category, String url, String type) {
        this.title = title;
        this.subtitle = subtitle;
        this.category = category;
        this.url = url;
        this.type = type;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
