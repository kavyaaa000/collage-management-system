package com.college.erp.attendance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.college.erp.attendance.repository",
        entityManagerFactoryRef = "attendanceEntityManagerFactory",
        transactionManagerRef = "attendanceTransactionManager"
)
public class AttendanceJpaConfig {}