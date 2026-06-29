package com.petstore.repository;

import com.petstore.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) " +
            "* cos(radians(longitude) - radians(:lng)) " +
            "+ sin(radians(:lat)) * sin(radians(latitude)))) AS distance " +
            "FROM shops ORDER BY distance", nativeQuery = true)
    List<Shop> findNearbyShops(@Param("lat") Double lat, @Param("lng") Double lng);

    List<Shop> findByAddressContaining(String district);
}