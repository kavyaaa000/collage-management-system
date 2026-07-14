package com.college.erp.connect.entity;

public enum PurchaseStatus {
    PENDING,      // Awaiting approval (if required)
    APPROVED,     // Approved, ready to use/collect
    REJECTED,     // Rejected by admin
    COMPLETED,    // Item delivered/used
    USED          // Power-up/privilege consumed
}