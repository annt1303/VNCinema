package com.cinema.vncinema.controller.admin;

import com.cinema.vncinema.constant.MovieMessages;
import com.cinema.vncinema.dto.response.ApiResponse;
import com.cinema.vncinema.dto.response.MovieResponse;
import com.cinema.vncinema.dto.response.TmdbSearchResponse;
import com.cinema.vncinema.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/movies")
@RequiredArgsConstructor
public class MovieAdminController {

    private final MovieService movieService;

    @GetMapping
    public ApiResponse<List<MovieResponse>> getAllMovies() {
        return ApiResponse.success(MovieMessages.GET_MOVIES_SUCCESS, movieService.getAllMovies());
    }

    @GetMapping("/tmdb/search")
    public ApiResponse<TmdbSearchResponse> searchTmdbMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        return ApiResponse.success(MovieMessages.SEARCH_TMDB_SUCCESS, movieService.searchTmdbMovies(query, page));
    }

    @GetMapping("/tmdb/now-playing")
    public ApiResponse<TmdbSearchResponse> getNowPlaying(
            @RequestParam(defaultValue = "1") int page) {
        return ApiResponse.success(MovieMessages.SEARCH_TMDB_SUCCESS, movieService.getNowPlayingFromTmdb(page));
    }

    @GetMapping("/tmdb/upcoming")
    public ApiResponse<TmdbSearchResponse> getUpcoming(
            @RequestParam(defaultValue = "1") int page) {
        return ApiResponse.success(MovieMessages.SEARCH_TMDB_SUCCESS, movieService.getUpcomingFromTmdb(page));
    }

    @PostMapping("/tmdb/import/{tmdbId}")
    public ApiResponse<MovieResponse> importMovieFromTmdb(@PathVariable Long tmdbId) {
        return ApiResponse.success(MovieMessages.IMPORT_MOVIE_SUCCESS, movieService.importMovieFromTmdb(tmdbId));
    }
}
