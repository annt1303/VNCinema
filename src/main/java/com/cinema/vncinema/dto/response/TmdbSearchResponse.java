package com.cinema.vncinema.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record TmdbSearchResponse(
    int page,
    List<TmdbMovieResult> results,
    @JsonProperty("total_pages") int totalPages,
    @JsonProperty("total_results") int totalResults
) {
    public record TmdbMovieResult(
        Long id,
        String title,
        @JsonProperty("original_title") String originalTitle,
        @JsonProperty("release_date") String releaseDate,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("vote_average") Double voteAverage
    ) {}
}
