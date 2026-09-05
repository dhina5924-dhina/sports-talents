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
public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String bio;
    private String profilePictureUrl;
    private String favoriteSport;
    private String role;
    private long totalPosts;
    private long totalLikesReceived;
    private long followersCount;
    private long followingCount;
    private boolean isFollowing;
    private LocalDateTime createdAt;
}
