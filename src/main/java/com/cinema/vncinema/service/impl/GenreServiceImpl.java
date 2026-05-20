package com.cinema.vncinema.service.impl;

import com.cinema.vncinema.dto.response.GenreResponse;
import com.cinema.vncinema.mapper.MovieMapper;
import com.cinema.vncinema.repository.GenreRepository;
import com.cinema.vncinema.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final MovieMapper movieMapper;

    @Override
    @Transactional(readOnly = true)
    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(movieMapper::toGenreResponse)
                .collect(Collectors.toList());
    }
}
