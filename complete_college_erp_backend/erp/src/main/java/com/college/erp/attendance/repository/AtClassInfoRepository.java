package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.ClassInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AtClassInfoRepository extends JpaRepository<ClassInfo, Integer> {

    List<ClassInfo> findByIsActiveTrueOrderByClassNameAsc();

    List<ClassInfo> findByDepartmentIdAndIsActiveTrue(Integer departmentId);

    Optional<ClassInfo> findByDepartmentIdAndSemesterIdAndSectionId(
            Integer departmentId, Integer semesterId, Integer sectionId);

    List<ClassInfo> findBySemesterIdAndIsActiveTrue(Integer semesterId);
}