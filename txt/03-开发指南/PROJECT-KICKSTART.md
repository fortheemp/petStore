# PetStore 前端重构项目启动提示词

> 将此提示词复制到新的 Claude Code 会话中，即可开始前端开发

---

## 📋 项目背景

我们要重构宠物商店（PetStore）系统的前端，这是一个前后端分离的项目。后端 API 已有 demo（在 `.petstore-server-hidden/` 目录，可参考），我们现在要从零开始构建全新的前端界面。

**设计参考**：Chewy.com（美国最大宠物电商），已提取其设计系统到 `DESIGN-SYSTEM.md` 和 `DESIGN-CHEATSHEET.md`

---

## 🎯 核心需求

### 用户角色
1. **游客** - 浏览商店、商品、视频，不能购买
2. **会员** - 注册登录后，可购买商品、管理订单、评价
3. **管理员** - 管理商店、商品、视频、会员、订单

### 基础功能（必须实现）
1. ✅ 用户注册/登录
2. ✅ 个人中心（信息管理、收货地址）
3. ✅ 首页展示（推荐商品、搜索）
4. ✅ 商店浏览（列表、详情）
5. ✅ 商品浏览（列表、详情、分类）
6. ✅ 购物车
7. ✅ 订单管理（完整状态流转）
8. ✅ 管理后台（商店/商品/订单/会员管理）

---

## 🎨 设计规范（Chewy 风格）

**重要**：请先阅读 `DESIGN-SYSTEM.md` 和 `DESIGN-CHEATSHEET.md` 了解完整设计规范

### 核心设计元素

#### 色彩
```
品牌蓝：#1c49c2（导航、链接、图标）
品牌橙：#ff6c10（CTA按钮、促销）
价格红：#bd2848（价格显示）
成功绿：#00a651（成功状态、快速配送）
背景：#ffffff（主背景）、#f5f5f5（区块背景）
文字：#121212（主文字）、#4d4d4d（次文字）
```

#### 字体
```
主字体：Work Sans（或 fallback 到 sans-serif）
正文：16px / 400字重
标题：20-32px / 600-700字重
```

#### 间距（8px 网格）
```
基础单位：4px (0.4rem)
常用：8px, 12px, 16px, 24px, 32px, 48px
```

#### 圆角
```
按钮：4px
卡片：8px
输入框：4px
```

#### 阴影
```
卡片：0 2px 8px rgba(0,0,0,0.08)
卡片hover：0 4px 16px rgba(0,0,0,0.12)
弹窗：0 8px 24px rgba(0,0,0,0.16)
```

#### 动画
```
过渡时间：0.2s ease-in-out
按钮点击：scale(0.98)
卡片hover：translateY(-2px)
```

---

## 🛠️ 技术栈

### 核心框架
- **Vue 3** + Composition API
- **Vite** 构建工具
- **Vue Router 4** 路由管理
- **Pinia** 状态管理

### UI 组件库
- **Element Plus** - 基础 UI 组件
- **@element-plus/icons-vue** - 图标库

### HTTP 请求
- **Axios** - API 请求

### 工具库
- **dayjs** - 日期处理
- **lodash-es** - 工具函数（按需引入）

### 开发工具
- **ESLint** + **Prettier** - 代码规范
- **TypeScript**（可选，推荐）

---

## 📁 推荐项目结构

```
petstore-web/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── api/                    # API 接口层
│   │   ├── index.ts           # axios 封装
│   │   ├── user.ts            # 用户相关 API
│   │   ├── product.ts         # 商品相关 API
│   │   ├── order.ts           # 订单相关 API
│   │   └── ...
│   │
│   ├── assets/                 # 静态资源
│   │   ├── images/            # 图片
│   │   └── styles/            # 全局样式
│   │       ├── variables.scss # CSS 变量（Chewy 设计系统）
│   │       ├── mixins.scss    # 常用 mixin
│   │       ├── base.scss      # 基础样式
│   │       └── index.scss     # 样式入口
│   │
│   ├── components/             # 公共组件
│   │   ├── layout/            # 布局组件
│   │   │   ├── Header.vue     # 顶部导航
│   │   │   ├── Footer.vue     # 底部
│   │   │   └── Layout.vue     # 整体布局
│   │   ├── common/            # 通用组件
│   │   │   ├── ProductCard.vue # 商品卡片
│   │   │   ├── PriceTag.vue   # 价格标签
│   │   │   ├── Rating.vue     # 评分组件
│   │   │   └── ...
│   │   └── business/          # 业务组件
│   │       ├── CartDrawer.vue # 购物车抽屉
│   │       └── ...
│   │
│   ├── composables/            # 组合式函数
│   │   ├── useAuth.ts         # 认证逻辑
│   │   ├── useCart.ts         # 购物车逻辑
│   │   └── ...
│   │
│   ├── stores/                 # Pinia 状态管理
│   │   ├── user.ts            # 用户状态
│   │   ├── cart.ts            # 购物车状态
│   │   └── ...
│   │
│   ├── router/                 # 路由配置
│   │   ├── index.ts           # 路由入口
│   │   ├── routes.ts          # 路由定义
│   │   └── guards.ts          # 路由守卫
│   │
│   ├── types/                  # TypeScript 类型定义
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── ...
│   │
│   ├── utils/                  # 工具函数
│   │   ├── storage.ts         # 本地存储
│   │   ├── format.ts          # 格式化函数
│   │   └── ...
│   │
│   ├── views/                  # 页面组件
│   │   ├── home/              # 首页
│   │   │   └── index.vue
│   │   ├── auth/              # 认证页面
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── product/           # 商品页面
│   │   │   ├── ProductList.vue
│   │   │   └── ProductDetail.vue
│   │   ├── shop/              # 商店页面
│   │   │   ├── ShopList.vue
│   │   │   └── ShopDetail.vue
│   │   ├── cart/              # 购物车页面
│   │   │   └── index.vue
│   │   ├── order/             # 订单页面
│   │   │   ├── OrderList.vue
│   │   │   └── OrderDetail.vue
│   │   ├── user/              # 用户中心
│   │   │   ├── Profile.vue
│   │   │   ├── Address.vue
│   │   │   └── ...
│   │   └── admin/             # 管理后台
│   │       ├── Dashboard.vue
│   │       ├── ShopManage.vue
│   │       ├── ProductManage.vue
│   │       ├── OrderManage.vue
│   │       └── UserManage.vue
│   │
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
│
├── .env                        # 环境变量
├── .env.development            # 开发环境
├── .env.production             # 生产环境
├── .eslintrc.cjs               # ESLint 配置
├── .prettierrc                 # Prettier 配置
├── index.html                  # HTML 模板
├── package.json                # 依赖配置
├── tsconfig.json               # TypeScript 配置（如果使用 TS）
└── vite.config.js              # Vite 配置
```

