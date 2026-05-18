package com.cinema.vncinema.service;

import com.cinema.vncinema.dto.request.LoginRequest;
import com.cinema.vncinema.dto.request.RegisterRequest;
import com.cinema.vncinema.dto.response.LoginResponse;
import com.cinema.vncinema.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    LoginResponse refresh(String refreshToken);
    void logout(String email);
    UserResponse getProfile(String email);
}
