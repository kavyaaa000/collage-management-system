package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_class_mapping")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffClassMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mapping_id")
    private Integer mappingId;

    @Column(name = "staff_id", nullable = false)
    private Integer staffId;

    @Column(name = "class_id", nullable = false)
    private Integer classId;

    @Column(name = "subject_id")
    private Integer subjectId;

    @Column(name = "can_mark_attendance")
    private Boolean canMarkAttendance = true;

    @Column(name = "can_view_analytics")
    private Boolean canViewAnalytics = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}