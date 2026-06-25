package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.dto.LoginDTO;
import com.petstore.dto.RegisterDTO;
import com.petstore.entity.User;
import com.petstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result register(@RequestBody RegisterDTO dto) {
        User user = userService.register(dto);
        return Result.success(user);
    }

    @PostMapping("/login")
    public Result login(@RequestBody LoginDTO dto) {
        User user = userService.login(dto);
        return Result.success(user);
    }

    @GetMapping("/profile/{id}")
    public Result profile(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @PutMapping("/profile")
    public Result updateProfile(@RequestBody User user) {
        userService.update(user);
        return Result.success();
    }
}