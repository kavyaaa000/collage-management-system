package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private Integer staffId;

    @Column(name = "employee_id", nullable = false, unique = true, length = 20)
    private String employeeId;

    @Column(name = "staff_name", nullable = false, length = 100)
    private String staffName;

    @Column(name = "dept_id", nullable = false)
    private Integer deptId;

    @Column(name = "designation", nullable = false, length = 50)
    private String designation;

    @Column(name = "qualification", nullable = false, length = 100)
    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears = 0;

    @Column(name = "date_of_joining", nullable = false)
    private LocalDate dateOfJoining;

    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    @Column(name = "max_hours_week")
    private Integer maxHoursWeek;
}