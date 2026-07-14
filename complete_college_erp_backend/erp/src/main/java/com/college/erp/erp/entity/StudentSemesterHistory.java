package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "studentsemesterhistory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSemesterHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Integer historyId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "session_id", nullable = false)
    private Integer sessionId;

    @Column(name = "result_status", length = 20)
    private String resultStatus;

    @Column(name = "promoted_on")
    private LocalDate promotedOn;
}