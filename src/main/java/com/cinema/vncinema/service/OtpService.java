package com.cinema.vncinema.service;

public interface OtpService {
    void sendOtp(String email);
    boolean verifyOtp(String email, String otpCode);
    boolean isEmailVerified(String email);
    void clearVerificationState(String email);
}
