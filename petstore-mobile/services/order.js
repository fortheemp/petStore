import { get, post, fixImageUrl } from './request'
import { useUserStore } from '../stores/user'

const STATUS_MAP = {
  0: { text: '待付款', color: '#ff6c10' },
  1: { text: '待发货', color: '#1c49c2' },
  2: { text: '待收货', color: '#1c49c2' },
  3: { text: '待评价', color: '#999999' },
  4: { text: '已完成', color: '#52c41a' },
  '-1': { text: '已取消', color: '#999999' },
  '-2': { text: '退款申请中', color: '#ff4d4f' },
  '-3': { text: '退款成功', color: '#52c41a' },
  '-4': { text: '管理员退单', color: '#ff4d4f' },
}

function adaptOrder(order, items = [], reviewed = false) {
  const status = Number(order.status)
  const info = STATUS_MAP[String(status)] || { text: '未知', color: '#999999' }
  const goodsTotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0), 0)

  return {
    id: order.id,
    orderNo: `PS${String(order.id).padStart(6, '0')}`,
    status,
    statusText: info.text,
    statusColor: info.color,
    items: items.map((item) => ({
      productId: item.productId,
      name: item.productName || `商品#${item.productId}`,
      price: Number(item.price) || 0,
      quantity: item.quantity || 1,
      image: fixImageUrl(item.productImage),
    })),
    goodsTotal,
    freight: 0,
    totalPrice: Number(order.totalAmount) || goodsTotal,
    createTime: order.createdAt || '',
    address: order.addressSnapshot ? JSON.parse(order.addressSnapshot) : null,
    reviewed,
    refundReason: order.refundReason || '',
  }
}

function getUserId() {
  return useUserStore().user?.id
}

export async function createOrder(data) {
  const userId = getUserId()
  const res = await post('/orders', data, { params: { userId } })
  return adaptOrder(res)
}

export async function getOrderList() {
  const userId = getUserId()
  const res = await get('/orders', { userId })
  const list = Array.isArray(res) ? res : []
  // 后端 list 不含 items，逐个获取明细（与 PC 端逻辑一致）
  const enriched = await Promise.all(list.map(async (o) => {
    let items = []
    try {
      const detail = await getOrderDetail(o.id)
      items = Array.isArray(detail?.items) ? detail.items : []
    } catch (e) { console.error('getOrderList detail error:', o.id, e) }
    const adaptedItems = items.map((it) => ({
      productId: it.productId,
      name: it.name || `商品#${it.productId}`,
      price: Number(it.price) || 0,
      quantity: it.quantity || 1,
      image: it.image || '',
      spec: it.spec || '',
    }))
    return {
      ...o,
      orderNo: `PS${String(o.id).padStart(8, '0')}`,
      createTime: o.createdAt,
      payAmount: Number(o.totalAmount) || 0,
      status: Number(o.status),
      reviewed: !!o.reviewed,
      items: adaptedItems,
    }
  }))
  return enriched
}

export async function getOrderDetail(id) {
  const res = await get(`/orders/${id}`)
  if (!res) return null
  const order = res.order || res
  const items = res.items || []
  return adaptOrder(order, items, res.reviewed || false)
}

export async function payOrder(id) {
  return post(`/orders/${id}/pay`)
}

export async function cancelOrder(id, data) {
  return post(`/orders/${id}/cancel`, data || {})
}

export async function confirmOrder(id) {
  return post(`/orders/${id}/confirm`)
}

export async function refundOrder(id, data) {
  return post(`/orders/${id}/refund`, data || {})
}

export async function reviewOrder(id, data) {
  return post(`/orders/${id}/review`, data)
}
