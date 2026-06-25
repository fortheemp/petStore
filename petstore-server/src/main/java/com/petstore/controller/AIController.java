package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public Result chat(@RequestBody Map<String, String> body) {
        String question = body.get("question");
        String answer = aiService.chat(question);
        return Result.success(answer);
    }
}