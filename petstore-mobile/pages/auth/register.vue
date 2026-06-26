<template>
  <view class="auth-page">
    <view class="auth-card">
      <view class="auth-card__logo">
        <view class="logo-icon-circle">
          <text class="logo-icon-text">P</text>
        </view>
        <text class="logo-text">PetStore</text>
      </view>

      <text class="auth-card__title">创建账户</text>
      <text class="auth-card__subtitle">加入 PetStore 开始购物</text>

      <view class="auth-form">
        <view class="auth-form__item">
          <input class="auth-input" v-model="form.username" placeholder="用户名（3-20个字符）" />
        </view>

        <view class="auth-form__item">
          <input class="auth-input" v-model="form.phone" placeholder="手机号" type="number" maxlength="11" />
        </view>

        <view class="auth-form__item auth-form__code">
          <input class="auth-input auth-input--flex" v-model="form.code" placeholder="验证码" type="number" maxlength="6" />
          <view
            class="btn-get-code"
            :class="{ 'btn-get-code--disabled': countdown > 0 }"
            @tap="handleGetCode"
          >
            <text class="btn-get-code-text">{{ countdown > 0 ? countdown + 's' : '获取验证码' }}</text>
          </view>
        </view>

        <view class="auth-form__item">
          <input
            class="auth-input"
            v-model="form.password"
            :password="!showPassword"
            placeholder="密码（至少6位）"
          />
          <text class="toggle-password" @tap="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </text>
          <view v-if="form.password" class="password-strength">
            <view
              v-for="i in 4"
              :key="i"
              class="password-strength__bar"
              :class="{ active: i <= passwordStrength.level }"
              :style="i <= passwordStrength.level ? { background: passwordStrength.color } : {}"
            ></view>
          </view>
          <text v-if="passwordStrength.label" class="password-strength__text" :style="{ color: passwordStrength.color }">
            密码强度：{{ passwordStrength.label }}
          </text>
        </view>

        <view class="auth-form__item">
          <input
            class="auth-input"
            v-model="form.confirmPassword"
            :password="!showConfirmPassword"
            placeholder="确认密码"
          />
          <text class="toggle-password" @tap="showConfirmPassword = !showConfirmPassword">
            {{ showConfirmPassword ? '隐藏' : '显示' }}
          </text>
        </view>

        <view class="auth-form__agreement" @tap="form.agreePolicy = !form.agreePolicy">
          <view class="checkbox" :class="{ 'checkbox--checked': form.agreePolicy }">
            <text v-if="form.agreePolicy" class="checkbox-icon">✓</text>
          </view>
          <text class="agreement-text">
            我已阅读并同意<text class="agreement-link">《用户协议》</text>和<text class="agreement-link">《隐私政策》</text>
          </text>
        </view>

        <view class="auth-form__submit" @tap="handleRegister">
          <text class="auth-form__submit-text">{{ loading ? '注册中...' : '注 册' }}</text>
        </view>
      </view>

      <view class="auth-card__footer">
        <text class="footer-text">已有账户？</text>
        <text class="footer-link" @tap="goToLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const form = ref({
  username: '', phone: '', code: '', password: '', confirmPassword: '', agreePolicy: false,
})
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const countdown = ref(0)
let countdownTimer = null

const passwordStrength = computed(() => {
  const pwd = form.value.password
  if (!pwd) return { level: 0, label: '', color: '' }
  let s = 0
  if (pwd.length >= 6) s++
  if (pwd.length >= 10) s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[0-9]/.test(pwd)) s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  const level = Math.min(s, 4)
  const map = {
    0: { label: '', color: '' },
    1: { label: '弱', color: '#e74c3c' },
    2: { label: '一般', color: '#f39c12' },
    3: { label: '强', color: '#27ae60' },
    4: { label: '非常强', color: '#27ae60' },
  }
  return { level, ...map[level] }
})

const handleGetCode = () => {
  if (countdown.value > 0) return
  if (!form.value.phone) {
    uni.showToast({ title: '请先输入手机号', icon: 'none' })
    return
  }
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return
  }
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(countdownTimer)
  }, 1000)
  uni.showToast({ title: '验证码已发送（Mock：123456）', icon: 'none' })
}

const handleRegister = async () => {
  if (loading.value) return
  if (!form.value.agreePolicy) {
    uni.showToast({ title: '请阅读并同意用户协议', icon: 'none' })
    return
  }
  if (!form.value.username.trim() || form.value.username.trim().length < 3) {
    uni.showToast({ title: '用户名3-20个字符', icon: 'none' })
    return
  }
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!form.value.code || form.value.code.length !== 6) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }
  if (form.value.password.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' })
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const result = await userStore.register(form.value)
    if (result.success) {
      uni.showToast({ title: '注册成功，请登录', icon: 'success' })
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/auth/login' })
      }, 1500)
    } else {
      uni.showToast({ title: result.message || '注册失败', icon: 'none' })
    }
  } catch {
    uni.showToast({ title: '注册失败，请稍后重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  uni.navigateBack()
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 48rpx;
}

.auth-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 48rpx rgba(0, 0, 0, 0.08);
  padding: 80rpx 56rpx;
}

.auth-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 56rpx;
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
  margin-bottom: 12rpx;
  font-size: 48rpx;
  font-weight: 700;
  color: #121212;
  display: block;
}

.auth-card__subtitle {
  text-align: center;
  margin-bottom: 56rpx;
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

.auth-input--flex {
  flex: 1;
}

.auth-form__code {
  display: flex;
  gap: 20rpx;
}

.btn-get-code {
  height: 96rpx;
  padding: 0 24rpx;
  border: 2rpx solid #1c49c2;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-get-code--disabled {
  border-color: #ddd;
}

.btn-get-code-text {
  font-size: 26rpx;
  color: #1c49c2;
  white-space: nowrap;
}

.btn-get-code--disabled .btn-get-code-text {
  color: #999;
}

.toggle-password {
  position: absolute;
  right: 24rpx;
  top: 30rpx;
  font-size: 24rpx;
  color: #999;
}

.password-strength {
  display: flex;
  gap: 8rpx;
  margin-top: 16rpx;
}

.password-strength__bar {
  flex: 1;
  height: 8rpx;
  background: #eee;
  border-radius: 4rpx;
}

.password-strength__text {
  font-size: 24rpx;
  margin-top: 8rpx;
  display: block;
}

.auth-form__agreement {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 48rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ddd;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;
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

.agreement-text {
  font-size: 26rpx;
  color: #666;
}

.agreement-link {
  color: #1c49c2;
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
