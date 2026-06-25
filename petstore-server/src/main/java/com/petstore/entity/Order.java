package com.petstore.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "address_snapshot")
    private String addressSnapshot;

    @Column(name = "total_amount")
    private String totalAmount;

    private Integer status = 0;
    // 0=待支付, 1=待发货, 2=待收货, 3=待评价, 4=已完成
    // -1=已取消, -2=退单申请中, -3=退单成功, -4=管理员退单

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Column(name = "refund_reason")
    private String refundReason;

    @Column(name = "previous_status")
    private Integer previousStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Order() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getAddressSnapshot() { return addressSnapshot; }
    public void setAddressSnapshot(String addressSnapshot) { this.addressSnapshot = addressSnapshot; }
    public String getTotalAmount() { return totalAmount; }
    public void setTotalAmount(String totalAmount) { this.totalAmount = totalAmount; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public String getRefundReason() { return refundReason; }
    public void setRefundReason(String refundReason) { this.refundReason = refundReason; }
    public Integer getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(Integer previousStatus) { this.previousStatus = previousStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}