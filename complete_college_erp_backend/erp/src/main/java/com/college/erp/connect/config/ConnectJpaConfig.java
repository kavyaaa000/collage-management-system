package com.college.erp.connect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.college.erp.connect.repository",
        entityManagerFactoryRef = "connectEntityManagerFactory",
        transactionManagerRef = "connectTransactionManager"
)
public class ConnectJpaConfig {}
