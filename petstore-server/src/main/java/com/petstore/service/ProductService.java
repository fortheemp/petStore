package com.petstore.service;

import com.petstore.entity.Product;
import com.petstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getByShopId(Long shopId) {
        return productRepository.findByShopId(shopId);
    }

    public List<Product> getByType(Product.ProductType type) {
        return productRepository.findByType(type);
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("商品不存在"));
    }

    public Product addProduct(Long shopId, String name, String type, Integer stock,
                              String price, String image, Long videoId, String description) {
        Product product = new Product();
        product.setShopId(shopId);
        product.setName(name);
        product.setType(Product.ProductType.valueOf(type));
        product.setStock(stock != null ? stock : 0);
        product.setPrice(price);
        product.setImage(image);
        product.setVideoId(videoId);
        product.setDescription(description);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, String name, String type, Integer stock,
                                 String price, String image, Long videoId, String description) {
        Product product = getById(id);
        if (name != null) product.setName(name);
        if (type != null) product.setType(Product.ProductType.valueOf(type));
        if (stock != null) product.setStock(stock);
        if (price != null) product.setPrice(price);
        if (image != null) product.setImage(image);
        if (videoId != null) product.setVideoId(videoId);
        if (description != null) product.setDescription(description);
        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> listAll() {
        return productRepository.findAll();
    }

    public List<Product> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.findByNameContaining(keyword);
    }

    public void reduceStock(Long productId, int quantity) {
        Product product = getById(productId);
        if (product.getStock() < quantity) {
            throw new RuntimeException("商品 [" + product.getName() + "] 库存不足");
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }

    public void increaseStock(Long productId, int quantity) {
        Product product = getById(productId);
        product.setStock(product.getStock() + quantity);
        productRepository.save(product);
    }
}