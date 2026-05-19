package com.cinema.vncinema.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record ChangePasswordRequest(
    @NotBlank(message = "Current password is required")
    String oldPassword,

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "INVALID_PASSWORD")
    String newPassword,

    @NotBlank(message = "Confirm password is required")
    String confirmPassword
) {}
