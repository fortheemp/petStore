package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.entity.Shop;
import com.petstore.entity.Product;
import com.petstore.entity.Video;
import com.petstore.entity.User;
import com.petstore.entity.Order;
import com.petstore.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ShopService shopService;
    @Autowired
    private ProductService productService;
    @Autowired
    private VideoService videoService;
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private FileService fileService;

    // ============ 商店管理 ============

    @GetMapping("/shops")
    public Result listShops() {
        return Result.success(shopService.listAll());
    }

    @PostMapping("/shops")
    public Result addShop(@RequestParam("name") String name,
                          @RequestParam("address") String address,
                          @RequestParam("longitude") Double lng,
                          @RequestParam("latitude") Double lat,
                          @RequestParam(value = "image", required = false) MultipartFile image) {
        String imageUrl = fileService.uploadImage(image);
        Shop shop = shopService.addShop(name, address, lng, lat, imageUrl);
        return Result.success(shop);
    }

    @PutMapping("/shops/{id}")
    public Result updateShop(@PathVariable Long id,
                             @RequestParam("name") String name,
                             @RequestParam("address") String address,
                             @RequestParam("longitude") Double lng,
                             @RequestParam("latitude") Double lat,
                             @RequestParam(value = "image", required = false) MultipartFile image) {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileService.uploadImage(image);
        }
        Shop shop = shopService.updateShop(id, name, address, lng, lat, imageUrl);
        return Result.success(shop);
    }

    @DeleteMapping("/shops/{id}")
    public Result deleteShop(@PathVariable Long id) {
        shopService.delete(id);
        return Result.success();
    }

    // ============ 商品管理 ============

    @GetMapping("/products")
    public Result listProducts() {
        return Result.success(productService.listAll());
    }

    @PostMapping("/products")
    public Result addProduct(@RequestParam("shopId") Long shopId,
                             @RequestParam("name") String name,
                             @RequestParam("type") String type,
                             @RequestParam("stock") Integer stock,
                             @RequestParam("price") String price,
                             @RequestParam(value = "image", required = false) MultipartFile image,
                             @RequestParam(value = "videoId", required = false) Long videoId,
                             @RequestParam(value = "description", required = false) String description) {
        String imageUrl = fileService.uploadImage(image);
        Product product = productService.addProduct(shopId, name, type, stock, price, imageUrl, videoId, description);
        return Result.success(product);
    }

    @PutMapping("/products/{id}")
    public Result updateProduct(@PathVariable Long id,
                                @RequestParam(value = "shopId", required = false) Long shopId,
                                @RequestParam(value = "name", required = false) String name,
                                @RequestParam(value = "type", required = false) String type,
                                @RequestParam(value = "stock", required = false) Integer stock,
                                @RequestParam(value = "price", required = false) String price,
                                @RequestParam(value = "image", required = false) MultipartFile image,
                                @RequestParam(value = "videoId", required = false) Long videoId,
                                @RequestParam(value = "description", required = false) String description) {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileService.uploadImage(image);
        }
        Product product = productService.updateProduct(id, name, type, stock, price, imageUrl, videoId, description);
        return Result.success(product);
    }

    @DeleteMapping("/products/{id}")
    public Result deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return Result.success();
    }

    // ============ 视频管理 ============

    @GetMapping("/videos")
    public Result listVideos() {
        return Result.success(videoService.listAll());
    }

    @PostMapping("/videos")
    public Result addVideo(@RequestParam("title") String title,
                           @RequestParam(value = "file", required = false) MultipartFile file,
                           @RequestParam(value = "url", required = false) String url,
                           @RequestParam(value = "productId", required = false) Long productId) {
        String videoUrl = url;
        if (file != null && !file.isEmpty()) {
            videoUrl = fileService.uploadVideo(file);
        }
        Video video = videoService.add(title, videoUrl, productId);
        return Result.success(video);
    }

    @PutMapping("/videos/{id}")
    public Result updateVideo(@PathVariable Long id,
                              @RequestParam(value = "title", required = false) String title,
                              @RequestParam(value = "url", required = false) String url,
                              @RequestParam(value = "productId", required = false) Long productId) {
        Video video = videoService.update(id, title, url, productId);
        return Result.success(video);
    }

    @DeleteMapping("/videos/{id}")
    public Result deleteVideo(@PathVariable Long id) {
        videoService.delete(id);
        return Result.success();
    }

    // ============ 用户管理 ============

    @GetMapping("/users")
    public Result listUsers() {
        return Result.success(userService.listAll());
    }

    @DeleteMapping("/users/{id}")
    public Result deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }

    // ============ 订单管理 ============

    @GetMapping("/orders")
    public Result listOrders(@RequestParam(required = false) Integer status) {
        if (status != null) {
            return Result.success(orderService.getByStatus(status));
        }
        return Result.success(orderService.listAll());
    }

    @GetMapping("/orders/{id}")
    public Result orderDetail(@PathVariable Long id) {
        Order order = orderService.getById(id);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("order", order);
        result.put("items", orderService.getOrderItems(id));
        return Result.success(result);
    }

    @PostMapping("/orders/{id}/ship")
    public Result shipOrder(@PathVariable Long id) {
        orderService.shipOrder(id);
        return Result.success("已发货");
    }

    @PostMapping("/orders/{id}/approve-refund")
    public Result approveRefund(@PathVariable Long id,
                                 @RequestBody Map<String, Object> body) {
        boolean approved = Boolean.parseBoolean(body.get("approved").toString());
        orderService.approveRefund(id, approved);
        return Result.success(approved ? "退单已通过" : "退单已拒绝");
    }

    @PostMapping("/orders/{id}/direct-refund")
    public Result directRefund(@PathVariable Long id,
                                @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "");
        orderService.directRefund(id, reason);
        return Result.success("已退单");
    }
}