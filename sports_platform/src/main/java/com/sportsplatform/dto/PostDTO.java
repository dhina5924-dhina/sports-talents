package com.sportsplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {
    private Long id;
    private Long userId;
    private String username;
    private String userFullName;
    private String userProfilePicture;
    private String caption;
    private String category;
    private String mediaUrl;
    private String mediaType; // IMAGE or VIDEO
    private Set<String> hashtags;
    private int likesCount;
    private int commentsCount;
    private boolean isLikedByCurrentUser;
    private LocalDateTime createdAt;
}
