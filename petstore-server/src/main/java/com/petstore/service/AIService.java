package com.petstore.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.petstore.entity.Product;
import com.petstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Value("${ai.api-key}")
    private String apiKey;

    @Value("${ai.endpoint}")
    private String endpoint;

    @Value("${ai.model:gpt-3.5-turbo}")
    private String model;

    @Autowired
    private ProductRepository productRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String chat(String question) {
        if (apiKey == null || apiKey.equals("your-api-key-here")) {
            return "AI服务尚未配置API Key，请联系管理员。";
        }

        try {
            List<Product> products = productRepository.findAll();
            String productList = products.stream()
                .map(p -> p.getId() + "." + p.getName() + " ¥" + p.getPrice())
                .collect(Collectors.joining("\n"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            ObjectNode body = objectMapper.createObjectNode();
            body.put("model", model);

            ArrayNode messages = objectMapper.createArrayNode();
            ObjectNode systemMsg = objectMapper.createObjectNode();
            systemMsg.put("role", "system");
            systemMsg.put("content", "你是宠物商店智能助手。回答要简短（2-3句话），语气友好，用中文。\n"
                + "如果用户的问题和商品相关，请在回复最后另起一行以【推荐:商品ID】格式推荐商品，例如【推荐:1,3】。\n"
                + "如果没有合适的商品推荐，不要写【推荐:】。\n\n"
                + "本店商品列表：\n" + productList);
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
            return "AI服务暂时不可用，请稍后再试。";
        }
    }
}