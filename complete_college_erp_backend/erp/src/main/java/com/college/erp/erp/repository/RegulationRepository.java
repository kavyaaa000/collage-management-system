package com.college.erp.erp.repository;

import com.college.erp.erp.entity.Regulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegulationRepository extends JpaRepository<Regulation, Integer> {
    List<Regulation> findByIsActive(Boolean isActive);
    boolean existsByRegulationCode(String regulationCode);
}