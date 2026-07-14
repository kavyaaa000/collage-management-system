package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private Integer staffId;

    @Column(name = "staff_code", unique = true, nullable = false)
    private String staffCode;

    @Column(name = "staff_name", nullable = false)
    private String staffName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "designation")
    private String designation;

    @Column(name = "dept_id")
    private Integer departmentId;

    @Column(name = "is_active")
    private Boolean isActive = true;
}