package com.cinema.vncinema.dto.response;

import com.cinema.vncinema.entity.RoomType;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ScreenRoomResponse(
    Long id,
    String name,
    Long cinemaId,
    String cinemaName,
    RoomType roomType,
    Integer totalSeats,
    Boolean isActive,
    List<SeatResponse> seats,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
