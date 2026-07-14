package com.college.erp.erp.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}