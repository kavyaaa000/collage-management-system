package com.college.erp.admissions.repository;

import com.college.erp.admissions.entity.AdmissionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionResultRepository extends JpaRepository<AdmissionResult, Long> {

    Optional<AdmissionResult> findByStudentProfileId(Long studentProfileId);

    Optional<AdmissionResult> findByOfferResponseToken(String token);

    List<AdmissionResult> findByAllocationStatus(AdmissionResult.AllocationStatus status);

    long countByAllocationStatus(AdmissionResult.AllocationStatus status);

    long countByOfferStatus(AdmissionResult.OfferStatus status);

    @Query("SELECT ar FROM AdmissionResult ar WHERE ar.notificationSent = false")
    List<AdmissionResult> findPendingNotifications();

    @Query("SELECT COUNT(ar) FROM AdmissionResult ar WHERE ar.allocatedDepartment.id = :departmentId")
    long countByAllocatedDepartmentId(Long departmentId);

    @Query("SELECT ar FROM AdmissionResult ar " +
            "WHERE ar.allocationStatus = 'ALLOTTED' " +
            "AND ar.allocatedDepartment.id = :departmentId " +
            "ORDER BY ar.cutoffScoreAtAllocation DESC")
    List<AdmissionResult> findAllottedByDepartmentOrderByCutoff(Long departmentId);

    // ADD THIS - fixes the LazyInitializationException
    @Query("SELECT ar FROM AdmissionResult ar " +
            "LEFT JOIN FETCH ar.studentProfile sp " +
            "LEFT JOIN FETCH sp.user " +
            "LEFT JOIN FETCH ar.allocatedDepartment")
    List<AdmissionResult> findAllWithDetails();
}