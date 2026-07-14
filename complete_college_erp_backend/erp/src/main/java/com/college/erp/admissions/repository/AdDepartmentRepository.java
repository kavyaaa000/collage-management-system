package com.college.erp.admissions.repository;

import com.college.erp.admissions.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdDepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByCode(String code);

    Boolean existsByCode(String code);

    List<Department> findByIsActive(Boolean isActive);

    @Query("SELECT d FROM Department d WHERE d.isActive = true ORDER BY d.name")
    List<Department> findAllActiveDepartments();

    @Modifying
    @Query("UPDATE Department d SET d.availableSeats = d.availableSeats - 1 WHERE d.id = :deptId AND d.availableSeats > 0")
    int decrementAvailableSeats(@Param("deptId") Long deptId);

    @Modifying
    @Query("UPDATE Department d SET d.availableSeats = d.totalSeats WHERE d.id = :deptId")
    int resetAvailableSeats(@Param("deptId") Long deptId);
}
