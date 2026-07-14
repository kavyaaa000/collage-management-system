package com.college.erp.evaluation.service;

import com.college.erp.evaluation.entity.EvaluationAuditLog;
import com.college.erp.evaluation.repository.EvaluationAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final EvaluationAuditLogRepository auditLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(EvaluationAuditLog.ActionType actionType,
                          EvaluationAuditLog.EntityType entityType,
                          Integer entityId,
                          Integer performedBy,
                          EvaluationAuditLog.UserRole userRole,
                          String oldValue,
                          String remarks) {
        try {
            EvaluationAuditLog auditLog = EvaluationAuditLog.builder()
                    .actionType(actionType)
                    .entityType(entityType)
                    .entityId(entityId)
                    .performedBy(performedBy)
                    .userRole(userRole)
                    .oldValue(oldValue)
                    .remarks(remarks)
                    .build();

            auditLogRepository.save(auditLog);
            log.debug("Audit log created: {} - {} - {}", actionType, entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log", e);
            // Don't throw exception to avoid breaking main transaction
        }
    }
}