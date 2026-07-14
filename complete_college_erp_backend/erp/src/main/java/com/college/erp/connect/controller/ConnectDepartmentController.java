package com.college.erp.connect.controller;

import com.college.erp.connect.entity.Department;
import com.college.erp.connect.repository.CoDepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/connect")
@RequiredArgsConstructor
public class ConnectDepartmentController {

    private final CoDepartmentRepository coDepartmentRepository;

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = coDepartmentRepository.findAll();
        return ResponseEntity.ok(departments);
    }
}