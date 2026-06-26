<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const registerForm = ref({
  username: '', phone: '', code: '', password: '', confirmPassword: '', agreePolicy: false,
})
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const countdown = ref(0)
let countdownTimer = null

const formRef = ref(null)

const passwordStrength = computed(() => {
  const pwd = registerForm.value.password
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

const validateConfirm = (rule, value, callback) => {
  if (value !== registerForm.value.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名3-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含英文字母和数字', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' },
  ],
}

const handleGetCode = () => {
  if (!registerForm.value.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    ElMessage.warning('手机号格式不正确')
    return
  }
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(countdownTimer)
  }, 1000)
  ElMessage.success('验证码已发送（Mock：123456）')
}

const handleRegister = async () => {
  if (!registerForm.value.agreePolicy) {
    ElMessage.warning('请阅读并同意用户协议和隐私政策')
    return
  }
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const result = await userStore.register(registerForm.value)
      if (result.success) {
        ElMessage.success('注册成功，请登录')
        router.push('/login')
      } else {
        ElMessage.error(result.message)
      }
    } catch {
      ElMessage.error('注册失败，请稍后重试')
    } finally {
      loading.value = false
    }
  })
}

const goToLogin = () => router.push('/login')

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
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

      <h2 class="auth-card__title">创建账户</h2>
      <p class="auth-card__subtitle">加入 PetStore 开始购物</p>

      <el-form ref="formRef" :model="registerForm" :rules="rules" @submit.prevent="handleRegister">
        <el-form-item prop="username" class="auth-form__item">
          <el-input v-model="registerForm.username" placeholder="用户名（英文字母或数字）" size="large" :prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="phone" class="auth-form__item">
          <el-input v-model="registerForm.phone" placeholder="手机号" size="large" :prefix-icon="Iphone" />
        </el-form-item>

        <el-form-item prop="code" class="auth-form__item">
          <div class="auth-form__code">
            <el-input v-model="registerForm.code" placeholder="验证码" size="large" :prefix-icon="Message" />
            <button
              type="button"
              class="btn-get-code"
              :disabled="countdown > 0"
              @click="handleGetCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
        </el-form-item>

        <el-form-item prop="password" class="auth-form__item">
          <el-input
            v-model="registerForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
          >
            <template #suffix>
              <el-icon class="toggle-password" @click="showPassword = !showPassword">
                <component :is="showPassword ? View : Hide" />
              </el-icon>
            </template>
          </el-input>
          <div v-if="registerForm.password" class="password-strength">
            <div
              v-for="i in 4"
              :key="i"
              class="password-strength__bar"
              :class="{ active: i <= passwordStrength.level }"
              :style="i <= passwordStrength.level ? { background: passwordStrength.color } : {}"
            />
          </div>
          <p v-if="passwordStrength.label" class="password-strength__text" :style="{ color: passwordStrength.color }">
            密码强度：{{ passwordStrength.label }}
          </p>
        </el-form-item>

        <el-form-item prop="confirmPassword" class="auth-form__item">
          <el-input
            v-model="registerForm.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="确认密码"
            size="large"
            :prefix-icon="Lock"
          >
            <template #suffix>
              <el-icon class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                <component :is="showConfirmPassword ? View : Hide" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="auth-form__agreement">
          <el-checkbox v-model="registerForm.agreePolicy" />
          <span>
            我已阅读并同意
            <a href="#" @click.prevent="ElMessage.info('用户协议开发中...')">《用户协议》</a>
            和
            <a href="#" @click.prevent="ElMessage.info('隐私政策开发中...')">《隐私政策》</a>
          </span>
        </div>

        <el-button
          type="primary"
          class="auth-form__submit"
          size="large"
          :loading="loading"
          @click="handleRegister"
        >
          注 册
        </el-button>
      </el-form>

      <p class="auth-card__footer">
        已有账户？
        <a href="#" @click.prevent="goToLogin">立即登录</a>
      </p>
    </div>
  </div>
</template>

<script>
import { User, Lock, View, Hide, Iphone, Message } from '@element-plus/icons-vue'
export default { components: { User, Lock, View, Hide, Iphone, Message } }
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
.logo-icon { display: flex; align-items: center; }
.logo-text { font-size: 2.8rem; font-weight: 700; color: #1c49c2; }

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

.auth-form__item { margin-bottom: 2rem; }
.auth-form__item :deep(.el-input) { height: 4.8rem; }
.auth-form__item :deep(.el-input__wrapper) { border-radius: 8px; box-shadow: 0 0 0 1px #ddd; }
.auth-form__item :deep(.el-input__wrapper:hover) { box-shadow: 0 0 0 1px #bbb; }
.auth-form__item :deep(.el-input__wrapper.is-focus) { box-shadow: 0 0 0 3px rgba(28, 73, 194, 0.1); }

.toggle-password { cursor: pointer; color: #999; }
.toggle-password:hover { color: #666; }

.auth-form__code {
  display: flex;
  gap: 1.2rem;
  width: 100%;
}
.auth-form__code .el-input { flex: 1; }

.btn-get-code {
  width: 12rem;
  height: 4.8rem;
  border: 1px solid #1c49c2;
  background: #fff;
  color: #1c49c2;
  border-radius: 8px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-get-code:hover:not(:disabled) { background: #f0f6ff; }
.btn-get-code:disabled { border-color: #ddd; color: #999; cursor: not-allowed; }

.password-strength {
  display: flex;
  gap: 4px;
  margin-top: 0.8rem;
}
.password-strength__bar {
  flex: 1;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  transition: background 0.2s;
}
.password-strength__text {
  font-size: 1.2rem;
  margin-top: 0.4rem;
}

.auth-form__agreement {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 2.4rem;
  font-size: 1.3rem;
  color: #666;
  line-height: 1.5;
}
.auth-form__agreement :deep(.el-checkbox) { margin-top: 0.2rem; }
.auth-form__agreement a {
  color: #1c49c2;
  text-decoration: none;
}
.auth-form__agreement a:hover { text-decoration: underline; }

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
