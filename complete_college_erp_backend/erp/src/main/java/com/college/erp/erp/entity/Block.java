package com.college.erp.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Block")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Block {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "block_id")
    private Integer blockId;

    @Column(name = "block_code", nullable = false, length = 10)
    private String blockCode;

    @Column(name = "block_name", length = 50)
    private String blockName;

    @Column(name = "college_id", nullable = false)
    private Integer collegeId;
}