package com.studentmanagement.dto;

import java.time.LocalDateTime;

public class AuditLogDTO {
    private Long id;
    private String username;
    private String action;
    private String entityName;
    private String entityId;
    private String description;
    private LocalDateTime timestamp;

    public AuditLogDTO() {}

    public AuditLogDTO(Long id, String username, String action, String entityName, String entityId, String description, LocalDateTime timestamp) {
        this.id = id;
        this.username = username;
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.description = description;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
