import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAddressList, addAddress as apiAddAddress, updateAddress as apiUpdateAddress, deleteAddress as apiDeleteAddress, setDefaultAddress as apiSetDefault } from '@/api/address'
import { useUserStore } from './user'

export const useAddressStore = defineStore('address', () => {
  const addresses = ref([])

  function getUserId() {
    const userStore = useUserStore()
    return userStore.userInfo?.id
  }

  async function loadAddresses() {
    const userId = getUserId()
    if (!userId) { addresses.value = []; return }
    try {
      const res = await getAddressList(userId)
      addresses.value = Array.isArray(res) ? res.map((a) => ({
        id: a.id,
        name: a.receiverName,
        phone: a.phone,
        province: a.province,
        city: a.city,
        district: a.district,
        detail: a.detail,
        isDefault: a.isDefault === 1,
      })) : []
    } catch { addresses.value = [] }
  }

  async function addAddress(data) {
    const userId = getUserId()
    if (!userId) return
    try {
      await apiAddAddress({
        userId,
        receiverName: data.name,
        phone: data.phone,
        province: data.province,
        city: data.city,
        district: data.district,
        detail: data.detail,
        isDefault: data.isDefault ? 1 : 0,
      })
      await loadAddresses()
    } catch {}
  }

  async function updateAddressAction(id, data) {
    try {
      await apiUpdateAddress(id, {
        receiverName: data.name,
        phone: data.phone,
        province: data.province,
        city: data.city,
        district: data.district,
        detail: data.detail,
        isDefault: data.isDefault ? 1 : 0,
      })
      await loadAddresses()
    } catch {}
  }

  async function deleteAddressAction(id) {
    try {
      await apiDeleteAddress(id)
      await loadAddresses()
    } catch {}
  }

  async function setDefaultAction(id) {
    try {
      await apiSetDefault(id)
      await loadAddresses()
    } catch {}
  }

  const getDefault = () => addresses.value.find((a) => a.isDefault)

  async function init() {
    await loadAddresses()
  }

  init()

  return {
    addresses, addAddress, updateAddress: updateAddressAction, deleteAddress: deleteAddressAction,
    setDefault: setDefaultAction, getDefault, loadAddresses,
  }
})
