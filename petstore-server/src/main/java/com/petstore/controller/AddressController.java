package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.entity.Address;
import com.petstore.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping
    public Result list(@RequestParam Long userId) {
        return Result.success(addressService.getByUserId(userId));
    }

    @GetMapping("/{id}")
    public Result detail(@PathVariable Long id) {
        return Result.success(addressService.getById(id));
    }

    @PostMapping
    public Result add(@RequestBody Address address) {
        return Result.success(addressService.add(address));
    }

    @PutMapping("/{id}")
    public Result update(@PathVariable Long id, @RequestBody Address address) {
        address.setId(id);
        return Result.success(addressService.update(address));
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Long id) {
        addressService.delete(id);
        return Result.success();
    }

    @PostMapping("/{id}/default")
    public Result setDefault(@PathVariable Long id) {
        addressService.setDefault(id);
        return Result.success();
    }
}