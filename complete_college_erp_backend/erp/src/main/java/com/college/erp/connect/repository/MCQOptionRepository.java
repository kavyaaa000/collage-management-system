package com.college.erp.connect.repository;

import com.college.erp.connect.entity.MCQOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MCQOptionRepository extends JpaRepository<MCQOption, Long> {
}
