# 个人中心页开发提示词

> 将此提示词复制到新的 Claude Code 会话中，开发个人中心页

---

## 📋 任务目标

开发 PetStore 宠物商店的**个人中心页**，包括个人信息展示/编辑、收货地址管理、订单快捷入口。

---

## 🎯 当前项目状态

### 已完成
- ✅ 登录/注册页、路由守卫、Pinia User Store
- ✅ 订单列表/详情页
- ✅ Header 登录状态切换

### 待开发
- ❌ 个人中心首页 `/user/profile`
- ❌ 个人信息编辑
- ❌ 收货地址管理 `/user/address`
- ❌ 个人中心侧边栏导航

---

## 🎨 设计规范

**重要**：请先阅读 `txt/02-设计规范/DESIGN-SYSTEM.md`

### 核心色彩
```css
品牌蓝：#1c49c2（链接、选中）
品牌橙：#ff6c10（CTA）
成功绿：#00a651（已选中地址）
背景：#f8f9fa
卡片：#ffffff
```

---

## 📐 页面结构设计

### 1. 个人中心整体布局

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │              │  │                                  │ │
│  │  用户头像    │  │  右侧内容区域                    │ │
│  │  用户昵称    │  │                                  │ │
│  │  会员等级    │  │  （根据左侧菜单切换）            │ │
│  │              │  │                                  │ │
│  ├──────────────┤  │                                  │ │
│  │              │  │                                  │ │
│  │ [个人资料]   │  │                                  │ │
│  │ [收货地址]   │  │                                  │ │
│  │ [我的订单]   │  │                                  │ │
│  │ [我的收藏]   │  │                                  │ │
│  │ [修改密码]   │  │                                  │ │
│  │              │  │                                  │ │
│  └──────────────┘  └──────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. 个人资料页 /user/profile

```
┌─────────────────────────────────────────────────────────┐
│  个人资料                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  头像                                              │  │
│  │  ┌─────────┐                                       │  │
│  │  │  [头像] │  [修改头像]                           │  │
│  │  └─────────┘                                       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  基本信息                                          │  │
│  │                                                   │  │
│  │  用户名      张三宠宠                               │  │
│  │  昵称        [        ]                            │  │
│  │  性别        [●] 男  [○] 女  [○] 保密             │  │
│  │  手机号      138****8888                           │  │
│  │  邮箱        [        ]                            │  │
│  │                                                   │  │
│  │                     [ 保存修改 ]                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3. 收货地址管理 /user/address

```
┌─────────────────────────────────────────────────────────┐
│  收货地址管理                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [+ 新增收货地址]                                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  张三  138****8888              [默认] [编辑][删除]│  │
│  │  广东省广州市天河区xxx路xxx号xxx小区xxx栋xxx房     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  李四  159****6666              [设为默认][编辑][删除]│ │
│  │  广东省深圳市南山区xxx路xxx号                       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4. 新增/编辑地址弹窗

```
┌─────────────────────────────────────┐
│  新增收货地址               [x]     │
├─────────────────────────────────────┤
│                                     │
│  收货人    [          ]             │
│                                     │
│  手机号    [          ]             │
│                                     │
│  所在地区  [省] [市] [区]           │
│                                     │
│  详细地址  [                    ]   │
│            [                    ]   │
│                                     │
│  [☑] 设为默认收货地址               │
│                                     │
│         [取消]  [保存]              │
│                                     │
└─────────────────────────────────────┘
```

---

## 🧩 组件拆分

### 页面组件
- **UserProfile.vue** (`src/views/user/UserProfile.vue`)
- **AddressManage.vue** (`src/views/user/AddressManage.vue`)

### 子组件
- UserSidebar.vue - 左侧导航
- ProfileForm.vue - 个人信息表单
- AddressCard.vue - 地址卡片
- AddressDialog.vue - 新增/编辑地址弹窗

---

## 📝 功能需求清单

### 个人中心布局 P0
- [ ] 左右布局（侧边栏 + 内容区）
- [ ] 侧边栏显示用户头像、昵称
- [ ] 侧边栏菜单（个人资料、收货地址、我的订单、我的收藏）
- [ ] 右侧内容区切换
- [ ] 路由 `/user/profile`、`/user/address`

### 个人资料 P0
- [ ] 展示当前用户头像
- [ ] 展示用户名（不可修改）
- [ ] 展示手机号（不可修改，部分隐藏）
- [ ] 可修改：昵称、性别、邮箱
- [ ] 保存修改

### 收货地址管理 P0
- [ ] 地址列表展示
- [ ] 新增地址（弹窗表单）
- [ ] 编辑地址（弹窗表单）
- [ ] 删除地址（二次确认）
- [ ] 设为默认地址
- [ ] 默认地址标识

### 收货地址表单验证 P0
- [ ] 收货人必填
- [ ] 手机号格式验证
- [ ] 所在地区必选
- [ ] 详细地址必填

---

## 🔧 技术实现要点

### 1. 路由配置
```typescript
// src/router/routes.ts

{
  path: '/user',
  name: 'User',
  component: () => import('@/views/user/UserLayout.vue'),
  meta: { requireAuth: true },
  children: [
    {
      path: 'profile',
      name: 'UserProfile',
      component: () => import('@/views/user/UserProfile.vue'),
      meta: { title: '个人中心' }
    },
    {
      path: 'address',
      name: 'AddressManage',
      component: () => import('@/views/user/AddressManage.vue'),
      meta: { title: '收货地址' }
    },
    {
      path: 'orders',
      name: 'OrderList',
      component: () => import('@/views/order/OrderList.vue'),
      meta: { title: '我的订单' }
    }
  ]
}
```

