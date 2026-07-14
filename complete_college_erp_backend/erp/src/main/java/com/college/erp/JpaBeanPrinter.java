package com.college.erp;



import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class JpaBeanPrinter implements ApplicationRunner {

    private final ApplicationContext context;

    public JpaBeanPrinter(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public void run(ApplicationArguments args) {
        System.out.println("\n======= ENTITY MANAGER FACTORIES =======");
        Arrays.stream(context.getBeanDefinitionNames())
                .filter(name -> name.contains("EntityManagerFactory"))
                .sorted()
                .forEach(System.out::println);

        System.out.println("\n======= TRANSACTION MANAGERS =======");
        Arrays.stream(context.getBeanDefinitionNames())
                .filter(name -> name.contains("TransactionManager"))
                .sorted()
                .forEach(System.out::println);
    }
}
