package de.testen.sodoku;

import org.springframework.boot.SpringApplication;

public class TestSodokuApplication {

    public static void main(String[] args) {
        SpringApplication.from(SodokuApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
