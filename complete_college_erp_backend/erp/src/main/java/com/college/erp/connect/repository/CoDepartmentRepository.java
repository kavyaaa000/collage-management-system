package com.college.erp.connect.repository;

import com.college.erp.connect.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoDepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByCode(String code);
}