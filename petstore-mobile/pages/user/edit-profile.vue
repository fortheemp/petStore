<template>
  <view class="page">
    <view class="card">
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input class="form-input" v-model="editForm.nickname" placeholder="请输入昵称" maxlength="20" />
      </view>
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-group">
          <view
            v-for="opt in genderOptions"
            :key="opt.value"
            class="gender-tag"
            :class="{ 'gender-tag--active': editForm.gender === opt.value }"
            @tap="editForm.gender = opt.value"
          >
            <text class="gender-tag__text" :class="{ 'gender-tag__text--active': editForm.gender === opt.value }">{{ opt.label }}</text>
          </view>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">邮箱</text>
        <input class="form-input" v-model="editForm.email" placeholder="请输入邮箱" type="text" />
      </view>
      <view class="form-item">
        <text class="form-label">手机号</text>
        <text class="form-value">{{ userInfo.phone || '未绑定' }}</text>
      </view>
    </view>

    <view class="save-wrap">
      <view class="save-btn" @tap="saveProfile">
        <text class="save-btn__text">保存修改</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateProfile } from '@/services/user'

const userStore = useUserStore()
const userInfo = ref(userStore.user || {})

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'secret', label: '保密' },
]

const editForm = ref({
  nickname: userInfo.value.nickname || '',
  gender: userInfo.value.gender || 'secret',
  email: userInfo.value.email || '',
})

const saveProfile = async () => {
  if (!editForm.value.nickname.trim()) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' })
    return
  }
  try {
    await updateProfile({
      id: userInfo.value.id,
      nickname: editForm.value.nickname.trim(),
      gender: editForm.value.gender,
      email: editForm.value.email.trim(),
    })
    userStore.updateUserInfo({
      nickname: editForm.value.nickname.trim(),
      gender: editForm.value.gender,
      email: editForm.value.email.trim(),
    })
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => { uni.navigateBack() }, 1000)
  } catch {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}
</script>

<style scoped>
.page {
  background: #f8f9fa;
  min-height: 100vh;
}

.card {
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 0 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  text-align: right;
  font-size: 28rpx;
  color: #333;
}

.form-value {
  font-size: 28rpx;
  color: #999;
}

.gender-group {
  display: flex;
  gap: 16rpx;
}

.gender-tag {
  padding: 10rpx 28rpx;
  border-radius: 8rpx;
  background: #f5f6f8;
}

.gender-tag--active {
  background: #f0f4ff;
}

.gender-tag__text {
  font-size: 26rpx;
  color: #666;
}

.gender-tag__text--active {
  color: #1c49c2;
  font-weight: 600;
}

.save-wrap {
  padding: 40rpx 24rpx 0;
}

.save-btn {
  background: linear-gradient(135deg, #1c49c2, #2d6be0);
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
}

.save-btn__text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}
</style>
