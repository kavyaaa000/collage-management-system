package com.college.erp.erp.repository;

import com.college.erp.erp.entity.StudentSemesterHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSemesterHistoryRepository extends JpaRepository<StudentSemesterHistory, Integer> {
    List<StudentSemesterHistory> findByStudentIdOrderBySemesterId(Integer studentId);
}