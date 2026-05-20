package com.cinema.vncinema.controller.admin;

import com.cinema.vncinema.constant.GenreMessages;
import com.cinema.vncinema.dto.response.ApiResponse;
import com.cinema.vncinema.dto.response.GenreResponse;
import com.cinema.vncinema.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/genres")
@RequiredArgsConstructor
public class GenreAdminController {

    private final GenreService genreService;

    @GetMapping
    public ApiResponse<List<GenreResponse>> getAllGenres() {
        return ApiResponse.success(GenreMessages.GET_GENRES_SUCCESS, genreService.getAllGenres());
    }
}
