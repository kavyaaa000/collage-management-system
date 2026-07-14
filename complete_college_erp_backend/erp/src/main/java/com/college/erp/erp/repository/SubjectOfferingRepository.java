package com.college.erp.erp.repository;

import com.college.erp.erp.entity.SubjectOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectOfferingRepository extends JpaRepository<SubjectOffering, Integer> {

    @Query("SELECT so FROM SubjectOffering so " +
            "JOIN so.subject s " +
            "WHERE so.sessionId = :sessionId AND s.deptId = :deptId")
    List<SubjectOffering> findBySessionIdAndDeptId(
            @Param("sessionId") Integer sessionId,
            @Param("deptId") Integer deptId);

    List<SubjectOffering> findBySessionIdAndSemesterId(Integer sessionId, Integer semesterId);
}
