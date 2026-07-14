package com.college.erp.admissions.repository;

import com.college.erp.admissions.entity.AdmissionResult;
import com.college.erp.admissions.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUserId(Long userId);

    Optional<StudentProfile> findByApplicationNumber(String applicationNumber);

    Boolean existsByApplicationNumber(String applicationNumber);

    List<StudentProfile> findByAssignedMentorId(Long mentorId);

    List<StudentProfile> findByVerificationStatus(StudentProfile.VerificationStatus status);

    @Query("SELECT sp FROM StudentProfile sp WHERE sp.assignedMentor.id = :mentorId AND sp.verificationStatus = :status")
    List<StudentProfile> findByMentorAndVerificationStatus(
            @Param("mentorId") Long mentorId,
            @Param("status") StudentProfile.VerificationStatus status
    );

    @Query("SELECT sp FROM StudentProfile sp WHERE sp.verificationStatus = 'VERIFIED' AND sp.registrationStatus = 'SUBMITTED' ORDER BY sp.cutoffScore DESC, sp.createdAt ASC")
    List<StudentProfile> findAllVerifiedStudentsForAdmission();

    @Query("SELECT COUNT(sp) FROM StudentProfile sp WHERE sp.verificationStatus = :status")
    long countByVerificationStatus(@Param("status") StudentProfile.VerificationStatus status);

    @Query("SELECT sp FROM StudentProfile sp WHERE sp.studentGroupNumber IS NULL AND sp.registrationStatus = 'SUBMITTED'")
    List<StudentProfile> findUnassignedStudents();

    @Query("SELECT COALESCE(MAX(sp.studentGroupNumber), 0) FROM StudentProfile sp")
    Integer findMaxGroupNumber();



    @Query("SELECT sp FROM StudentProfile sp " +
            "LEFT JOIN FETCH sp.user " +
            "LEFT JOIN FETCH sp.assignedMentor")
    List<StudentProfile> findAllWithUserAndMentor();


    @Query("SELECT ar FROM AdmissionResult ar " +
            "LEFT JOIN FETCH ar.studentProfile sp " +
            "LEFT JOIN FETCH sp.user " +
            "LEFT JOIN FETCH ar.allocatedDepartment")
    List<AdmissionResult> findAllWithDetails();

    // StudentProfileRepository

}
