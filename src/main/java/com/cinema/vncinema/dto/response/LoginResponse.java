package com.cinema.vncinema.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;

@Builder
public record LoginResponse(
    String accessToken,
    UserResponse user,

    @JsonIgnore
    String refreshToken
) {}
