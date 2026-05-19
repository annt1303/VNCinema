package com.cinema.vncinema.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record TmdbMovieDetailResponse(
    Long id,
    String title,
    @JsonProperty("original_title") String originalTitle,
    String overview,
    Integer runtime,
    @JsonProperty("release_date") String releaseDate,
    @JsonProperty("poster_path") String posterPath,
    @JsonProperty("backdrop_path") String backdropPath,
    @JsonProperty("vote_average") Double voteAverage,
    List<TmdbGenre> genres,
    TmdbVideos videos,
    TmdbCredits credits
) {
    public record TmdbGenre(Integer id, String name) {}

    public record TmdbVideos(List<TmdbVideo> results) {}

    public record TmdbVideo(
        String site,
        String type,
        String key
    ) {}

    public record TmdbCredits(
        List<TmdbCast> cast,
        List<TmdbCrew> crew
    ) {}

    public record TmdbCast(
        String name,
        @JsonProperty("character") String character,
        @JsonProperty("order") Integer order
    ) {}

    public record TmdbCrew(
        String name,
        String job
    ) {}
}
