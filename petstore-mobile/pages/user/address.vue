<template>
  <view class="container">
    <!-- Title -->
    <view class="page-header">
      <text class="page-title">收货地址管理</text>
      <view class="add-btn-top" @tap="openAddForm">
        <text class="add-btn-top-text">+ 新增</text>
      </view>
    </view>

    <!-- Empty State -->
    <view v-if="addressList.length === 0" class="empty">
      <view class="empty-circle">
        <text class="empty-circle-text">址</text>
      </view>
      <text class="empty-text">暂无收货地址</text>
      <view class="empty-btn" @tap="openAddForm">
        <text class="empty-btn-text">新增地址</text>
      </view>
    </view>

    <!-- Address List -->
    <view
      v-for="addr in addressList"
      :key="addr.id"
      class="address-card"
      :class="{ 'address-card--default': addr.isDefault }"
      @tap="selectAddress(addr)"
    >
      <view class="address-card__header">
        <view class="address-card__user">
          <text class="address-card__name">{{ addr.name }}</text>
          <text class="address-card__phone">{{ maskPhone(addr.phone) }}</text>
          <view v-if="addr.isDefault" class="address-card__badge">
            <text class="badge-text">默认</text>
          </view>
        </view>
      </view>
      <text class="address-card__detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</text>
      <view class="address-card__actions">
        <view v-if="!addr.isDefault" class="action-btn" @tap.stop="setDefault(addr.id)">
          <text class="action-text">设为默认</text>
        </view>
        <view class="action-btn" @tap.stop="openEditForm(addr)">
          <text class="action-text">编辑</text>
        </view>
        <view class="action-btn action-btn--delete" @tap.stop="deleteAddress(addr)">
          <text class="action-text action-text--delete">删除</text>
        </view>
      </view>
    </view>

    <!-- Inline Add/Edit Form -->
    <view v-if="showForm" class="form-overlay" @tap.self="showForm = false">
      <view class="form-card">
        <text class="form-card__title">{{ isEditing ? '编辑收货地址' : '新增收货地址' }}</text>

        <view class="form-item">
          <text class="form-label">收货人</text>
          <input class="form-input" v-model="editForm.name" placeholder="请输入收货人姓名" />
        </view>
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input class="form-input" v-model="editForm.phone" placeholder="请输入手机号" type="number" maxlength="11" />
        </view>
        <view class="form-item">
          <text class="form-label">省份</text>
          <picker :range="provinceList" @change="onProvinceChange">
            <view class="form-input picker-input">
              <text :class="editForm.province ? '' : 'placeholder'">{{ editForm.province || '请选择省份' }}</text>
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="form-label">城市</text>
          <picker :range="cityList" @change="onCityChange">
            <view class="form-input picker-input">
              <text :class="editForm.city ? '' : 'placeholder'">{{ editForm.city || '请选择城市' }}</text>
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="form-label">区县</text>
          <picker :range="districtList" @change="onDistrictChange">
            <view class="form-input picker-input">
              <text :class="editForm.district ? '' : 'placeholder'">{{ editForm.district || '请选择区县' }}</text>
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="form-label">详细地址</text>
          <input class="form-input" v-model="editForm.detail" placeholder="街道、门牌号、小区楼栋号等" />
        </view>
        <view class="form-item form-item--row" @tap="editForm.isDefault = !editForm.isDefault">
          <view class="checkbox" :class="{ 'checkbox--checked': editForm.isDefault }">
            <text v-if="editForm.isDefault" class="checkbox-icon">✓</text>
          </view>
          <text class="checkbox-label">设为默认收货地址</text>
        </view>

        <view class="form-actions">
          <view class="form-btn form-btn--cancel" @tap="showForm = false">
            <text class="form-btn-text form-btn-text--cancel">取消</text>
          </view>
          <view class="form-btn form-btn--save" @tap="saveAddress">
            <text class="form-btn-text form-btn-text--save">保存</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Fixed Bottom Add Button -->
    <view v-if="!showForm" class="bottom-bar">
      <view class="bottom-add-btn" @tap="openAddForm">
        <text class="bottom-add-btn-text">+ 新增收货地址</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { getAddressList, addAddress as apiAddAddress, updateAddress as apiUpdateAddress, deleteAddress as apiDeleteAddress, setDefaultAddress } from '@/services/address'
import { chinaRegions } from '@/data/china-regions'

const userStore = useUserStore()

// 将 PC 端 { value, label, children } 格式转为手机端 { 省: { 市: [区] } }
const provinces = {}
chinaRegions.forEach((p) => {
  const cityName = p.value
  provinces[cityName] = {}
  ;(p.children || []).forEach((c) => {
    provinces[cityName][c.value] = (c.children || []).map((d) => d.value)
  })
})

const addressList = ref([])

const loadAddresses = async () => {
  const userId = userStore.user?.id
  if (!userId) { addressList.value = []; return }
  try {
    const res = await getAddressList(userId)
    addressList.value = Array.isArray(res) ? res.map(a => ({
      id: a.id,
      name: a.receiverName,
      phone: a.phone,
      province: a.province,
      city: a.city,
      district: a.district,
      detail: a.detail,
      isDefault: a.isDefault === 1,
    })) : []
  } catch { addressList.value = [] }
}

const showForm = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const editForm = ref({ name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false })

const provinceList = computed(() => Object.keys(provinces))
const cityList = computed(() => {
  if (!editForm.value.province) return []
  return Object.keys(provinces[editForm.value.province] || {})
})
const districtList = computed(() => {
  if (!editForm.value.province || !editForm.value.city) return []
  return provinces[editForm.value.province]?.[editForm.value.city] || []
})

