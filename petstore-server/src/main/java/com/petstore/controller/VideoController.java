package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping
    public Result list() {
        return Result.success(videoService.listAllWithProducts());
    }

    @GetMapping("/{id}")
    public Result detail(@PathVariable Long id) {
        return Result.success(videoService.getByIdWithProduct(id));
    }
}