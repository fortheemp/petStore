package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping
    public Result getNearbyShops(@RequestParam(required = false) Double lat,
                                  @RequestParam(required = false) Double lng) {
        return Result.success(shopService.getNearbyShops(lat, lng));
    }

    @GetMapping("/{id}")
    public Result getDetail(@PathVariable Long id) {
        return Result.success(shopService.getById(id));
    }
}