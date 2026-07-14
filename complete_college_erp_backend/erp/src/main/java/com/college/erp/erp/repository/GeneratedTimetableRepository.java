package com.college.erp.erp.repository;

import com.college.erp.erp.entity.GeneratedTimetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GeneratedTimetableRepository extends JpaRepository<GeneratedTimetable, Integer> {

    List<GeneratedTimetable> findByDeptIdOrderByGenerationDateDesc(Integer deptId);

    List<GeneratedTimetable> findBySessionIdAndDeptId(Integer sessionId, Integer deptId);

    Optional<GeneratedTimetable> findFirstBySessionIdAndDeptIdAndStatusOrderByGenerationDateDesc(
            Integer sessionId, Integer deptId, String status);

    @Query("SELECT gt FROM GeneratedTimetable gt WHERE gt.deptId = :deptId " +
            "AND gt.status = 'ACTIVE' ORDER BY gt.generationDate DESC")
    Optional<GeneratedTimetable> findActiveTimetableByDept(@Param("deptId") Integer deptId);
}
