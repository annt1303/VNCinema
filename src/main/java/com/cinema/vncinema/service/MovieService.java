package com.cinema.vncinema.service;

import com.cinema.vncinema.dto.response.MovieResponse;
import com.cinema.vncinema.dto.response.TmdbSearchResponse;

import java.util.List;

public interface MovieService {
    TmdbSearchResponse searchTmdbMovies(String query, int page);
    TmdbSearchResponse getNowPlayingFromTmdb(int page);
    TmdbSearchResponse getUpcomingFromTmdb(int page);
    MovieResponse importMovieFromTmdb(Long tmdbId);
    List<MovieResponse> getAllMovies();
}
