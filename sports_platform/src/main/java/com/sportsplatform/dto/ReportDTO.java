package com.sportsplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDTO {
    private Long id;
    private Long reporterId;
    private String reporterUsername;
    private Long reportedUserId;
    private String reportedUsername;
    private Long postId;
    private String postCaption;
    private Long commentId;
    private String reason;
    private String status;
    private LocalDateTime createdAt;
}
