package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

// GeneratedTimetable Entity
@Entity
@Table(name = "generatedtimetable")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedTimetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timetable_id")
    private Integer timetableId;

    @Column(name = "session_id", nullable = false)
    private Integer sessionId;

    @Column(name = "dept_id", nullable = false)
    private Integer deptId;

    @Column(name = "generation_date")
    private LocalDateTime generationDate;

    @Column(name = "generated_by", nullable = false)
    private Integer generatedBy;

    @Column(name = "status")
    private String status = "DRAFT";

    @Column(name = "excel_file_path")
    private String excelFilePath;

    @Column(name = "pdf_file_path")
    private String pdfFilePath;

    @Column(name = "solver_status")
    private String solverStatus;

    @Column(name = "solver_cost")
    private Double solverCost;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "generatedTimetable", cascade = CascadeType.ALL)
    private List<TimetableSlot> slots;
}
