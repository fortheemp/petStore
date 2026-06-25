package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/image")
    public Result uploadImage(@RequestParam("file") MultipartFile file) {
        String url = fileService.uploadImage(file);
        return Result.success(url);
    }

    @PostMapping("/video")
    public Result uploadVideo(@RequestParam("file") MultipartFile file) {
        String url = fileService.uploadVideo(file);
        return Result.success(url);
    }
}