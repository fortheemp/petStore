<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAddressStore } from '@/stores/address'
import { useUserStore } from '@/stores/user'

const addressStore = useAddressStore()
const userStore = useUserStore()
const userId = computed(() => userStore.userInfo?.id)

onMounted(() => {
  if (userId.value) addressStore.fetchAll(userId.value)
})

const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

const rules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  province: [{ required: true, message: '请选择省份', trigger: 'change' }],
  city: [{ required: true, message: '请选择城市', trigger: 'change' }],
  district: [{ required: true, message: '请选择区县', trigger: 'change' }],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
}

const formRef = ref(null)

const provinces = [
  { value: '广东省', label: '广东省', children: [
    { value: '广州市', label: '广州市', children: [
      { value: '天河区', label: '天河区' }, { value: '越秀区', label: '越秀区' }, { value: '海珠区', label: '海珠区' },
    ]},
    { value: '深圳市', label: '深圳市', children: [
      { value: '南山区', label: '南山区' }, { value: '福田区', label: '福田区' }, { value: '罗湖区', label: '罗湖区' },
    ]},
  ]},
  { value: '北京市', label: '北京市', children: [
    { value: '北京市', label: '北京市', children: [
      { value: '朝阳区', label: '朝阳区' }, { value: '海淀区', label: '海淀区' }, { value: '东城区', label: '东城区' },
    ]},
  ]},
  { value: '上海市', label: '上海市', children: [
    { value: '上海市', label: '上海市', children: [
      { value: '浦东新区', label: '浦东新区' }, { value: '徐汇区', label: '徐汇区' }, { value: '静安区', label: '静安区' },
    ]},
  ]},
]

const cascaderValue = ref([])

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false }
  cascaderValue.value = []
  dialogVisible.value = true
}

const openEditDialog = (addr) => {
  isEditing.value = true
  editingId.value = addr.id
  form.value = {
    name: addr.name,
    phone: addr.phone,
    province: addr.province,
    city: addr.city,
    district: addr.district,
    detail: addr.detail,
    isDefault: addr.isDefault,
  }
  cascaderValue.value = [addr.province, addr.city, addr.district]
  dialogVisible.value = true
}

const handleCascaderChange = (val) => {
  if (val && val.length === 3) {
    form.value.province = val[0]
    form.value.city = val[1]
    form.value.district = val[2]
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  if (!userId.value) {
    ElMessage.error('请先登录')
    return
  }

  const data = { ...form.value }
  try {
    if (isEditing.value) {
      await addressStore.updateAddress(editingId.value, data)
      ElMessage.success('修改成功')
    } else {
      await addressStore.addAddress(userId.value, data)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  }
}

const handleDelete = (addr) => {
  ElMessageBox.confirm(
    `确定要删除「${addr.receiverName || addr.name}」的收货地址吗？`,
    '删除确认',
    { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' },
  ).then(async () => {
    await addressStore.deleteAddress(addr.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const handleSetDefault = async (id) => {
  await addressStore.setDefault(id)
  ElMessage.success('已设为默认')
}

const maskPhone = (phone) => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
</script>

<template>
  <div class="address-page">
    <h1 class="address-page__title">收货地址管理</h1>

    <button class="address-page__add-btn" @click="openAddDialog">
      + 新增收货地址
    </button>

    <!-- 空状态 -->
    <div v-if="addressStore.addresses.length === 0" class="address-empty">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <p>暂无收货地址</p>
      <button class="address-empty__btn" @click="openAddDialog">新增地址</button>
    </div>

    <!-- 地址列表 -->
    <div v-for="addr in addressStore.addresses" :key="addr.id" class="address-card" :class="{ 'address-card--default': addr.isDefault }">
      <div class="address-card__header">
        <div class="address-card__user">
          <span class="address-card__name">{{ addr.receiverName || addr.name }}</span>
          <span class="address-card__phone">{{ maskPhone(addr.phone) }}</span>
          <span v-if="addr.isDefault" class="address-card__badge">默认</span>
        </div>
      </div>
      <p class="address-card__detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</p>
      <div class="address-card__actions">
        <button
          v-if="!addr.isDefault"
          class="address-card__btn address-card__btn--default"
          @click="handleSetDefault(addr.id)"
        >设为默认</button>
        <button class="address-card__btn address-card__btn--edit" @click="openEditDialog(addr)">编辑</button>
        <button class="address-card__btn address-card__btn--delete" @click="handleDelete(addr)">删除</button>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑收货地址' : '新增收货地址'"
      width="52rem"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="8rem">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="form.name" placeholder="请输入收货人姓名" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>

        <el-form-item label="所在地区" prop="province">
          <el-cascader
            v-model="cascaderValue"
            :options="provinces"
            placeholder="请选择省/市/区"
            style="width: 100%"
            @change="handleCascaderChange"
          />
        </el-form-item>

        <el-form-item label="详细地址" prop="detail">
          <el-input
            v-model="form.detail"
            type="textarea"
            :rows="3"
            placeholder="请输入街道、门牌号、小区楼栋号等（不需要填写省市区）"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.isDefault">设为默认收货地址</el-checkbox>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.address-page {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 3.2rem;
}

.address-page__title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #121212;
  margin-bottom: 2.4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.address-page__add-btn {
  display: inline-block;
  padding: 1.2rem 2.4rem;
  background: #fff;
  border: 2px dashed var(--color-brand-blue);
  border-radius: 0.8rem;
  font-size: 1.4rem;
  color: var(--color-brand-blue);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2.4rem;
}

.address-page__add-btn:hover {
  background: #f0f6ff;
}

/* ========== 空状态 ========== */
.address-empty {
  text-align: center;
  padding: 6rem 2.4rem;
}

.address-empty p {
  margin-top: 2rem;
  color: #999;
  font-size: 1.6rem;
  margin-bottom: 2rem;
}

.address-empty__btn {
  padding: 1rem 3.2rem;
  background: var(--color-brand-blue);
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
}

.address-empty__btn:hover { background: #1539a0; }

/* ========== 地址卡片 ========== */
.address-card {
  border: 2px solid #eee;
  border-radius: 1.2rem;
  padding: 2rem 2.4rem;
  margin-bottom: 1.6rem;
  transition: all 0.2s;
}

.address-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.address-card--default {
  border-color: var(--color-brand-blue);
  background: #f8faff;
}

.address-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.address-card__user {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.address-card__name {
  font-size: 1.6rem;
  font-weight: 600;
  color: #121212;
}

.address-card__phone {
  font-size: 1.4rem;
  color: #666;
}

.address-card__badge {
  background: var(--color-brand-blue);
  color: #fff;
  padding: 0.2rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.1rem;
}

.address-card__detail {
  font-size: 1.4rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.6rem;
}

.address-card__actions {
  display: flex;
  gap: 1.2rem;
  padding-top: 1.6rem;
  border-top: 1px solid #f0f0f0;
}

.address-card__btn {
  padding: 0.6rem 1.6rem;
  border-radius: 0.6rem;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s;
}

.address-card__btn--default {
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
}
.address-card__btn--default:hover {
  border-color: var(--color-brand-blue);
  color: var(--color-brand-blue);
}

.address-card__btn--edit {
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
}
.address-card__btn--edit:hover {
  border-color: var(--color-brand-blue);
  color: var(--color-brand-blue);
}

.address-card__btn--delete {
  background: #fff;
  border: 1px solid #ddd;
  color: #e74c3c;
}
.address-card__btn--delete:hover {
  background: #fff5f5;
  border-color: #e74c3c;
}
</style>
