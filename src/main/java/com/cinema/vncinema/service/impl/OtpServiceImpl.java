package com.cinema.vncinema.service.impl;

import com.cinema.vncinema.exception.AppException;
import com.cinema.vncinema.exception.ErrorCode;
import com.cinema.vncinema.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {

    private final StringRedisTemplate redisTemplate;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final String OTP_CODE_KEY_PREFIX = "otp:code:";
    private static final String OTP_VERIFIED_KEY_PREFIX = "otp:verified:";
    private static final long OTP_CODE_TTL_MINUTES = 5;
    private static final long OTP_VERIFIED_TTL_MINUTES = 10;

    @Override
    public void sendOtp(String email) {
        // Generate a 6-digit OTP code (e.g. 100000 to 999999)
        int code = 100000 + secureRandom.nextInt(900000);
        String otpCode = String.valueOf(code);

        String redisKey = OTP_CODE_KEY_PREFIX + email;
        redisTemplate.opsForValue().set(redisKey, otpCode, OTP_CODE_TTL_MINUTES, TimeUnit.MINUTES);

        // Print prominently to log and console for easy retrieval in development
        log.info("==================================================");
        log.info(" OTP FOR REGISTRATION: {} ", email);
        log.info(" OTP CODE: {} (Valid for 5 minutes) ", otpCode);
        log.info("==================================================");

        System.out.println("\n\n==================================================");
        System.out.println("   [VN-CINEMA REGISTRATION OTP]                   ");
        System.out.println("   Email: " + email);
        System.out.println("   OTP Code: " + otpCode);
        System.out.println("   (Valid for 5 minutes)                          ");
        System.out.println("==================================================\n\n");
    }

    @Override
    public boolean verifyOtp(String email, String otpCode) {
        String redisKey = OTP_CODE_KEY_PREFIX + email;
        String savedOtp = redisTemplate.opsForValue().get(redisKey);

        if (savedOtp == null || !savedOtp.equals(otpCode)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        // OTP is valid, remove the code and mark the email as verified
        redisTemplate.delete(redisKey);

        String verifiedKey = OTP_VERIFIED_KEY_PREFIX + email;
        redisTemplate.opsForValue().set(verifiedKey, "true", OTP_VERIFIED_TTL_MINUTES, TimeUnit.MINUTES);
        return true;
    }

    @Override
    public boolean isEmailVerified(String email) {
        String verifiedKey = OTP_VERIFIED_KEY_PREFIX + email;
        String isVerified = redisTemplate.opsForValue().get(verifiedKey);
        return "true".equals(isVerified);
    }

    @Override
    public void clearVerificationState(String email) {
        String verifiedKey = OTP_VERIFIED_KEY_PREFIX + email;
        redisTemplate.delete(verifiedKey);
    }
}
