package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// ClassroomAssignment Entity
@Entity
@Table(name = "classroomassignment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassroomAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Integer assignmentId;

    @Column(name = "session_id", nullable = false)
    private Integer sessionId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "section_id", nullable = false)
    private Integer sectionId;

    @Column(name = "room_id", nullable = false)
    private Integer roomId;

    @Column(name = "dept_id", nullable = false)
    private Integer deptId;

    @Column(name = "assigned_by", nullable = false)
    private Integer assignedBy;

    @Column(name = "assignment_type")
    private String assignmentType = "CLASSROOM";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
}
