package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Program")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Integer programId;

    @Column(name = "program_name", nullable = false, length = 100)
    private String programName;

    @Column(name = "program_code", nullable = false, unique = true, length = 20)
    private String programCode;

    @Column(name = "duration_years", nullable = false)
    private Integer durationYears = 4;
}