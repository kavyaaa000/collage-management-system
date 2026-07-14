package com.college.erp.erp.repository;

import com.college.erp.erp.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    List<Staff> findByDeptId(Integer deptId);

    List<Staff> findByDeptIdAndStatus(Integer deptId, String status);
    boolean existsByEmployeeId(String employeeId);
}