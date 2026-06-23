<template>
  <AppLayout>
    <div class="personal-page">
      <h2 class="page-title">👤 个人中心</h2>
      <el-tabs v-model="activeTab">
        <!-- Profile Tab -->
        <el-tab-pane label="个人信息" name="profile">
          <el-card>
            <el-form :model="profileForm" label-width="80px" style="max-width: 500px;">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="profileForm.nickname" />
              </el-form-item>
              <el-form-item label="角色">
                <el-tag>{{ profileForm.role === 'admin' ? '管理员' : profileForm.role === 'member' ? '会员' : '游客' }}</el-tag>
              </el-form-item>
              <el-form-item label="等级">Lv.{{ profileForm.level }}</el-form-item>
              <el-form-item label="新密码">
                <el-input v-model="profileForm.newPassword" type="password" placeholder="留空则不修改" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateProfile">保存修改</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- Address Tab -->
        <el-tab-pane label="收货地址" name="address">
          <el-button type="primary" @click="showAddressDialog(null)" style="margin-bottom: 16px;">添加地址</el-button>
          <el-row :gutter="16">
            <el-col v-for="addr in addresses" :key="addr.id" :xs="24" :sm="12" :md="8">
              <el-card shadow="hover" class="address-card" :class="{ default: addr.isDefault === 1 }">
                <div class="addr-header">
                  <span class="name">{{ addr.receiverName }}</span>
                  <span class="phone">{{ addr.phone }}</span>
                  <el-tag v-if="addr.isDefault === 1" type="success" size="small">默认</el-tag>
                </div>
                <p class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }} {{ addr.detail }}</p>
                <div class="addr-actions">
                  <el-button size="small" @click="showAddressDialog(addr)">编辑</el-button>
                  <el-button v-if="addr.isDefault !== 1" size="small" type="success" @click="setDefault(addr.id)">设为默认</el-button>
                  <el-button size="small" type="danger" @click="deleteAddress(addr.id)">删除</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <!-- Address Dialog -->
      <el-dialog v-model="addrDialogVisible" :title="editingAddr ? '编辑地址' : '添加地址'" width="500px">
        <el-form ref="addrFormRef" :model="addrForm" label-width="80px">
          <el-form-item label="收货人" prop="receiverName" :rules="[{ required: true }]">
            <el-input v-model="addrForm.receiverName" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone" :rules="[{ required: true }]">
            <el-input v-model="addrForm.phone" />
          </el-form-item>
          <el-form-item label="省份" prop="province">
            <el-input v-model="addrForm.province" />
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-input v-model="addrForm.city" />
          </el-form-item>
          <el-form-item label="区/县" prop="district">
            <el-input v-model="addrForm.district" />
          </el-form-item>
          <el-form-item label="详细地址" prop="detail" :rules="[{ required: true }]">
            <el-input v-model="addrForm.detail" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addrDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAddress">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { updateProfile } from '@/api/user'
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/api/address'
import AppLayout from '@/components/AppLayout.vue'

const userStore = useUserStore()
const activeTab = ref('profile')
const profileForm = reactive({
  username: '', nickname: '', role: '', level: 0, newPassword: ''
})
const addresses = ref([])
const addrDialogVisible = ref(false)
const editingAddr = ref(null)
const addrFormRef = ref(null)
const addrForm = reactive({
  receiverName: '', phone: '', province: '', city: '', district: '', detail: ''
})

onMounted(() => {
  const u = userStore.user
  profileForm.username = u.username
  profileForm.nickname = u.nickname
  profileForm.role = u.role
  profileForm.level = u.level
  loadAddresses()
})

async function updateProfile() {
  try {
    const res = await updateProfile({
      id: userStore.user.id,
      nickname: profileForm.nickname,
      password: profileForm.newPassword || undefined
    })
    userStore.updateUser(res.data || { ...userStore.user, ...profileForm })
    ElMessage.success('修改成功')
    profileForm.newPassword = ''
  } catch (e) {}
}

async function loadAddresses() {
  try { const res = await getAddresses(userStore.user.id); addresses.value = res.data || [] } catch (e) {}
}

function showAddressDialog(addr) {
  editingAddr.value = addr
  if (addr) {
    Object.assign(addrForm, {
      receiverName: addr.receiverName, phone: addr.phone, province: addr.province,
      city: addr.city, district: addr.district, detail: addr.detail
    })
  } else {
    Object.assign(addrForm, { receiverName: '', phone: '', province: '', city: '', district: '', detail: '' })
  }
  addrDialogVisible.value = true
}

async function saveAddress() {
  await addrFormRef.value.validate()
  const data = { ...addrForm, userId: userStore.user.id, isDefault: 0 }
  try {
    if (editingAddr.value) {
      data.id = editingAddr.value.id
      await updateAddress(editingAddr.value.id, data)
    } else {
      await addAddress(data)
    }
    ElMessage.success('保存成功')
    addrDialogVisible.value = false
    loadAddresses()
  } catch (e) {}
}

async function setDefault(id) {
  try { await setDefaultAddress(id); ElMessage.success('已设为默认'); loadAddresses() } catch (e) {}
}

async function deleteAddress(id) {
  try { await deleteAddress(id); ElMessage.success('已删除'); loadAddresses() } catch (e) {}
}
</script>

<style scoped>
.personal-page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title { font-size: 24px; margin-bottom: 20px; }
.address-card { margin-bottom: 16px; position: relative; }
.address-card.default { border: 2px solid #67c23a; }
.addr-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.addr-header .name { font-weight: bold; font-size: 16px; }
.addr-header .phone { color: #666; }
.addr-detail { color: #666; margin-bottom: 12px; line-height: 1.5; }
.addr-actions { display: flex; gap: 8px; }
</style>