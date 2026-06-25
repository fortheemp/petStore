package com.petstore.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.entity.*;
import com.petstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ProductService productService;
    @Autowired
    private AddressService addressService;
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 从购物车创建订单
     */
    public Order createOrder(Long userId, Long addressId, List<Long> cartItemIds) {
        Address address = addressService.getById(addressId);
        if (!address.getUserId().equals(userId)) {
            throw new RuntimeException("地址不属于当前用户");
        }

        // 获取选中的购物车项
        List<CartItem> cartItems;
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            // 如果没指定，使用全部购物车项
            cartItems = cartItemRepository.findByUserId(userId);
        } else {
            cartItems = new ArrayList<>();
            for (Long id : cartItemIds) {
                cartItemRepository.findById(id).ifPresent(cartItems::add);
            }
        }
        if (cartItems.isEmpty()) {
            throw new RuntimeException("购物车为空");
        }

        // 地址快照
        String addressSnapshot;
        try {
            addressSnapshot = objectMapper.writeValueAsString(address);
        } catch (JsonProcessingException e) {
            addressSnapshot = "{}";
        }

        // 计算总金额并扣库存
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = productService.getById(cartItem.getProductId());
            // 扣库存
            productService.reduceStock(product.getId(), cartItem.getQuantity());

            BigDecimal itemPrice = new BigDecimal(product.getPrice());
            BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(itemTotal);

            OrderItem oi = new OrderItem();
            oi.setProductId(product.getId());
            oi.setProductName(product.getName());
            oi.setProductImage(product.getImage());
            oi.setPrice(product.getPrice());
            oi.setQuantity(cartItem.getQuantity());
            orderItems.add(oi);
        }

        // 创建订单
        Order order = new Order();
        order.setUserId(userId);
        order.setAddressSnapshot(addressSnapshot);
        order.setTotalAmount(total.toString());
        order.setStatus(0); // 待支付
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        // 保存订单明细
        for (OrderItem oi : orderItems) {
            oi.setOrderId(order.getId());
            orderItemRepository.save(oi);
        }

        // 清空购物车中已购买的项
        for (CartItem cartItem : cartItems) {
            cartItemRepository.deleteById(cartItem.getId());
        }

        return order;
    }

    /**
     * 支付订单
     */
    public void payOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (order.getStatus() != 0) {
            throw new RuntimeException("订单状态错误，当前状态：" + getStatusText(order.getStatus()));
        }
        order.setStatus(1); // 待发货
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * 取消订单
     */
    public void cancelOrder(Long orderId, String reason, boolean isAuto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (order.getStatus() != 0 && order.getStatus() != 1) {
            throw new RuntimeException("当前订单状态不可取消");
        }
        order.setStatus(-1);
        order.setCancelReason(isAuto ? "超时自动取消" : ("用户取消：" + reason));
        order.setUpdatedAt(LocalDateTime.now());
        // 恢复库存
        restoreStock(orderId);
        orderRepository.save(order);
    }

    /**
     * 发货（管理员操作）
     */
    public void shipOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (order.getStatus() != 1) {
            throw new RuntimeException("仅待发货订单可以发货");
        }
        order.setStatus(2); // 待收货
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * 确认收货
     */
    public void confirmReceipt(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (order.getStatus() != 2) {
            throw new RuntimeException("仅待收货订单可以确认收货");
        }
        order.setStatus(3); // 待评价
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * 申请退单
     */
    public void applyRefund(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (order.getStatus() != 2 && order.getStatus() != 3) {
            throw new RuntimeException("当前订单状态不可申请退单");
        }
        order.setPreviousStatus(order.getStatus());
        order.setStatus(-2); // 退单申请中
        order.setRefundReason(reason);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * 管理员审核退单
     */
    public void approveRefund(Long orderId, boolean approved) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (order.getStatus() != -2) {
            throw new RuntimeException("订单状态错误：当前非退单申请中状态");
        }
        if (approved) {
            order.setStatus(-3); // 退单成功
            // 恢复库存
            restoreStock(orderId);
        } else {
            // 恢复原状态
            order.setStatus(order.getPreviousStatus());
            order.setRefundReason(null);
            order.setPreviousStatus(null);
        }
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * 管理员直接退单
     */
    public void directRefund(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (order.getStatus() != 3) {
            throw new RuntimeException("仅待评价订单可直接退单");
        }
        order.setStatus(-4); // 管理员退单
        order.setRefundReason("管理员退单：" + reason);
        order.setUpdatedAt(LocalDateTime.now());
        // 恢复库存
        restoreStock(orderId);
        orderRepository.save(order);
    }

    /**
     * 评价
     */
    public void review(Long orderId, Long userId, String content, Integer rating) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (order.getStatus() != 3) {
            throw new RuntimeException("仅待评价订单可以进行评价");
        }
        reviewService.addReview(orderId, userId, content, rating);
        order.setStatus(4); // 已完成
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * 恢复库存
     */
    private void restoreStock(Long orderId) {
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            productService.increaseStock(item.getProductId(), item.getQuantity());
        }
    }

    public Order getById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        return order;
    }

    public List<Order> getByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> listAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getByStatus(Integer status) {
        return orderRepository.findByStatus(status);
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public static String getStatusText(Integer status) {
        switch (status) {
            case 0: return "待支付";
            case 1: return "待发货";
            case 2: return "待收货";
            case 3: return "待评价";
            case 4: return "已完成";
            case -1: return "已取消";
            case -2: return "退单申请中";
            case -3: return "退单成功";
            case -4: return "管理员退单";
            default: return "未知";
        }
    }
}