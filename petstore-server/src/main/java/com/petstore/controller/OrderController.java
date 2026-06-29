package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.dto.OrderCreateDTO;
import com.petstore.entity.Order;
import com.petstore.service.OrderService;
import com.petstore.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Result create(@RequestBody OrderCreateDTO dto,
                         @RequestParam Long userId) {
        Order order = orderService.createOrder(userId, dto.getAddressId(), dto.getCartItemIds());
        return Result.success(order);
    }

    @GetMapping
    public Result list(@RequestParam Long userId) {
        List<Order> orders = orderService.getByUserId(userId);
        List<Map<String, Object>> enriched = orders.stream().map(o -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", o.getId());
            map.put("userId", o.getUserId());
            map.put("addressSnapshot", o.getAddressSnapshot());
            map.put("totalAmount", o.getTotalAmount());
            map.put("status", o.getStatus());
            map.put("cancelReason", o.getCancelReason());
            map.put("refundReason", o.getRefundReason());
            map.put("previousStatus", o.getPreviousStatus());
            map.put("createdAt", o.getCreatedAt());
            map.put("updatedAt", o.getUpdatedAt());
            map.put("reviewed", orderService.isOrderReviewed(o.getId()));
            return map;
        }).collect(Collectors.toList());
        return Result.success(enriched);
    }

    @GetMapping("/{id}")
    public Result detail(@PathVariable Long id) {
        Order order = orderService.getById(id);
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("order", order);
        result.put("items", orderService.getOrderItems(id));
        result.put("reviewed", orderService.isOrderReviewed(id));
        return Result.success(result);
    }

    @PostMapping("/{id}/pay")
    public Result pay(@PathVariable Long id) {
        orderService.payOrder(id);
        return Result.success("支付成功");
    }

    @PostMapping("/{id}/cancel")
    public Result cancel(@PathVariable Long id,
                         @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "");
        orderService.cancelOrder(id, reason, false);
        return Result.success("已取消");
    }

    @PostMapping("/{id}/confirm")
    public Result confirmReceipt(@PathVariable Long id) {
        orderService.confirmReceipt(id);
        return Result.success("已确认收货");
    }

    @PostMapping("/{id}/refund")
    public Result applyRefund(@PathVariable Long id,
                              @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "");
        orderService.applyRefund(id, reason);
        return Result.success("退单申请已提交");
    }

    @PostMapping("/{id}/review")
    public Result review(@PathVariable Long id,
                         @RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> reviews = (List<Map<String, Object>>) body.get("reviews");
        orderService.review(id, userId, reviews);
        return Result.success("评价成功");
    }

    @GetMapping("/{id}/reviews")
    public Result getOrderReviews(@PathVariable Long id) {
        return Result.success(reviewService.getByOrderId(id));
    }
}