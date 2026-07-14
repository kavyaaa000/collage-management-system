package com.college.erp.connect.controller;

import com.college.erp.connect.entity.Department;
import com.college.erp.connect.repository.CoDepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connect/admin")
@RequiredArgsConstructor
public class ConnectAdminController {

    private final CoDepartmentRepository coDepartmentRepository;

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = coDepartmentRepository.findAll();
        return ResponseEntity.ok(departments);
    }

    @PostMapping("/departments")
    public ResponseEntity<?> createDepartment(@RequestBody Department department) {
        try {
            if (coDepartmentRepository.findByCode(department.getCode()).isPresent()) {
                return ResponseEntity.badRequest().body("Department code already exists");
            }
            Department savedDepartment = coDepartmentRepository.save(department);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDepartment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}