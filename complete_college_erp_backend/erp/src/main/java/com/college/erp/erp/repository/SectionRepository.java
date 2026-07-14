package com.college.erp.erp.repository;

import com.college.erp.erp.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {
    boolean existsBySectionName(String sectionName);
}