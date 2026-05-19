package com.cinema.vncinema.service.impl;

import com.cinema.vncinema.dto.request.ChangePasswordRequest;
import com.cinema.vncinema.dto.request.UpdateProfileRequest;
import com.cinema.vncinema.dto.response.UpdateProfileResponse;
import com.cinema.vncinema.dto.response.UserResponse;
import com.cinema.vncinema.entity.User;
import com.cinema.vncinema.exception.AppException;
import com.cinema.vncinema.exception.ErrorCode;
import com.cinema.vncinema.repository.UserRepository;
import com.cinema.vncinema.security.JwtTokenProvider;
import com.cinema.vncinema.service.OtpService;
import com.cinema.vncinema.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional
    public UpdateProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String oldEmail = user.getEmail();
        String newEmail = request.email().trim();
        boolean emailChanged = !oldEmail.equalsIgnoreCase(newEmail);

        if (emailChanged) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new AppException(ErrorCode.USER_EXISTED);
            }

            if (!otpService.isEmailVerified(newEmail)) {
                throw new AppException(ErrorCode.EMAIL_NOT_VERIFIED);
            }

            otpService.clearVerificationState(newEmail);

            user.setEmail(newEmail);
        }

        user.setFullName(request.fullName());
        if (request.phone() != null && !request.phone().isBlank()) {
            user.setPhone(request.phone());
        }

        User saved = userRepository.save(user);
        UserResponse userResponse = mapToUserResponse(saved);

        String newAccessToken = null;
        String newRefreshToken = null;

        if (emailChanged) {
            String oldRedisKey = "refresh_token:" + oldEmail;
            redisTemplate.delete(oldRedisKey);

            newAccessToken = jwtTokenProvider.generateAccessToken(newEmail, saved.getRole().name());
            newRefreshToken = jwtTokenProvider.generateRefreshToken(newEmail);

            String newRedisKey = "refresh_token:" + newEmail;
            redisTemplate.opsForValue().set(newRedisKey, newRefreshToken, 7, java.util.concurrent.TimeUnit.DAYS);
        }

        return UpdateProfileResponse.builder()
                .user(userResponse)
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Verify old password
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_OLD_PASSWORD);
        }

        // Ensure new password differs from old
        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.SAME_PASSWORD);
        }

        // Confirm passwords match
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new AppException(ErrorCode.INVALID_ARGUMENT);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
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
