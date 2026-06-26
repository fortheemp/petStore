package com.petstore.service;

import com.petstore.entity.Product;
import com.petstore.entity.Video;
import com.petstore.repository.ProductRepository;
import com.petstore.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Video> listAll() {
        return videoRepository.findAll();
    }

    public Video getById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("视频不存在"));
    }

    public Video add(String title, String url, Long productId) {
        return add(title, url, productId, null, null, null, null, null);
    }

    public Video add(String title, String url, Long productId,
                     String duration, Integer durationSeconds, String author,
                     String description, String category) {
        Video video = new Video();
        video.setTitle(title);
        video.setUrl(url);
        video.setProductId(productId);
        video.setDuration(duration);
        video.setDurationSeconds(durationSeconds);
        video.setAuthor(author);
        video.setDescription(description);
        video.setCategory(category);
        return videoRepository.save(video);
    }

    public Video update(Long id, String title, String url, Long productId,
                        String duration, Integer durationSeconds, String author,
                        String description, String category) {
        Video video = getById(id);
        if (title != null) video.setTitle(title);
        if (url != null) video.setUrl(url);
        if (productId != null) video.setProductId(productId);
        if (duration != null) video.setDuration(duration);
        if (durationSeconds != null) video.setDurationSeconds(durationSeconds);
        if (author != null) video.setAuthor(author);
        if (description != null) video.setDescription(description);
        if (category != null) video.setCategory(category);
        return videoRepository.save(video);
    }

    public Video update(Long id, String title, String url, Long productId) {
        return update(id, title, url, productId, null, null, null, null, null);
    }

    public void delete(Long id) {
        videoRepository.deleteById(id);
    }

    public List<Video> getByProductId(Long productId) {
        return videoRepository.findByProductId(productId);
    }

    public List<Map<String, Object>> listAllWithProducts() {
        List<Video> videos = videoRepository.findAll();
        return videos.stream().map(this::toMap).collect(Collectors.toList());
    }

    public Map<String, Object> getByIdWithProduct(Long id) {
        Video video = getById(id);
        return toMap(video);
    }

    private Map<String, Object> toMap(Video video) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", video.getId());
        map.put("title", video.getTitle());
        map.put("url", video.getUrl());
        map.put("productId", video.getProductId());
        map.put("duration", video.getDuration());
        map.put("durationSeconds", video.getDurationSeconds());
        map.put("viewCount", video.getViewCount());
        map.put("author", video.getAuthor());
        map.put("description", video.getDescription());
        map.put("category", video.getCategory());
        map.put("createdAt", video.getCreatedAt());
        if (video.getProductId() != null) {
            productRepository.findById(video.getProductId()).ifPresent(product -> {
                Map<String, Object> related = new LinkedHashMap<>();
                related.put("id", product.getId());
                related.put("name", product.getName());
                related.put("price", product.getPrice());
                related.put("image", product.getImage());
                map.put("relatedProduct", related);
            });
        }
        return map;
    }
}