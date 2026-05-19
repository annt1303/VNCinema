package com.cinema.vncinema.dto.response;

import lombok.Builder;

@Builder
public record GenreResponse(
    Long id,
    Integer tmdbGenreId,
    String name
) {}
