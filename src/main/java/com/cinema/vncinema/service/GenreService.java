package com.cinema.vncinema.service;

import com.cinema.vncinema.dto.response.GenreResponse;
import java.util.List;

public interface GenreService {
    List<GenreResponse> getAllGenres();
}
