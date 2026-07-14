package com.college.erp.erp.repository;

import com.college.erp.erp.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    List<Department> findByCollegeId(Integer collegeId);
    boolean existsByDeptCode(String deptCode);
}