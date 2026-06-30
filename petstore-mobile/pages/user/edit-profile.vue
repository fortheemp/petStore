<template>
  <view class="page">
    <!-- Avatar -->
    <view class="avatar-section" @tap="changeAvatar">
      <view class="avatar-wrap">
        <image v-if="avatarUrl" class="avatar" :src="avatarUrl" mode="aspectFill" @error="avatarUrl = ''" />
        <view v-else class="avatar avatar--text">
          <text class="avatar-letter">{{ (userInfo.nickname || userInfo.username || '?').charAt(0) }}</text>
        </view>
      </view>
      <view class="avatar-info">
        <text class="avatar-label">修改头像</text>
        <text class="avatar-tip">点击更换</text>
      </view>
      <image class="menu-arrow-img" src="/static/icons/arrow.png" mode="aspectFit" />
    </view>

    <!-- Form -->
    <view class="card">
      <view class="form-item">
        <text class="form-label">用户名</text>
        <text class="form-value">{{ userInfo.username }}</text>
      </view>
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
        <input class="form-input" v-model="editForm.phone" placeholder="请输入手机号" type="number" maxlength="11" />
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
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateProfile } from '@/services/user'
import { fixImageUrl } from '@/services/request'

const _isHttp = typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:')
const UPLOAD_URL = _isHttp ? '/api/upload/image' : 'https://frp-hat.com:53577/api/upload/image'

const userStore = useUserStore()
const userInfo = ref(userStore.user || {})

const avatarUrl = ref(fixImageUrl(userInfo.value?.avatar || ''))

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'secret', label: '保密' },
]

const editForm = ref({
  nickname: userInfo.value.nickname || '',
  gender: userInfo.value.gender || 'secret',
  email: userInfo.value.email || '',
  phone: userInfo.value.phone || '',
})

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const filePath = res.tempFilePaths[0]
      uni.showLoading({ title: '上传中...' })
      try {
        const token = uni.getStorageSync('petstore_token') || ''
        const uploadRes = await new Promise((resolve, reject) => {
          uni.uploadFile({
            url: UPLOAD_URL,
            filePath,
            name: 'file',
            header: { Authorization: token ? `Bearer ${token}` : '' },
            success: (r) => {
              if (r.statusCode === 200) {
                try { resolve(JSON.parse(r.data)) } catch { resolve(r.data) }
              } else {
                reject(new Error('上传失败'))
              }
            },
            fail: reject,
          })
        })
        const avatarUrlPath = typeof uploadRes === 'string' ? uploadRes : (uploadRes?.data || uploadRes?.url || '')
        if (avatarUrlPath) {
          await updateProfile({ id: userInfo.value.id, avatar: avatarUrlPath })
          avatarUrl.value = fixImageUrl(avatarUrlPath)
          userStore.updateUserInfo({ avatar: avatarUrlPath })
          userInfo.value = userStore.user || {}
          uni.showToast({ title: '头像已更新', icon: 'success' })
        }
      } catch {
        uni.showToast({ title: '上传失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
  })
}

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
      phone: editForm.value.phone.trim(),
    })
    userStore.updateUserInfo({
      nickname: editForm.value.nickname.trim(),
      gender: editForm.value.gender,
      email: editForm.value.email.trim(),
      phone: editForm.value.phone.trim(),
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

/* Avatar Section */
.avatar-section {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 20rpx 24rpx 0;
  padding: 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.avatar-wrap {
  flex-shrink: 0;
}

.avatar {
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
  border: 4rpx solid #f0f0f0;
  overflow: hidden;
}

.avatar--text {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8ecf4;
}

.avatar-letter {
  font-size: 52rpx;
  font-weight: 700;
  color: #1c49c2;
}

.avatar-info {
  flex: 1;
  margin-left: 30rpx;
}

.avatar-label {
  font-size: 30rpx;
  font-weight: 600;
  color: #121212;
  display: block;
}

.avatar-tip {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 8rpx;
}

.menu-arrow-img {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

/* Card */
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
