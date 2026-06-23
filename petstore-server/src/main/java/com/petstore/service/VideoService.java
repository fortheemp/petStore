package com.petstore.service;

import com.petstore.entity.Video;
import com.petstore.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    public List<Video> listAll() {
        return videoRepository.findAll();
    }

    public Video getById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("视频不存在"));
    }

    public Video add(String title, String url, Long productId) {
        Video video = new Video();
        video.setTitle(title);
        video.setUrl(url);
        video.setProductId(productId);
        return videoRepository.save(video);
    }

    public Video update(Long id, String title, String url, Long productId) {
        Video video = getById(id);
        if (title != null) video.setTitle(title);
        if (url != null) video.setUrl(url);
        if (productId != null) video.setProductId(productId);
        return videoRepository.save(video);
    }

    public void delete(Long id) {
        videoRepository.deleteById(id);
    }

    public List<Video> getByProductId(Long productId) {
        return videoRepository.findByProductId(productId);
    }
}