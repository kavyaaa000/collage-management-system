package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.StaffClassMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AtStaffClassMappingRepository extends JpaRepository<StaffClassMapping, Integer> {

    List<StaffClassMapping> findByStaffId(Integer staffId);

    List<StaffClassMapping> findByClassId(Integer classId);

    @Query("SELECT DISTINCT scm.classId FROM StaffClassMapping scm WHERE scm.staffId = :staffId")
    List<Integer> findClassIdsByStaffId(Integer staffId);

    boolean existsByStaffIdAndClassId(Integer staffId, Integer classId);
}