package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.SmartAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AtSmartAlertRepository extends JpaRepository<SmartAlert, Long> {

    List<SmartAlert> findByStudentIdAndIsNotifiedFalseOrderByCreatedAtDesc(Integer studentId);

    List<SmartAlert> findByIsNotifiedFalseAndSeverity(SmartAlert.Severity severity);

    List<SmartAlert> findByStudentIdOrderByCreatedAtDesc(Integer studentId);
}