package com.sportsplatform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 2000)
    private String caption;

    @Column(nullable = false)
    private String category; // Cricket, Football, Basketball, Volleyball, Tennis, Badminton, Athletics, Other

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Media media;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "post_hashtags",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "hashtag_id")
    )
    @Builder.Default
    private Set<Hashtag> hashtags = new HashSet<>();

    @Builder.Default
    private int likesCount = 0;

    @Builder.Default
    private int commentsCount = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
