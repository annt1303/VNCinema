package com.cinema.vncinema.service;

import com.cinema.vncinema.dto.response.TmdbMovieDetailResponse;
import com.cinema.vncinema.dto.response.TmdbSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class TmdbClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${tmdb.api.token}")
    private String apiToken;

    @Value("${tmdb.api.base-url}")
    private String baseUrl;

    private HttpEntity<String> getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiToken);
        return new HttpEntity<>(headers);
    }

    public TmdbSearchResponse searchMovies(String query, int page) {
        String url = baseUrl + "/search/movie?query=" + query + "&language=vi-VN&page=" + page;
        ResponseEntity<TmdbSearchResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, getHeaders(), TmdbSearchResponse.class);
        return response.getBody();
    }

    public TmdbSearchResponse getNowPlayingMovies(int page) {
        String url = baseUrl + "/movie/now_playing?language=vi-VN&page=" + page + "&region=VN";
        ResponseEntity<TmdbSearchResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, getHeaders(), TmdbSearchResponse.class);
        return response.getBody();
    }

    public TmdbSearchResponse getUpcomingMovies(int page) {
        String url = baseUrl + "/movie/upcoming?language=vi-VN&page=" + page + "&region=VN";
        ResponseEntity<TmdbSearchResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, getHeaders(), TmdbSearchResponse.class);
        return response.getBody();
    }

    public TmdbMovieDetailResponse getMovieDetails(Long tmdbId) {
        String url = baseUrl + "/movie/" + tmdbId + "?language=vi-VN&append_to_response=videos,credits";
        ResponseEntity<TmdbMovieDetailResponse> response = restTemplate.exchange(
            url, HttpMethod.GET, getHeaders(), TmdbMovieDetailResponse.class);
        return response.getBody();
    }
}
