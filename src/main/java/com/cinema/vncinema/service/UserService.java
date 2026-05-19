package com.cinema.vncinema.service;

import com.cinema.vncinema.dto.request.ChangePasswordRequest;
import com.cinema.vncinema.dto.request.UpdateProfileRequest;
import com.cinema.vncinema.dto.response.UpdateProfileResponse;

public interface UserService {
    UpdateProfileResponse updateProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
}
