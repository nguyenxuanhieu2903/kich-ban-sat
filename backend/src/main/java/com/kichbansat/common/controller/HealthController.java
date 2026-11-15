package com.kichbansat.common.controller;

import com.kichbansat.common.controller.dto.HealthResponse;
import com.kichbansat.common.response.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @Value("${app.name:Kịch Bản Sát API Service}")
    private String applicationName;

    @Value("${app.version:0.0.1-SNAPSHOT}")
    private String applicationVersion;

    @GetMapping
    public ResponseEntity<ApiResponse<HealthResponse>> checkHealth() {
        HealthResponse response = new HealthResponse(
                "UP",
                applicationName,
                applicationVersion,
                Instant.now()
        );
        return ResponseEntity.ok(ApiResponse.success("Hệ thống hoạt động bình thường", response));
    }
}
