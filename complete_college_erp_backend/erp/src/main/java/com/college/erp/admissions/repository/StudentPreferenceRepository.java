package com.college.erp.admissions.repository;

import com.college.erp.admissions.entity.StudentPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentPreferenceRepository extends JpaRepository<StudentPreference, Long> {

    List<StudentPreference> findByStudentProfileIdOrderByPreferenceOrderAsc(Long studentProfileId);

    @Modifying
    @Query("DELETE FROM StudentPreference sp WHERE sp.studentProfile.id = :studentProfileId")
    void deleteByStudentProfileId(@Param("studentProfileId") Long studentProfileId);

    @Query("SELECT COUNT(sp) FROM StudentPreference sp WHERE sp.studentProfile.id = :studentProfileId")
    long countByStudentProfileId(@Param("studentProfileId") Long studentProfileId);
}
