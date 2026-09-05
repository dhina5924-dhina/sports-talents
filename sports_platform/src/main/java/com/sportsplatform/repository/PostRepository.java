package com.sportsplatform.repository;

import com.sportsplatform.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Post> findByCategoryOrderByCreatedAtDesc(String category);

    @Query("SELECT p FROM Post p WHERE LOWER(p.caption) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY p.createdAt DESC")
    List<Post> searchPosts(@Param("query") String query);

    @Query("SELECT p FROM Post p JOIN p.hashtags h WHERE LOWER(h.name) = LOWER(:hashtag) ORDER BY p.createdAt DESC")
    List<Post> findByHashtag(@Param("hashtag") String hashtag);

    @Query("SELECT p FROM Post p ORDER BY (p.likesCount + p.commentsCount) DESC, p.createdAt DESC")
    List<Post> findTrendingPosts();
}
