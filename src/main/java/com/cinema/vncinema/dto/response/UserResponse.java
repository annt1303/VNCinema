package com.cinema.vncinema.dto.response;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record UserResponse(
    Long id,
    String email,
    String fullName,
    String phone,
    String role,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
