package com.cinema.vncinema.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;

@Builder
public record UpdateProfileResponse(
    UserResponse user,
    String accessToken,

    @JsonIgnore
    String refreshToken
) {}
