<template>
  <view class="auth-page">
    <view class="auth-card">
      <view class="auth-card__logo">
        <view class="logo-icon-circle">
          <text class="logo-icon-text">P</text>
        </view>
        <text class="logo-text">PetStore</text>
      </view>

      <text class="auth-card__title">欢迎回来</text>
      <text class="auth-card__subtitle">登录您的 PetStore 账户</text>

      <view class="auth-form">
        <view class="auth-form__item">
          <input
            class="auth-input"
            v-model="loginForm.username"
            placeholder="用户名 / 手机号 / 邮箱"
          />
        </view>

        <view class="auth-form__item">
          <input
            class="auth-input"
            v-model="loginForm.password"
            :password="!showPassword"
            placeholder="密码"
          />
          <text class="toggle-password" @tap="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </text>
        </view>

        <view class="auth-form__options">
          <view class="remember-me" @tap="loginForm.remember = !loginForm.remember">
            <view class="checkbox" :class="{ 'checkbox--checked': loginForm.remember }">
              <text v-if="loginForm.remember" class="checkbox-icon">✓</text>
            </view>
            <text class="remember-text">记住我</text>
          </view>
          <text class="forgot-password" @tap="forgotPassword">忘记密码？</text>
        </view>

        <text v-if="errorMsg" class="auth-form__error">{{ errorMsg }}</text>

        <view class="auth-form__submit" @tap="handleLogin">
          <text class="auth-form__submit-text">{{ loading ? '登录中...' : '登 录' }}</text>
        </view>
      </view>

      <view class="auth-form__divider">
        <view class="divider-line"></view>
        <text class="divider-text">或者</text>
        <view class="divider-line"></view>
      </view>

      <view class="auth-form__wechat" @tap="wechatLogin">
        <text class="wechat-icon">微</text>
        <text class="wechat-text">使用微信登录</text>
      </view>

      <view class="auth-card__footer">
        <text class="footer-text">还没有账户？</text>
        <text class="footer-link" @tap="goToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loginForm = ref({ username: '', password: '', remember: false })
const loading = ref(false)
const showPassword = ref(false)
const errorMsg = ref('')

onMounted(() => {
  const saved = uni.getStorageSync('petstore_rememberedUser')
  if (saved) {
    loginForm.value.username = saved
    loginForm.value.remember = true
  }
})

const handleLogin = async () => {
  if (loading.value) return
  errorMsg.value = ''

  if (!loginForm.value.username.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (!loginForm.value.password) {
    errorMsg.value = '请输入密码'
    return
  }
  if (loginForm.value.password.length < 6) {
    errorMsg.value = '密码至少6位'
    return
  }

  loading.value = true
  try {
    const result = await userStore.login(loginForm.value)
    if (result.success) {
      if (loginForm.value.remember) {
        uni.setStorageSync('petstore_rememberedUser', loginForm.value.username)
      } else {
        uni.removeStorageSync('petstore_rememberedUser')
      }
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/index/index' })
      }, 1000)
    } else {
      errorMsg.value = result.message || '登录失败'
    }
  } catch {
    errorMsg.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const forgotPassword = () => {
  uni.showToast({ title: '功能开发中...', icon: 'none' })
}

const wechatLogin = () => {
  uni.showToast({ title: '微信登录开发中...', icon: 'none' })
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' })
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 48rpx;
}

.auth-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 48rpx rgba(0, 0, 0, 0.08);
  padding: 96rpx 56rpx;
}

.auth-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 64rpx;
}

.logo-icon-circle {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #1c49c2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.logo-text {
  font-size: 56rpx;
  font-weight: 700;
  color: #1c49c2;
}

.auth-card__title {
  text-align: center;
  margin-bottom: 16rpx;
  font-size: 48rpx;
  font-weight: 700;
  color: #121212;
  display: block;
}

.auth-card__subtitle {
  text-align: center;
  margin-bottom: 64rpx;
  font-size: 28rpx;
  color: #666;
  display: block;
}

.auth-form__item {
  margin-bottom: 32rpx;
  position: relative;
}

.auth-input {
  width: 100%;
  height: 96rpx;
  border: 2rpx solid #ddd;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  background: #fff;
  box-sizing: border-box;
}

.toggle-password {
  position: absolute;
  right: 24rpx;
  top: 30rpx;
  font-size: 24rpx;
  color: #999;
}

.auth-form__options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48rpx;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ddd;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox--checked {
  background: #1c49c2;
  border-color: #1c49c2;
}

.checkbox-icon {
  font-size: 22rpx;
  color: #fff;
  font-weight: 700;
}

.remember-text {
  font-size: 28rpx;
  color: #666;
}

.forgot-password {
  font-size: 28rpx;
  color: #1c49c2;
}

.auth-form__error {
  color: #bd2848;
  font-size: 26rpx;
  margin-bottom: 32rpx;
  text-align: center;
  display: block;
}

.auth-form__submit {
  width: 100%;
  height: 96rpx;
  background: #1c49c2;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form__submit-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}

.auth-form__divider {
  display: flex;
  align-items: center;
  margin: 48rpx 0;
  gap: 24rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: #eee;
}

.divider-text {
  font-size: 26rpx;
  color: #999;
}

.auth-form__wechat {
  width: 100%;
  height: 96rpx;
  background: #07c160;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.wechat-icon {
  font-size: 24rpx;
  color: #fff;
  font-weight: 700;
}

.wechat-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}

.auth-card__footer {
  text-align: center;
  margin-top: 48rpx;
}

.footer-text {
  font-size: 28rpx;
  color: #666;
}

.footer-link {
  font-size: 28rpx;
  color: #1c49c2;
  font-weight: 600;
}
</style>
