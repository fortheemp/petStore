package com.petstore.repository;

import com.petstore.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
    Address findByUserIdAndIsDefault(Long userId, Integer isDefault);

    @Modifying
    @Transactional
    @Query("UPDATE Address a SET a.isDefault = 0 WHERE a.userId = :userId")
    void clearDefaultByUserId(@Param("userId") Long userId);
}