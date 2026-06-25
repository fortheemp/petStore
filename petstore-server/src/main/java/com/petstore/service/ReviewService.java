package com.petstore.service;

import com.petstore.entity.Review;
import com.petstore.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(Long orderId, Long userId, String content, Integer rating) {
        Review review = new Review();
        review.setOrderId(orderId);
        review.setUserId(userId);
        review.setContent(content);
        review.setRating(rating);
        return reviewRepository.save(review);
    }

    public List<Review> getByOrderId(Long orderId) {
        return reviewRepository.findByOrderId(orderId);
    }

    public List<Review> getByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
}