const onProvinceChange = (e) => {
  editForm.value.province = provinceList.value[e.detail.value]
  editForm.value.city = ''
  editForm.value.district = ''
}
const onCityChange = (e) => {
  editForm.value.city = cityList.value[e.detail.value]
  editForm.value.district = ''
}
const onDistrictChange = (e) => {
  editForm.value.district = districtList.value[e.detail.value]
}

const maskPhone = (phone) => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

const openAddForm = () => {
  isEditing.value = false
  editingId.value = null
  editForm.value = { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false }
  showForm.value = true
}

const openEditForm = (addr) => {
  isEditing.value = true
  editingId.value = addr.id
  editForm.value = { ...addr }
  showForm.value = true
}

const saveAddress = async () => {
  if (!editForm.value.name.trim()) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return
  }
  if (!/^1[3-9]\d{9}$/.test(editForm.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!editForm.value.province || !editForm.value.city || !editForm.value.district) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' })
    return
  }
  if (!editForm.value.detail.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return
  }

  const userId = userStore.user?.id
  if (!userId) return

  const data = {
    userId,
    receiverName: editForm.value.name,
    phone: editForm.value.phone,
    province: editForm.value.province,
    city: editForm.value.city,
    district: editForm.value.district,
    detail: editForm.value.detail,
    isDefault: editForm.value.isDefault ? 1 : 0,
  }

  try {
    if (isEditing.value) {
      await apiUpdateAddress(editingId.value, data)
      uni.showToast({ title: '修改成功', icon: 'success' })
    } else {
      await apiAddAddress(data)
      uni.showToast({ title: '新增成功', icon: 'success' })
    }
    showForm.value = false
    await loadAddresses()
  } catch {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const deleteAddress = (addr) => {
  uni.showModal({
    title: '删除确认',
    content: `确定要删除「${addr.name}」的收货地址吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await apiDeleteAddress(addr.id)
          uni.showToast({ title: '已删除', icon: 'success' })
          await loadAddresses()
        } catch {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

const setDefault = async (id) => {
  try {
    await setDefaultAddress(id)
    uni.showToast({ title: '已设为默认', icon: 'success' })
    await loadAddresses()
  } catch {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const selectAddress = (addr) => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    const prevPage = pages[pages.length - 2]
    if (prevPage && prevPage.route === 'pages/order/checkout') {
      uni.$emit('selectAddress', addr)
      uni.navigateBack()
    }
  }
}

onShow(() => {
  loadAddresses()
})
</script>

<style scoped>
.container {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 160rpx;
}

.page-header {
  background: #fff;
  padding: 28rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f0f0f0;
}

.page-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #121212;
}

.add-btn-top {
  padding: 12rpx 24rpx;
  border: 2rpx dashed #1c49c2;
  border-radius: 12rpx;
}

.add-btn-top-text {
  font-size: 26rpx;
  color: #1c49c2;
  font-weight: 600;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-circle {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.empty-circle-text {
  font-size: 48rpx;
  color: #1c49c2;
  font-weight: 700;
}

.empty-text {
  font-size: 30rpx;
  color: #999;
  margin-bottom: 32rpx;
}

.empty-btn {
  padding: 20rpx 48rpx;
  background: #1c49c2;
  border-radius: 16rpx;
}

.empty-btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.address-card {
  background: #fff;
  margin: 20rpx 24rpx 0;
  border-radius: 24rpx;
  padding: 28rpx 30rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 2rpx solid #eee;
}

.address-card--default {
  border-color: #1c49c2;
  background: #f8faff;
}

.address-card__header {
  margin-bottom: 12rpx;
}

.address-card__user {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.address-card__name {
  font-size: 30rpx;
  font-weight: 600;
  color: #121212;
}

.address-card__phone {
  font-size: 26rpx;
  color: #666;
}

.address-card__badge {
  background: #1c49c2;
  border-radius: 6rpx;
  padding: 2rpx 12rpx;
}

.badge-text {
  font-size: 20rpx;
  color: #fff;
}

.address-card__detail {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
}

.address-card__actions {
  display: flex;
  gap: 24rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-btn {
  padding: 8rpx 0;
}

.action-text {
  font-size: 26rpx;
  color: #666;
}

.action-text--delete {
  color: #e74c3c;
}

/* Form Overlay */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.form-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx 36rpx;
  max-height: 85vh;
  overflow-y: auto;
}

.form-card__title {
  font-size: 34rpx;
  font-weight: 700;
  color: #121212;
  margin-bottom: 40rpx;
  display: block;
  text-align: center;
}

.form-item {
  margin-bottom: 28rpx;
}

.form-item--row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.form-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.form-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.picker-input {
  display: flex;
  align-items: center;
}

.placeholder {
  color: #999;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkbox--checked {
  background: #1c49c2;
  border-color: #1c49c2;
}

.checkbox-icon {
  font-size: 24rpx;
  color: #fff;
  font-weight: 700;
}

.checkbox-label {
  font-size: 28rpx;
  color: #333;
}

.form-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 40rpx;
}

.form-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-btn--cancel {
  background: #f5f5f5;
}

.form-btn--save {
  background: #1c49c2;
}

.form-btn-text {
  font-size: 30rpx;
  font-weight: 600;
}

.form-btn-text--cancel {
  color: #666;
}

.form-btn-text--save {
  color: #fff;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 40rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.bottom-add-btn {
  height: 88rpx;
  background: #ff6c10;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-add-btn-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}
</style>
