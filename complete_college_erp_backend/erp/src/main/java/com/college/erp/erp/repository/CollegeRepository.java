package com.college.erp.erp.repository;

import com.college.erp.erp.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollegeRepository extends JpaRepository<College, Integer> {
    boolean existsByCollegeCode(String collegeCode);
}