<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { post } from '@/api/request'

const userStore = useUserStore()

const profileForm = ref({
  nickname: userStore.userInfo?.nickname || '',
  gender: userStore.userInfo?.gender || 'secret',
  email: userStore.userInfo?.email || '',
})

const maskedPhone = computed(() => {
  const phone = userStore.userInfo?.phone || ''
  return phone.replace(/(\d{3})\*{4}(\d{4})/, '$1****$2')
})

const handleSave = () => {
  userStore.updateUserInfo({
    nickname: profileForm.value.nickname,
    gender: profileForm.value.gender,
    email: profileForm.value.email,
  })
  ElMessage.success('保存成功')
}

const fileInput = ref(null)
const avatarUploading = ref(false)

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  avatarUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const avatarUrl = res || res?.url
    if (avatarUrl) {
      userStore.updateUserInfo({ avatar: avatarUrl })
      ElMessage.success('头像已更新')
    }
  } catch {
    ElMessage.error('头像上传失败')
  } finally {
    avatarUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="profile-page">
    <h1 class="profile-page__title">个人资料</h1>

    <!-- 头像 -->
    <div class="profile-section">
      <h2 class="profile-section__title">头像</h2>
      <div class="profile-avatar">
        <div class="profile-avatar__image">
          <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="头像" class="profile-avatar__img" />
          <span v-else>{{ userStore.displayName.charAt(0) }}</span>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="profile-avatar__file" @change="handleAvatarChange" />
        <button class="profile-avatar__btn" :disabled="avatarUploading" @click="triggerUpload">
          {{ avatarUploading ? '上传中...' : '修改头像' }}
        </button>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="profile-section">
      <h2 class="profile-section__title">基本信息</h2>
      <div class="profile-form">
        <div class="profile-form__row">
          <label class="profile-form__label">用户名</label>
          <div class="profile-form__value readonly">{{ userStore.userInfo?.username }}</div>
        </div>

        <div class="profile-form__row">
          <label class="profile-form__label">昵称</label>
          <el-input
            v-model="profileForm.nickname"
            placeholder="请输入昵称"
            maxlength="20"
            show-word-limit
            style="max-width: 32rem"
          />
        </div>

        <div class="profile-form__row">
          <label class="profile-form__label">性别</label>
          <el-radio-group v-model="profileForm.gender">
            <el-radio value="male">男</el-radio>
            <el-radio value="female">女</el-radio>
            <el-radio value="secret">保密</el-radio>
          </el-radio-group>
        </div>

        <div class="profile-form__row">
          <label class="profile-form__label">手机号</label>
          <div class="profile-form__value readonly">{{ maskedPhone }}</div>
        </div>

        <div class="profile-form__row">
          <label class="profile-form__label">邮箱</label>
          <el-input
            v-model="profileForm.email"
            placeholder="请输入邮箱"
            style="max-width: 32rem"
          />
        </div>

        <div class="profile-form__actions">
          <el-button type="primary" size="large" @click="handleSave">保存修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 3.2rem;
}

.profile-page__title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #121212;
  margin-bottom: 3.2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.profile-section {
  margin-bottom: 3.2rem;
}

.profile-section__title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #121212;
  margin-bottom: 2rem;
}

/* ========== 头像 ========== */
.profile-avatar {
  display: flex;
  align-items: center;
  gap: 2.4rem;
}

.profile-avatar__image {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: var(--color-brand-blue);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.2rem;
  font-weight: 700;
  flex-shrink: 0;
  overflow: hidden;
}

.profile-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar__file {
  display: none;
}

.profile-avatar__btn {
  padding: 0.8rem 2rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  font-size: 1.4rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.profile-avatar__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-avatar__btn:hover:not(:disabled) {
  border-color: var(--color-brand-blue);
  color: var(--color-brand-blue);
}

/* ========== 表单 ========== */
.profile-form__row {
  display: flex;
  align-items: center;
  gap: 2.4rem;
  margin-bottom: 2.4rem;
}

.profile-form__label {
  width: 8rem;
  text-align: right;
  font-size: 1.4rem;
  color: #666;
  flex-shrink: 0;
}

.profile-form__value {
  font-size: 1.5rem;
  color: #121212;
}

.profile-form__value.readonly {
  color: #999;
}

.profile-form__actions {
  margin-top: 3.2rem;
  padding-left: 10.4rem;
}

@media (max-width: 768px) {
  .profile-form__row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  .profile-form__label {
    width: auto;
    text-align: left;
  }
  .profile-form__actions {
    padding-left: 0;
  }
}
</style>
