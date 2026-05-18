package com.cinema.vncinema.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = args.length > 0 ? args[0] : "admin123";
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println("==================================================");
        System.out.println("Raw Password: " + rawPassword);
        System.out.println("BCrypt Hash: " + hashedPassword);
        System.out.println("==================================================");
    }
}
