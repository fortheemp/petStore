import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post, put, del } from '@/api'

export const useAddressStore = defineStore('address', () => {
  const addresses = ref([])

  // ===== 从后端加载地址 =====
  const fetchAll = async (userId) => {
    if (!userId) return
    try {
      const res = await get('/addresses', { userId })
      if (res.data.code === 200) {
        addresses.value = res.data.data || []
      }
    } catch {
      console.error('加载地址失败')
    }
  }

  // ===== 添加地址（后端 + 本地同步） =====
  const addAddress = async (userId, address) => {
    const res = await post('/addresses', {
      userId: Number(userId),
      receiverName: address.name || address.receiverName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district || '',
      detail: address.detail,
      isDefault: address.isDefault ? 1 : 0,
    })
    if (res.data.code === 200) {
      await fetchAll(userId)
      return res.data.data
    }
    throw new Error(res.data.message || '添加地址失败')
  }

  // ===== 更新地址 =====
  const updateAddress = async (id, data) => {
    const res = await put(`/addresses/${id}`, {
      receiverName: data.name || data.receiverName,
      phone: data.phone,
      province: data.province,
      city: data.city,
      district: data.district || '',
      detail: data.detail,
      isDefault: data.isDefault ? 1 : 0,
    })
    if (res.data.code === 200) {
      const idx = addresses.value.findIndex((a) => a.id === id)
      if (idx >= 0) addresses.value[idx] = res.data.data
      return res.data.data
    }
    throw new Error(res.data.message || '更新地址失败')
  }

  // ===== 删除地址 =====
  const deleteAddress = async (id) => {
    const res = await del(`/addresses/${id}`)
    if (res.data.code === 200) {
      addresses.value = addresses.value.filter((a) => a.id !== id)
    }
  }

  // ===== 设为默认 =====
  const setDefault = async (id) => {
    const res = await post(`/addresses/${id}/default`)
    if (res.data.code === 200) {
      addresses.value.forEach((a) => { a.isDefault = a.id === id })
    }
  }

  // ===== 获取默认地址 =====
  const getDefault = () => addresses.value.find((a) => a.isDefault)

  return {
    addresses,
    fetchAll,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    getDefault,
  }
})