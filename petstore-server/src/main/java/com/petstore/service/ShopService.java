package com.petstore.service;

import com.petstore.entity.Shop;
import com.petstore.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    public List<Shop> getNearbyShops(Double lat, Double lng) {
        if (lat == null || lng == null) {
            return shopRepository.findAll();
        }
        return shopRepository.findNearbyShops(lat, lng);
    }

    public Shop getById(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("商店不存在"));
    }

    public Shop addShop(String name, String address, Double lng, Double lat, String image) {
        Shop shop = new Shop();
        shop.setName(name);
        shop.setAddress(address);
        shop.setLongitude(lng);
        shop.setLatitude(lat);
        shop.setImage(image);
        return shopRepository.save(shop);
    }

    public Shop updateShop(Long id, String name, String address, Double lng, Double lat, String image) {
        Shop shop = getById(id);
        if (name != null) shop.setName(name);
        if (address != null) shop.setAddress(address);
        if (lng != null) shop.setLongitude(lng);
        if (lat != null) shop.setLatitude(lat);
        if (image != null) shop.setImage(image);
        return shopRepository.save(shop);
    }

    public void delete(Long id) {
        shopRepository.deleteById(id);
    }

    public List<Shop> listAll() {
        return shopRepository.findAll();
    }
}