package com.cinema.vncinema.repository;

import com.cinema.vncinema.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByTmdbGenreId(Integer tmdbGenreId);
    boolean existsByTmdbGenreId(Integer tmdbGenreId);
}
