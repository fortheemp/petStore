package com.petstore.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
        "/",
        "/products",
        "/products/**",
        "/cart",
        "/checkout",
        "/orders",
        "/orders/**",
        "/user/**",
        "/admin/**",
        "/login",
        "/register",
        "/nearby-shops",
        "/videos",
        "/favorites"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
