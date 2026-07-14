// =====================================================
// REST Controllers
// =====================================================

package com.college.erp.erp.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/erp/health")
@CrossOrigin(origins = "*")
public class ErpHealthController {

    @GetMapping
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("HOD Dashboard API is running");
    }
}