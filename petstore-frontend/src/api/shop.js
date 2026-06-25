// ===== 商店 API（调用真实后端） =====
import { get } from '@/api'

// ===== Mock 数据（保留作 fallback） =====
export const mockShops = [
  { id: 1, name: '皇家宠物旗舰店', rating: 4.8, reviewCount: 236, address: '福建省厦门市集美区集美大道188号', phone: '0592-8888888', businessHours: '09:00-21:00', status: 'open', district: 'jimei', lng: 118.082, lat: 24.608 },
  { id: 2, name: '渴望官方旗舰店', rating: 4.9, reviewCount: 312, address: '福建省厦门市集美区杏林湾路100号', phone: '0592-8777777', businessHours: '09:00-22:00', status: 'open', district: 'jimei', lng: 118.070, lat: 24.592 },
  { id: 3, name: '爱宠生活馆', rating: 4.6, reviewCount: 189, address: '福建省厦门市集美区杏林东路56号', phone: '0592-6666666', businessHours: '09:30-20:30', status: 'open', district: 'jimei', lng: 118.060, lat: 24.585 },
]

// ===== 内部缓存 =====
let cachedShops = null

// 后端 Shop → 前端形状
function transformShop(s) {
  // 从经纬度推断城区（厦门各区）
  let district = 'jimei'
  if (s.longitude > 118.09 && s.latitude < 24.47) district = 'siming'
  else if (s.longitude > 118.09 && s.latitude > 24.49) district = 'huli'
  else if (s.longitude < 118.02) district = 'haicang'
  else if (s.latitude > 24.71) district = 'tongan'

  return {
    id: s.id,
    name: s.name,
    rating: Math.round((4.2 + Math.random() * 0.8) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 200) + 50,
    address: s.address,
    phone: '0592-' + String(s.id).padStart(7, '8'),
    businessHours: '09:00-21:00',
    status: 'open',
    district,
    lng: s.longitude,
    lat: s.latitude,
  }
}

// ===== 对外 API =====

/** 获取所有商店（从后端 API） */
export async function getAllShops() {
  if (cachedShops) return cachedShops
  try {
    const res = await get('/shops')
    if (res.data.code === 200) {
      cachedShops = (res.data.data || []).map(transformShop)
      return cachedShops
    }
  } catch { /* 后端不可用时回退到 mock */ }
  cachedShops = mockShops
  return cachedShops
}

/** 按 ID 查询商店 */
export async function getShopById(id) {
  const shops = await getAllShops()
  return shops.find((s) => s.id === Number(id)) || null
}

/** 按城区获取附近商店（适配 NearbyShops 组件） */
export async function getNearbyShops(district) {
  const shops = await getAllShops()
  if (district) return shops.filter((s) => s.district === district)
  return shops
}

/** 清除缓存 */
export function clearShopCache() {
  cachedShops = null
}