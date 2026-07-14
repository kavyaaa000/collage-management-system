package com.college.erp.evaluation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.college.erp.evaluation.repository",
        entityManagerFactoryRef = "evaluationEntityManagerFactory",
        transactionManagerRef = "evaluationTransactionManager"
)
public class EvaluationJpaConfig {}
