package com.petstore.service;

import com.petstore.entity.Product;
import com.petstore.entity.Review;
import com.petstore.entity.User;
import com.petstore.repository.ProductRepository;
import com.petstore.repository.ReviewRepository;
import com.petstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Review addReview(Long orderId, Long userId, Long productId, String content, Integer rating) {
        Review review = new Review();
        review.setOrderId(orderId);
        review.setUserId(userId);
        review.setProductId(productId);
        review.setContent(content);
        review.setRating(rating);
        return reviewRepository.save(review);
    }

    public List<Map<String, Object>> getByOrderId(Long orderId) {
        List<Review> reviews = reviewRepository.findByOrderId(orderId);
        return enrichReviews(reviews);
    }

    public List<Map<String, Object>> getByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return enrichReviews(reviews);
    }

    public boolean existsByOrderId(Long orderId) {
        return reviewRepository.existsByOrderId(orderId);
    }

    /**
     * 为 Review 列表填充 username
     */
    private List<Map<String, Object>> enrichReviews(List<Review> reviews) {
        return reviews.stream().map(r -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", r.getId());
            map.put("orderId", r.getOrderId());
            map.put("productId", r.getProductId());
            map.put("userId", r.getUserId());
            map.put("content", r.getContent());
            map.put("rating", r.getRating());
            map.put("createdAt", r.getCreatedAt());
            // JOIN users 获取 username 和 avatar
            userRepository.findById(r.getUserId()).ifPresent(u -> {
                map.put("username", u.getNickname() != null ? u.getNickname() : u.getUsername());
                map.put("avatar", u.getAvatar());
            });
            return map;
        }).collect(Collectors.toList());
    }

    /**
     * 重新计算商品的 avg_rating 和 review_count，并回写 products 表
     */
    public void recalcProductRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        if (reviews.isEmpty()) return;
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        productRepository.findById(productId).ifPresent(p -> {
            p.setAvgRating(Math.round(avg * 10.0) / 10.0);
            p.setReviewCount(reviews.size());
            productRepository.save(p);
        });
    }
}