package com.college.erp.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "timetable")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Timetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timetable_id")
    private Integer timetableId;

    @Column(name = "session_id", nullable = false)
    private Integer sessionId;

    @Column(name = "semester_id", nullable = false)
    private Integer semesterId;

    @Column(name = "section_id", nullable = false)
    private Integer sectionId;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;

    @Column(name = "period_number", nullable = false)
    private Integer periodNumber;

    @Column(name = "subject_id")
    private Integer subjectId;

    @Column(name = "staff_id")
    private Integer staffId;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}