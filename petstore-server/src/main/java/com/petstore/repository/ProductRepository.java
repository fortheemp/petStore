package com.petstore.repository;

import com.petstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByShopId(Long shopId);
    List<Product> findByType(Product.ProductType type);
    List<Product> findByNameContaining(String keyword);
}