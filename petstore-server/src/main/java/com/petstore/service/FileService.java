package com.petstore.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        return saveFile(file, "images");
    }

    public String uploadVideo(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        return saveFile(file, "videos");
    }

    private String saveFile(MultipartFile file, String subDir) {
        try {
            String originalFilename = file.getOriginalFilename();
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + ext;
            File destDir = new File(uploadDir + File.separator + subDir);
            if (!destDir.exists()) {
                destDir.mkdirs();
            }
            File dest = new File(destDir, newFileName);
            file.transferTo(dest);
            return "/uploads/" + subDir + "/" + newFileName;
        } catch (IOException e) {
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }
}