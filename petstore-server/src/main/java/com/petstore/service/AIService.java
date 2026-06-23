package com.petstore.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIService {

    @Value("${ai.api-key}")
    private String apiKey;

    @Value("${ai.endpoint}")
    private String endpoint;

    @Value("${ai.model:gpt-3.5-turbo}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String chat(String question) {
        if (apiKey == null || apiKey.equals("your-api-key-here")) {
            return "AI服务尚未配置API Key，请联系管理员。\n\n您可以问我关于宠物的任何问题，我会尽力帮助您！\n\n提示：请在 application.yml 中配置 ai.api-key 和 ai.endpoint。";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            ObjectNode body = objectMapper.createObjectNode();
            body.put("model", model);

            ArrayNode messages = objectMapper.createArrayNode();
            ObjectNode systemMsg = objectMapper.createObjectNode();
            systemMsg.put("role", "system");
            systemMsg.put("content", "你是一个宠物商店的智能助手，可以帮助用户解答关于宠物选购、宠物护理、宠物用品等方面的问题。请用中文回答，保持友好和专业的语气。");
            messages.add(systemMsg);

            ObjectNode userMsg = objectMapper.createObjectNode();
            userMsg.put("role", "user");
            userMsg.put("content", question);
            messages.add(userMsg);

            body.set("messages", messages);

            HttpEntity<String> entity = new HttpEntity<>(body.toString(), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

            JsonNode json = objectMapper.readTree(response.getBody());
            return json.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            return "AI服务调用失败：" + e.getMessage() + "\n\n作为宠物商店助手，我建议您：\n1. 选择适合自己生活方式的宠物\n2. 提前准备好宠物所需的基本用品\n3. 定期带宠物进行健康检查";
        }
    }
}