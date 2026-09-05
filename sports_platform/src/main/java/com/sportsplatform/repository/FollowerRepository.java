package com.sportsplatform.repository;

import com.sportsplatform.model.Follower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowerRepository extends JpaRepository<Follower, Long> {
    Optional<Follower> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    long countByFollowerId(Long followerId);
    long countByFollowingId(Long followingId);
    List<Follower> findByFollowingId(Long followingId);
    List<Follower> findByFollowerId(Long followerId);
    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
}
