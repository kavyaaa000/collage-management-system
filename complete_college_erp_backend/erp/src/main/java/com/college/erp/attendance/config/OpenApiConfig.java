package com.college.erp.attendance.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Attendance & Performance Analytics API")
                        .version("1.0.0")
                        .description("Anna University ERP - Smart Attendance and Performance Tracking System")
                        .contact(new Contact()
                                .name("Anna University IT Team")
                                .email("it@annauniv.edu")));
    }
}