package com.petstore.controller;

import com.petstore.common.Result;
import com.petstore.entity.*;
import com.petstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * 数据库种子数据初始化接口
 * 访问 GET /api/seed 即可初始化演示数据
 */
@RestController
@RequestMapping("/api/seed")
public class SeedController {

    @Autowired private UserRepository userRepository;
    @Autowired private ShopRepository shopRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private VideoRepository videoRepository;
    @Autowired private AddressRepository addressRepository;

    @GetMapping
    public Result seed() {
        // 如果已有数据则跳过
        if (userRepository.count() > 0) {
            return Result.success("数据库已有数据，跳过初始化");
        }

        // 1. 创建用户
        User admin = createUser("admin", "admin123", "管理员", User.Role.admin);
        User member = createUser("user1", "123456", "小明", User.Role.member);
        User tourist = createUser("tourist", "123456", "游客", User.Role.tourist);

        // 2. 创建视频
        Video video1 = new Video(); video1.setTitle("可爱的小猫咪"); video1.setUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        Video video2 = new Video(); video2.setTitle("金毛犬日常"); video2.setUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        Video video3 = new Video(); video3.setTitle("宠物用品介绍"); video3.setUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        video1 = videoRepository.save(video1);
        video2 = videoRepository.save(video2);
        video3 = videoRepository.save(video3);

        // 3. 创建商店
        Shop shop1 = createShop("快乐宠物店", "北京市朝阳区建国路88号", 116.46, 39.92, "/uploads/images/petshop1.jpg");
        Shop shop2 = createShop("萌宠之家", "北京市海淀区中关村大街1号", 116.32, 39.98, "/uploads/images/petshop2.jpg");
        Shop shop3 = createShop("宠物乐园", "上海市浦东新区陆家嘴环路100号", 121.50, 31.24, "/uploads/images/petshop3.jpg");

        // 4. 创建商品
        // 宠物类
        createProduct(shop1.getId(), "英短蓝猫", "pet", 5, "2800.00", video1.getId(), "纯种英短蓝猫，3个月大，已打疫苗");
        createProduct(shop1.getId(), "布偶猫", "pet", 3, "4500.00", video1.getId(), "海双布偶猫，性格温顺，适合家庭饲养");
        createProduct(shop1.getId(), "金毛幼犬", "pet", 4, "3200.00", video2.getId(), "纯种金毛幼犬，2个月，血统纯正");
        createProduct(shop2.getId(), "泰迪犬", "pet", 6, "1800.00", video2.getId(), "玩具泰迪，不掉毛，适合公寓饲养");
        createProduct(shop2.getId(), "柯基犬", "pet", 2, "5000.00", null, "彭布罗克威尔士柯基，3个月大");
        createProduct(shop3.getId(), "暹罗猫", "pet", 3, "3500.00", video1.getId(), "暹罗猫幼崽，蓝眼睛，活泼好动");
        createProduct(shop3.getId(), "哈士奇", "pet", 2, "2800.00", video2.getId(), "西伯利亚雪橇犬，2个月，三把火");

        // 用品类
        createProduct(shop1.getId(), "皇家猫粮 2kg", "accessory", 100, "158.00", null, "法国皇家猫粮，适合成年猫");
        createProduct(shop1.getId(), "智能饮水机", "accessory", 50, "199.00", null, "循环过滤，静音设计");
        createProduct(shop2.getId(), "狗粮 5kg", "accessory", 80, "238.00", null, "天然粮，添加益生菌");
        createProduct(shop2.getId(), "猫砂 10L", "accessory", 200, "39.90", null, "豆腐猫砂，结团快，可冲厕所");
        createProduct(shop3.getId(), "宠物牵引绳", "accessory", 150, "49.90", null, "反光设计，夜间安全");
        createProduct(shop3.getId(), "猫爬架", "accessory", 30, "299.00", null, "多层猫爬架，含剑麻柱");

        // 5. 创建收货地址
        Address addr1 = new Address(); addr1.setUserId(member.getId()); addr1.setReceiverName("小明");
        addr1.setPhone("13800138000"); addr1.setProvince("北京市"); addr1.setCity("北京市");
        addr1.setDistrict("朝阳区"); addr1.setDetail("建国路88号"); addr1.setIsDefault(1);
        addressRepository.save(addr1);

        Address addr2 = new Address(); addr2.setUserId(member.getId()); addr2.setReceiverName("小明");
        addr2.setPhone("13900139000"); addr2.setProvince("上海市"); addr2.setCity("上海市");
        addr2.setDistrict("浦东新区"); addr2.setDetail("张江高科技园区"); addr2.setIsDefault(0);
        addressRepository.save(addr2);

        return Result.success("种子数据初始化完成！\n用户：admin/admin123(管理员), user1/123456(会员), tourist/123456(游客)\n" +
                "商店：3个 | 商品：13个 | 视频：3个");
    }

    private User createUser(String username, String password, String nickname, User.Role role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setNickname(nickname);
        user.setRole(role);
        return userRepository.save(user);
    }

    private Shop createShop(String name, String address, Double lng, Double lat, String image) {
        Shop shop = new Shop();
        shop.setName(name);
        shop.setAddress(address);
        shop.setLongitude(lng);
        shop.setLatitude(lat);
        shop.setImage(image);
        return shopRepository.save(shop);
    }

    private Product createProduct(Long shopId, String name, String type, int stock, String price, Long videoId, String description) {
        Product product = new Product();
        product.setShopId(shopId);
        product.setName(name);
        product.setType(Product.ProductType.valueOf(type));
        product.setStock(stock);
        product.setPrice(price);
        product.setVideoId(videoId);
        product.setDescription(description);
        return productRepository.save(product);
    }
}