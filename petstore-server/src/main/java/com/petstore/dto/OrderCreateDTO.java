package com.petstore.dto;

import java.util.List;

public class OrderCreateDTO {
    private Long addressId;
    private List<Long> cartItemIds;

    public OrderCreateDTO() {}

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public List<Long> getCartItemIds() { return cartItemIds; }
    public void setCartItemIds(List<Long> cartItemIds) { this.cartItemIds = cartItemIds; }
}