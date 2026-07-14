package com.college.erp.evaluation.util;

import com.college.erp.exception.ValidationException;

import java.math.BigDecimal;

public class ValidationUtil {

    public static void validateMarksRange(BigDecimal marks, BigDecimal maxMarks) {
        if (marks.compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("Marks cannot be negative");
        }
        if (marks.compareTo(maxMarks) > 0) {
            throw new ValidationException("Marks cannot exceed maximum marks");
        }
    }

    public static void validateAdjustmentPercent(BigDecimal adjustmentPercent, String remarks) {
        if (adjustmentPercent.abs().compareTo(BigDecimal.valueOf(10)) > 0) {
            if (remarks == null || remarks.trim().isEmpty()) {
                throw new ValidationException("Remarks are mandatory for adjustments beyond ±10%");
            }
        }
    }
}