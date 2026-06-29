package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.service.ProductService;
import com.petstore.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public Result list(@RequestParam(required = false) Long shopId,
                       @RequestParam(required = false) String type,
                       @RequestParam(required = false) String keyword,
                       @RequestParam(required = false) String subcategory) {
        if (shopId != null) {
            return Result.success(productService.getByShopId(shopId));
        }
        if (type != null) {
            return Result.success(productService.getByType(
                    com.petstore.entity.Product.ProductType.valueOf(type)));
        }
        if (keyword != null && !keyword.isEmpty()) {
            return Result.success(productService.search(keyword));
        }
        if (subcategory != null && !subcategory.isEmpty()) {
            return Result.success(productService.getBySubcategory(subcategory));
        }
        return Result.success(productService.listAll());
    }

    @GetMapping("/{id}")
    public Result detail(@PathVariable Long id) {
        return Result.success(productService.getById(id));
    }

    @GetMapping("/{id}/reviews")
    public Result getProductReviews(@PathVariable Long id) {
        return Result.success(reviewService.getByProductId(id));
    }
}