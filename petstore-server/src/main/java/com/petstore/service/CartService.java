package com.petstore.service;

import com.petstore.entity.CartItem;
import com.petstore.entity.Product;
import com.petstore.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductService productService;

    public List<CartItem> getByUserId(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        Product product = productService.getById(productId);
        CartItem exist = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (exist != null) {
            exist.setQuantity(exist.getQuantity() + (quantity != null ? quantity : 1));
            return cartItemRepository.save(exist);
        }
        CartItem item = new CartItem();
        item.setUserId(userId);
        item.setProductId(productId);
        item.setQuantity(quantity != null ? quantity : 1);
        return cartItemRepository.save(item);
    }

    public CartItem updateQuantity(Long id, Integer quantity) {
        CartItem item = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("购物车项不存在"));
        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeFromCart(Long id) {
        cartItemRepository.deleteById(id);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    public int getCartCount(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        return items.stream().mapToInt(CartItem::getQuantity).sum();
    }
}