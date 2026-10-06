package com.studentmanagement.service;

import com.studentmanagement.dto.AuditLogDTO;
import com.studentmanagement.entity.AuditLog;
import com.studentmanagement.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(String username, String action, String entityName, String entityId, String description) {
        AuditLog auditLog = new AuditLog(null, username != null ? username : "system", action, entityName, entityId, description);
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(log -> new AuditLogDTO(log.getId(), log.getUsername(), log.getAction(), log.getEntityName(), log.getEntityId(), log.getDescription(), log.getTimestamp()))
                .collect(Collectors.toList());
    }
}
