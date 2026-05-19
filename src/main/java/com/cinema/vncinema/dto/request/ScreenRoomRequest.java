package com.cinema.vncinema.dto.request;

import com.cinema.vncinema.entity.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.util.List;

@Builder
public record ScreenRoomRequest(
    @NotBlank(message = "Room name is required")
    String name,

    @NotNull(message = "Cinema ID is required")
    Long cinemaId,

    @NotNull(message = "Room type is required")
    RoomType roomType,

    List<SeatLayoutRequest> seats
) {}
