package com.cinema.vncinema.service.impl;

import com.cinema.vncinema.dto.request.LoginRequest;
import com.cinema.vncinema.dto.request.RegisterRequest;
import com.cinema.vncinema.dto.response.LoginResponse;
import com.cinema.vncinema.dto.response.UserResponse;
import com.cinema.vncinema.entity.Role;
import com.cinema.vncinema.entity.User;
import com.cinema.vncinema.exception.AppException;
import com.cinema.vncinema.exception.ErrorCode;
import com.cinema.vncinema.repository.UserRepository;
import com.cinema.vncinema.security.JwtTokenProvider;
import com.cinema.vncinema.service.AuthService;
import com.cinema.vncinema.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpService otpService;
    private final StringRedisTemplate redisTemplate;

    private static final String REFRESH_TOKEN_KEY_PREFIX = "refresh_token:";
    private static final long REFRESH_TOKEN_TTL_DAYS = 7;

    @Override
    public UserResponse register(RegisterRequest request) {
        // 1. Check if user already exists
        if (userRepository.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // 2. Verify email via OTP
        if (!otpService.isEmailVerified(request.email())) {
            throw new AppException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        // 3. Create and save new user
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phone(request.phone())
                .role(Role.USER)
                .status("ACTIVE")
                .build();

        User savedUser = userRepository.save(user);

        // 4. Clean up OTP verification status in Redis
        otpService.clearVerificationState(request.email());

        return mapToUserResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // 1. Retrieve user
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        // 2. Match password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        // 3. Check status
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 4. Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        // 5. Store refresh token in Redis
        String redisKey = REFRESH_TOKEN_KEY_PREFIX + user.getEmail();
        redisTemplate.opsForValue().set(redisKey, refreshToken, REFRESH_TOKEN_TTL_DAYS, TimeUnit.DAYS);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    public LoginResponse refresh(String refreshToken) {
        // 1. Validate token signature and expiration
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        // 2. Get email from token
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        // 3. Verify token matches stored token in Redis
        String redisKey = REFRESH_TOKEN_KEY_PREFIX + email;
        String storedToken = redisTemplate.opsForValue().get(redisKey);

        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        // 4. Get User details
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // 5. Generate new tokens
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        // 6. Save new Refresh Token in Redis (Rotate)
        redisTemplate.opsForValue().set(redisKey, newRefreshToken, REFRESH_TOKEN_TTL_DAYS, TimeUnit.DAYS);

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    public void logout(String email) {
        // Remove Refresh Token from Redis
        String redisKey = REFRESH_TOKEN_KEY_PREFIX + email;
        redisTemplate.delete(redisKey);
    }

    @Override
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
