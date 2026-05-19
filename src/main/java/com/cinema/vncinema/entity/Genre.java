package com.cinema.vncinema.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "genres")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Genre extends BaseEntity {

    @Column(name = "tmdb_genre_id", unique = true)
    private Integer tmdbGenreId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;
}
