package com.college.erp.attendance.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class SendNotificationRequest {

    @NotNull(message = "Sender ID is required")
    private Integer senderId;

    @NotBlank(message = "Recipient type is required")
    private String recipientType; // STUDENT, ALL_STUDENTS, SECTION, SEMESTER

    private Integer recipientId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    private String notificationType; // ATTENDANCE_ALERT, PERFORMANCE_ALERT, GENERAL, URGENT

    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
}