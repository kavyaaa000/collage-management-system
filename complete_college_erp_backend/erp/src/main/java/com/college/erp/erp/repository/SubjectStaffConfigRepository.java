package com.college.erp.erp.repository;

import com.college.erp.erp.entity.SubjectStaffConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectStaffConfigRepository extends JpaRepository<SubjectStaffConfig, Integer> {

    List<SubjectStaffConfig> findByOfferingIdAndIsActiveTrue(Integer offeringId);

    List<SubjectStaffConfig> findByStaffIdAndIsActiveTrue(Integer staffId);

    Optional<SubjectStaffConfig> findByOfferingIdAndStaffIdAndIsActiveTrue(
            Integer offeringId, Integer staffId);

    @Query("SELECT ssc FROM SubjectStaffConfig ssc " +
            "JOIN ssc.subjectOffering so " +
            "WHERE so.sessionId = :sessionId AND so.semesterId = :semesterId " +
            "AND ssc.isActive = true")
    List<SubjectStaffConfig> findBySessionAndSemester(
            @Param("sessionId") Integer sessionId,
            @Param("semesterId") Integer semesterId);
}
