package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long notificationId;
    private String senderName;
    private String title;
    private String message;
    private String notificationType;
    private String priority;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}