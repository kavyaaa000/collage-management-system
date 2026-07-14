package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// SubjectOffering Entity (simplified - add to existing)
@Entity
@Table(name = "subjectoffering")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectOffering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offering_id")
    private Integer offeringId;

    @Column(name = "subject_id")
    private Integer subjectId;

    @Column(name = "session_id")
    private Integer sessionId;

    @Column(name = "semester_id")
    private Integer semesterId;

    @Column(name = "section_id")
    private Integer sectionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", insertable = false, updatable = false)
    private Subject subject;
}
