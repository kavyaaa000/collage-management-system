package com.college.erp.evaluation.repository;

import com.college.erp.evaluation.entity.EvaluationAuditLog;
import com.college.erp.evaluation.entity.EvaluationAuditLog.ActionType;
import com.college.erp.evaluation.entity.EvaluationAuditLog.EntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EvaluationAuditLogRepository extends JpaRepository<EvaluationAuditLog, Long> {

    List<EvaluationAuditLog> findByEntityTypeAndEntityId(EntityType entityType, Integer entityId);

    List<EvaluationAuditLog> findByActionType(ActionType actionType);

    List<EvaluationAuditLog> findByPerformedBy(Integer userId);

    Page<EvaluationAuditLog> findByEntityTypeAndEntityId(
            EntityType entityType, Integer entityId, Pageable pageable
    );

    @Query("SELECT eal FROM EvaluationAuditLog eal " +
            "WHERE eal.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY eal.createdAt DESC")
    List<EvaluationAuditLog> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT eal FROM EvaluationAuditLog eal " +
            "WHERE eal.actionType = :actionType AND eal.entityType = :entityType " +
            "ORDER BY eal.createdAt DESC")
    Page<EvaluationAuditLog> findByActionAndEntityType(
            @Param("actionType") ActionType actionType,
            @Param("entityType") EntityType entityType,
            Pageable pageable
    );
}