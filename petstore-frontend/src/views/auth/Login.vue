<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginForm = ref({ username: '', password: '', remember: false })
const loading = ref(false)
const showPassword = ref(false)
const errorMsg = ref('')

const formRef = ref(null)
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
}

onMounted(() => {
  const saved = localStorage.getItem('petstore_rememberedUser')
  if (saved) {
    loginForm.value.username = saved
    loginForm.value.remember = true
  }
})

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    errorMsg.value = ''
    try {
      const result = await userStore.login(loginForm.value)
      if (result.success) {
        ElMessage.success('登录成功')
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      } else {
        errorMsg.value = result.message
      }
    } catch {
      errorMsg.value = '登录失败，请稍后重试'
    } finally {
      loading.value = false
    }
  })
}

const goToRegister = () => router.push('/register')
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-card__logo">
        <span class="logo-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1c49c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-.5 3-1.5c.5-.5 1-1 1.5-1.5"/>
            <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-.5-3-1.5c-.5-.5-1-1-1.5-1.5"/>
            <path d="M8 14v.5M16 14v.5"/>
            <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
            <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a13.152 13.152 0 0 0-.42-3.31"/>
          </svg>
        </span>
        <span class="logo-text">PetStore</span>
      </div>

      <h2 class="auth-card__title">欢迎回来</h2>
      <p class="auth-card__subtitle">登录您的 PetStore 账户</p>

      <el-form ref="formRef" :model="loginForm" :rules="rules" @submit.prevent="handleLogin">
        <el-form-item prop="username" class="auth-form__item">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名 / 手机号 / 邮箱"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password" class="auth-form__item">
          <el-input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
          >
            <template #suffix>
              <el-icon
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <component :is="showPassword ? View : Hide" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="auth-form__options">
          <el-checkbox v-model="loginForm.remember" class="remember-me">
            记住我
          </el-checkbox>
          <a href="#" class="forgot-password" @click.prevent="ElMessage.info('功能开发中...')">
            忘记密码？
          </a>
        </div>

        <p v-if="errorMsg" class="auth-form__error">{{ errorMsg }}</p>

        <el-button
          type="primary"
          class="auth-form__submit"
          size="large"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>

      <div class="auth-form__divider">或者</div>

      <button
        class="auth-form__wechat"
        @click.prevent="ElMessage.info('微信登录功能开发中...')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .177-.554C23.41 18.308 24 16.926 24 15.402c0-3.372-3.282-6.15-7.062-6.544zm-2.007 2.77c.535 0 .969.44.969.983a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.014 0c.535 0 .969.44.969.983a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/>
        </svg>
        使用微信登录
      </button>

      <p class="auth-card__footer">
        还没有账户？
        <a href="#" @click.prevent="goToRegister">立即注册</a>
      </p>
    </div>
  </div>
</template>

<script>
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
export default { components: { User, Lock, View, Hide } }
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2.4rem;
}

.auth-card {
  width: 100%;
  max-width: 42rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 4.8rem 4rem;
}

.auth-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3.2rem;
}

.logo-icon {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 2.8rem;
  font-weight: 700;
  color: #1c49c2;
}

.auth-card__title {
  text-align: center;
  margin-bottom: 0.8rem;
  font-size: 2.4rem;
  font-weight: 700;
  color: #121212;
}

.auth-card__subtitle {
  text-align: center;
  margin-bottom: 3.2rem;
  font-size: 1.4rem;
  color: #666;
}

.auth-form__item {
  margin-bottom: 2rem;
}

.auth-form__item :deep(.el-input) {
  height: 4.8rem;
}

.auth-form__item :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #ddd;
}

.auth-form__item :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #bbb;
}

.auth-form__item :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(28, 73, 194, 0.1);
}

.toggle-password {
  cursor: pointer;
  color: #999;
}
.toggle-password:hover { color: #666; }

.auth-form__options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.4rem;
  font-size: 1.4rem;
}

.remember-me { color: #666; }

.forgot-password {
  color: #1c49c2;
  text-decoration: none;
}
.forgot-password:hover { text-decoration: underline; }

.auth-form__error {
  color: #bd2848;
  font-size: 1.3rem;
  margin-bottom: 1.6rem;
  text-align: center;
}

.auth-form__submit {
  width: 100%;
  height: 4.8rem;
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 600;
  background: #1c49c2;
  border-color: #1c49c2;
}

.auth-form__divider {
  display: flex;
  align-items: center;
  margin: 2.4rem 0;
  color: #999;
  font-size: 1.3rem;
}
.auth-form__divider::before,
.auth-form__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eee;
}
.auth-form__divider::before { margin-right: 1.6rem; }
.auth-form__divider::after { margin-left: 1.6rem; }

.auth-form__wechat {
  width: 100%;
  height: 4.8rem;
  background: #07c160;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}
.auth-form__wechat:hover { background: #06ad56; }

.auth-card__footer {
  text-align: center;
  margin-top: 2.4rem;
  font-size: 1.4rem;
  color: #666;
}
.auth-card__footer a {
  color: #1c49c2;
  font-weight: 600;
  text-decoration: none;
}
.auth-card__footer a:hover { text-decoration: underline; }

@media (max-width: 480px) {
  .auth-card { padding: 3.2rem 2.4rem; }
}
</style>
