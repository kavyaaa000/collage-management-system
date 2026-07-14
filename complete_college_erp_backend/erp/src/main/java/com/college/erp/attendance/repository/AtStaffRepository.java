package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AtStaffRepository extends JpaRepository<Staff, Integer> {

    List<Staff> findByIsActiveTrue();

    List<Staff> findByDepartmentId(Integer departmentId);
}