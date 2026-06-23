package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.entity.CartItem;
import com.petstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public Result list(@RequestParam Long userId) {
        return Result.success(cartService.getByUserId(userId));
    }

    @PostMapping
    public Result add(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Long productId = Long.valueOf(body.get("productId").toString());
        Integer quantity = body.containsKey("quantity") ?
                Integer.valueOf(body.get("quantity").toString()) : 1;
        CartItem item = cartService.addToCart(userId, productId, quantity);
        return Result.success(item);
    }

    @PutMapping("/{id}")
    public Result updateQuantity(@PathVariable Long id,
                                  @RequestBody Map<String, Object> body) {
        Integer quantity = Integer.valueOf(body.get("quantity").toString());
        CartItem item = cartService.updateQuantity(id, quantity);
        return Result.success(item);
    }

    @DeleteMapping("/{id}")
    public Result remove(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return Result.success();
    }

    @DeleteMapping("/clear")
    public Result clear(@RequestParam Long userId) {
        cartService.clearCart(userId);
        return Result.success();
    }
}