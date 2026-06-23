package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.dto.OrderCreateDTO;
import com.petstore.entity.Order;
import com.petstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Result create(@RequestBody OrderCreateDTO dto,
                         @RequestParam Long userId) {
        Order order = orderService.createOrder(userId, dto.getAddressId(), dto.getCartItemIds());
        return Result.success(order);
    }

    @GetMapping
    public Result list(@RequestParam Long userId) {
        return Result.success(orderService.getByUserId(userId));
    }

    @GetMapping("/{id}")
    public Result detail(@PathVariable Long id) {
        Order order = orderService.getById(id);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("order", order);
        result.put("items", orderService.getOrderItems(id));
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
        String content = (String) body.get("content");
        Integer rating = Integer.valueOf(body.get("rating").toString());
        orderService.review(id, userId, content, rating);
        return Result.success("评价成功");
    }
}