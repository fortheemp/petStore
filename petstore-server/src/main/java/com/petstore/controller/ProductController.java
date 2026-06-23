package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public Result list(@RequestParam(required = false) Long shopId,
                       @RequestParam(required = false) String type,
                       @RequestParam(required = false) String keyword) {
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
        return Result.success(productService.listAll());
    }

    @GetMapping("/{id}")
    public Result detail(@PathVariable Long id) {
        return Result.success(productService.getById(id));
    }
}