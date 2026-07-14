package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "College")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "college_id")
    private Integer collegeId;

    @Column(name = "college_name", nullable = false, length = 200)
    private String collegeName;

    @Column(name = "college_code", nullable = false, unique = true, length = 10)
    private String collegeCode;

    @Column(name = "affiliation", length = 100)
    private String affiliation = "Anna University";

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 50)
    private String city = "Chennai";

    @Column(name = "state", length = 50)
    private String state = "Tamil Nadu";

    @Column(name = "established_year")
    private Integer establishedYear;
}