---

## 🚀 开发顺序建议

### 第一阶段：基础搭建（Day 1）
1. ✅ 初始化项目（Vite + Vue 3）
2. ✅ 安装依赖（Element Plus、Vue Router、Pinia、Axios）
3. ✅ 配置设计系统（CSS 变量、全局样式）
4. ✅ 搭建基础布局（Header、Footer、Layout）
5. ✅ 配置路由框架

### 第二阶段：核心页面（Day 2-3）
1. ✅ 首页（商品推荐、搜索、分类导航）
2. ✅ 用户认证（登录、注册）
3. ✅ 商品列表页（筛选、排序、分页）
4. ✅ 商品详情页（图片轮播、规格选择、加购物车）

### 第三阶段：购物功能（Day 4-5）
1. ✅ 购物车页面（商品列表、数量修改、删除）
2. ✅ 结算流程（选择地址、确认订单）
3. ✅ 订单列表（状态筛选、分页）
4. ✅ 订单详情（状态流转、操作按钮）

### 第四阶段：用户中心（Day 6）
1. ✅ 个人信息管理
2. ✅ 收货地址管理
3. ✅ 我的订单、收藏、评价

### 第五阶段：管理后台（Day 7-8）
1. ✅ 管理后台布局
2. ✅ 商店管理（CRUD）
3. ✅ 商品管理（CRUD、图片上传）
4. ✅ 订单管理（状态修改、退单审核）
5. ✅ 会员管理（列表、禁用）

### 第六阶段：优化完善（Day 9-10）
1. ✅ 响应式适配
2. ✅ 加载状态、错误处理
3. ✅ 表单验证
4. ✅ 性能优化
5. ✅ 测试和修复

---

## ⚠️ 关键注意事项

### 1. 设计还原度
- **严格按照 Chewy 设计规范**
- 使用 CSS 变量管理设计 token
- 保持一致的间距、圆角、阴影
- 参考 DESIGN-SYSTEM.md 和 DESIGN-CHEATSHEET.md

### 2. 代码质量
- 使用 Composition API + `<script setup>`
- 组件职责单一，避免过大组件
- 提取公共逻辑到 composables
- 使用 TypeScript（推荐）或 JSDoc 注释

### 3. 状态管理
- 用户信息、token → Pinia store + localStorage
- 购物车 → Pinia store（可选持久化）
- 全局配置 → Pinia store

### 4. API 设计
- 封装 axios 实例，统一处理：
  - 请求拦截（添加 token）
  - 响应拦截（错误处理、token 过期）
  - 基础 URL 配置（环境变量）
- API 按模块拆分（user.ts, product.ts, order.ts）

### 5. 路由设计
- 使用嵌套路由管理后台
- 路由守卫处理权限（游客、会员、管理员）
- 路由懒加载优化性能

### 6. 组件设计
- 基础组件：直接用 Element Plus
- 业务组件：封装可复用的业务组件（ProductCard、PriceTag 等）
- 布局组件：Header、Footer、Sidebar、Layout

---

## 📚 参考文档

在开始开发前，请先阅读以下文件：
1. `DESIGN-SYSTEM.md` - 完整设计规范
2. `DESIGN-CHEATSHEET.md` - 快速参考卡片
3. `totalDesign.txt` - 业务需求文档

---

## 💬 启动指令示例

新会话开始时，可以这样说：

```
我们开始开发 PetStore 前端项目。

项目背景：
- 这是一个宠物商店电商系统
- 设计风格参考 Chewy.com（美国宠物电商）
- 技术栈：Vue 3 + Element Plus + Vite

请先：
1. 阅读 DESIGN-SYSTEM.md 了解设计规范
2. 初始化 Vue 3 + Vite 项目
3. 安装必要依赖
4. 搭建基础布局和路由框架

我们从首页开始开发。
```

---

## 🎯 成功标准

### 功能完整性
- ✅ 所有基础功能可正常使用
- ✅ 用户体验流畅
- ✅ 响应式适配（手机、平板、桌面）

### 设计还原度
- ✅ 符合 Chewy 设计风格
- ✅ 色彩、字体、间距一致
- ✅ 交互细节完善

### 代码质量
- ✅ 组件结构清晰
- ✅ 无明显 bug
- ✅ 性能良好

---

**祝开发顺利！🐾**