### 2. Pinia Address Store
```typescript
// src/stores/address.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Address {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export const useAddressStore = defineStore('address', () => {
  const addresses = ref<Address[]>([
    {
      id: 1,
      name: '张三',
      phone: '13888888888',
      province: '广东省',
      city: '广州市',
      district: '天河区',
      detail: 'xxx路xxx号xxx小区xxx栋xxx房',
      isDefault: true
    },
    {
      id: 2,
      name: '李四',
      phone: '15966666666',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: 'xxx路xxx号',
      isDefault: false
    }
  ])

  const init = () => {
    const saved = localStorage.getItem('addresses')
    if (saved) {
      addresses.value = JSON.parse(saved)
    }
  }

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newId = Math.max(...addresses.value.map(a => a.id), 0) + 1
    addresses.value.push({ ...address, id: newId })
    if (address.isDefault) {
      setDefault(newId)
    }
    saveToStorage()
  }

  const updateAddress = (id: number, data: Partial<Address>) => {
    const index = addresses.value.findIndex(a => a.id === id)
    if (index >= 0) {
      addresses.value[index] = { ...addresses.value[index], ...data }
      if (data.isDefault) {
        setDefault(id)
      }
      saveToStorage()
    }
  }

  const deleteAddress = (id: number) => {
    const index = addresses.value.findIndex(a => a.id === id)
    if (index >= 0) {
      addresses.value.splice(index, 1)
      saveToStorage()
    }
  }

  const setDefault = (id: number) => {
    addresses.value.forEach(a => {
      a.isDefault = a.id === id
    })
    saveToStorage()
  }

  const getDefault = () => {
    return addresses.value.find(a => a.isDefault)
  }

  const saveToStorage = () => {
    localStorage.setItem('addresses', JSON.stringify(addresses.value))
  }

  return {
    addresses,
    init,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    getDefault
  }
})
```

### 3. 用户信息更新
```typescript
// src/views/user/UserProfile.vue

import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const profileForm = ref({
  nickname: userStore.userInfo?.nickname || '',
  gender: userStore.userInfo?.gender || 'secret',
  email: userStore.userInfo?.email || ''
})

const handleSave = () => {
  userStore.updateUserInfo({
    nickname: profileForm.value.nickname,
    gender: profileForm.value.gender,
    email: profileForm.value.email
  })
  ElMessage.success('保存成功')
}
```

---

## 🎨 样式示例

### 个人中心布局
```scss
.user-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 48px;
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
  }

  // 侧边栏
  &__sidebar {
    width: 240px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow: hidden;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  // 内容区
  &__content {
    flex: 1;
    min-width: 0;
  }
}
```

### 侧边栏
```scss
.user-sidebar {
  &__user {
    padding: 32px 24px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }

  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #f8f9fa;
    margin: 0 auto 12px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__nickname {
    font-size: 16px;
    font-weight: 600;
    color: #121212;
  }

  &__menu {
    padding: 12px 0;
  }

  &__menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    font-size: 15px;
    color: #666;
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      background: #f8f9fa;
      color: #1c49c2;
    }

    &.active {
      color: #1c49c2;
      background: #f0f6ff;
      font-weight: 600;
    }
  }
}
```

### 地址卡片
```scss
.address-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  &.default {
    border-color: #1c49c2;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    color: #121212;
  }

  &__phone {
    font-size: 14px;
    color: #666;
  }

  &__badge {
    background: #1c49c2;
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  &__address {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }

  &__btn {
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &.default-btn {
      background: #fff;
      border: 1px solid #ddd;
      color: #666;

      &:hover {
        border-color: #1c49c2;
        color: #1c49c2;
      }
    }

    &.edit-btn {
      background: #fff;
      border: 1px solid #ddd;
      color: #666;

      &:hover {
        border-color: #1c49c2;
        color: #1c49c2;
      }
    }

    &.delete-btn {
      background: #fff;
      border: 1px solid #ddd;
      color: #e74c3c;

      &:hover {
        background: #fff5f5;
        border-color: #e74c3c;
      }
    }
  }
}
```

---

## 📂 参考文件
1. `txt/02-设计规范/DESIGN-SYSTEM.md`
2. `src/stores/user.ts` - 用户 Store
3. `src/router/index.ts` - 路由配置

---

## ✅ 验收标准

### 个人中心布局
- [ ] 左右布局正常
- [ ] 侧边栏显示头像、昵称
- [ ] 菜单切换正常
- [ ] 路由 `/user/profile`、`/user/address` 正常

### 个人资料
- [ ] 展示用户名（不可改）
- [ ] 展示手机号（部分隐藏）
- [ ] 可修改昵称、性别、邮箱
- [ ] 保存成功提示

### 收货地址
- [ ] 地址列表展示正常
- [ ] 新增地址表单验证
- [ ] 编辑地址正常
- [ ] 删除地址二次确认
- [ ] 设为默认地址正常
- [ ] 默认标识显示

---

## 💬 启动指令示例

```
开发 PetStore 的个人中心和收货地址管理。

当前状态：
- 登录功能已完成
- 订单功能已完成
- 需要个人中心查看/修改信息
- 需要管理收货地址

请先：
1. 阅读 txt/02-设计规范/DESIGN-SYSTEM.md
2. 创建 Pinia Address Store
3. 配置路由 /user/profile、/user/address、/user/orders
4. 实现 UserLayout.vue（左右布局）
5. 实现个人资料页
6. 实现收货地址管理页
7. 实现新增/编辑地址弹窗

设计风格参考 Chewy.com，留白充足，不要emoji。
```

---

**祝开发顺利！**
