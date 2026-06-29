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
            placeholder="用户名 / 手机号"
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
