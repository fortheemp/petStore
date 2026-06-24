import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('address', () => {
  const addresses = ref([
    {
      id: 1,
      name: '张三',
      phone: '13888888888',
      province: '广东省',
      city: '广州市',
      district: '天河区',
      detail: '珠江新城华夏路30号',
      isDefault: true,
    },
    {
      id: 2,
      name: '李四',
      phone: '15966666666',
      province: '北京市',
      city: '朝阳区',
      district: '',
      detail: '望京SOHO T3 12层',
      isDefault: false,
    },
  ])

  const init = () => {
    const saved = localStorage.getItem('petstore_addresses')
    if (saved) {
      try { addresses.value = JSON.parse(saved) } catch {}
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('petstore_addresses', JSON.stringify(addresses.value))
  }

  const addAddress = (address) => {
    const newId = Math.max(...addresses.value.map((a) => a.id), 0) + 1
    addresses.value.push({ ...address, id: newId })
    if (address.isDefault) setDefault(newId)
    saveToStorage()
  }

  const updateAddress = (id, data) => {
    const index = addresses.value.findIndex((a) => a.id === id)
    if (index >= 0) {
      addresses.value[index] = { ...addresses.value[index], ...data }
      if (data.isDefault) setDefault(id)
      saveToStorage()
    }
  }

  const deleteAddress = (id) => {
    const index = addresses.value.findIndex((a) => a.id === id)
    if (index >= 0) {
      addresses.value.splice(index, 1)
      saveToStorage()
    }
  }

  const setDefault = (id) => {
    addresses.value.forEach((a) => {
      a.isDefault = a.id === id
    })
    saveToStorage()
  }

  const getDefault = () => addresses.value.find((a) => a.isDefault)

  init()

  return {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    getDefault,
  }
})
