package com.college.erp.erp.repository;

import com.college.erp.erp.entity.ExamType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamTypeRepository extends JpaRepository<ExamType, Integer> {
    boolean existsByExamTypeName(String examTypeName);
}