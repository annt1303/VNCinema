package com.cinema.vncinema.mapper;

import com.cinema.vncinema.entity.Genre;
import com.cinema.vncinema.entity.Movie;
import com.cinema.vncinema.dto.response.GenreResponse;
import com.cinema.vncinema.dto.response.MovieResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    @org.mapstruct.Mapping(target = "cast", expression = "java(mapCastToList(movie.getCast()))")
    MovieResponse toMovieResponse(Movie movie);
    GenreResponse toGenreResponse(Genre genre);

    default java.util.List<String> mapCastToList(String cast) {
        if (cast == null || cast.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return java.util.Arrays.asList(cast.split(",\\s*"));
    }
}
