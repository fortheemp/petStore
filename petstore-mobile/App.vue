<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
page {
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #121212;
}

view {
  box-sizing: border-box;
}

image {
  display: block;
}

button {
  margin: 0;
  padding: 0;
  line-height: inherit;
  &::after {
    border: none;
  }
}

/* 全局工具类 */
.card {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.price {
  color: #bd2848;
  font-weight: 700;
}

.price-original {
  color: #999;
  text-decoration: line-through;
  font-size: 22rpx;
}

.badge-green {
  color: #00a651;
  background: #e6f7ee;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.badge-blue {
  color: #fff;
  background: #1c49c2;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.btn-orange {
  background: #ff6c10;
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-weight: 600;
}

.btn-blue {
  background: #1c49c2;
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-weight: 600;
}

.btn-red {
  background: #bd2848;
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
