package com.cinema.vncinema.controller.public_;

import com.cinema.vncinema.constant.AuthMessages;
import com.cinema.vncinema.dto.request.ChangePasswordRequest;
import com.cinema.vncinema.dto.request.UpdateProfileRequest;
import com.cinema.vncinema.dto.response.ApiResponse;
import com.cinema.vncinema.dto.response.UpdateProfileResponse;
import com.cinema.vncinema.exception.AppException;
import com.cinema.vncinema.exception.ErrorCode;
import com.cinema.vncinema.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ApiResponse<UpdateProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            HttpServletResponse response
    ) {
        String email = getAuthenticatedEmail();
        UpdateProfileResponse updated = userService.updateProfile(email, request);
        
        if (updated.refreshToken() != null) {
            setRefreshTokenCookie(response, updated.refreshToken());
        }
        
        return ApiResponse.success(AuthMessages.UPDATE_PROFILE_SUCCESS, updated);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days in seconds
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PutMapping("/change-password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        String email = getAuthenticatedEmail();
        userService.changePassword(email, request);
        return ApiResponse.success(AuthMessages.CHANGE_PASSWORD_SUCCESS);
    }

    private String getAuthenticatedEmail() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (email == null || "anonymousUser".equals(email)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return email;
    }
}
