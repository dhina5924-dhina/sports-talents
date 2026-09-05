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
public class CommentDTO {
    private Long id;
    private Long postId;
    private Long userId;
    private String username;
    private String userFullName;
    private String userProfilePicture;
    private String content;
    private LocalDateTime createdAt;
    private boolean isOwnComment;
}
