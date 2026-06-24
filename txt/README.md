# PetStore 项目文档索引

> 所有项目文档按类别整理，方便查找和管理

---

## 📁 文档结构

### 01-需求文档/
业务需求和功能规格说明

| 文件 | 说明 |
|------|------|
| [design.txt](01-需求文档/design.txt) | 需求规格说明书（核心功能列表） |
| [totalDesign.txt](01-需求文档/totalDesign.txt) | 完整设计文档（详细业务说明） |

---

### 02-设计规范/
前端 UI 设计系统和规范

| 文件 | 说明 |
|------|------|
| [DESIGN-SYSTEM.md](02-设计规范/DESIGN-SYSTEM.md) | 完整设计规范（Chewy 风格） |
| [DESIGN-CHEATSHEET.md](02-设计规范/DESIGN-CHEATSHEET.md) | 快速参考卡片（开发时查阅） |

---

### 03-开发指南/
页面开发提示词（复制到新会话使用）

#### ✅ 已完成
| 文件 | 功能模块 | 状态 |
|------|----------|------|
| [PRODUCT-LIST-PROMPT.md](03-开发指南/PRODUCT-LIST-PROMPT.md) | 商品列表页 | ✅ 完成 |
| [UI-OPTIMIZATION-PROMPT.md](03-开发指南/UI-OPTIMIZATION-PROMPT.md) | UI优化（去emoji、增加留白） | ✅ 完成 |
| [LAYOUT-FIX-PROMPT.md](03-开发指南/LAYOUT-FIX-PROMPT.md) | 布局修复（留白、宽度） | ✅ 完成 |
| [PRODUCT-DETAIL-PROMPT.md](03-开发指南/PRODUCT-DETAIL-PROMPT.md) | 商品详情页 | ✅ 完成 |
| [HEADER-FIX-PROMPT.md](03-开发指南/HEADER-FIX-PROMPT.md) | Header修复（分类重复） | ✅ 完成 |
| [CART-PAGE-PROMPT.md](03-开发指南/CART-PAGE-PROMPT.md) | 购物车页 | ✅ 完成 |
| [LOGIN-REGISTER-PROMPT.md](03-开发指南/LOGIN-REGISTER-PROMPT.md) | 登录/注册页 + 用户认证 | ✅ 完成 |
| [ORDER-PROMPT.md](03-开发指南/ORDER-PROMPT.md) | 结算页 + 订单管理 | ✅ 完成 |
| [USER-CENTER-PROMPT.md](03-开发指南/USER-CENTER-PROMPT.md) | 个人中心 + 地址管理 | ✅ 完成 |
| [ADMIN-PROMPT.md](03-开发指南/ADMIN-PROMPT.md) | 管理员后台（全功能） | ✅ 完成 |

#### 📝 待开发（扩展功能）
| 文件 | 功能模块 | 状态 |
|------|----------|------|
| [NEARBY-SHOPS-PROMPT.md](03-开发指南/NEARBY-SHOPS-PROMPT.md) | 附近商店（地图浏览） | ⏳ 待开发 |
| [VIDEO-PROMPT.md](03-开发指南/VIDEO-PROMPT.md) | 宠物视频（播放、关联商品） | ⏳ 待开发 |
| [AI-CHAT-PROMPT.md](03-开发指南/AI-CHAT-PROMPT.md) | AI智能问答助手 | ⏳ 待开发 |

---

### 04-参考资料/
外部参考和素材

| 文件/目录 | 说明 |
|-----------|------|
| [chewy-frontend/](04-参考资料/前端参考/) | Chewy 网页截图和资源（设计参考） |
| 程序设计实训内容介绍20260622.pptx | 课程实训要求说明 |

---

## 🚀 开发进度

### 第一阶段：核心浏览功能 ✅

- [x] 商品列表页（网格布局、筛选排序、分页）
- [x] UI优化（去除emoji、增加留白间距）
- [x] 布局修复（左右留白48px、内容宽度1400px、对齐）
- [x] 商品详情页（图片画廊、规格选择、加入购物车）
- [x] Header修复（删除重复分类下拉、图标对齐）
- [x] 购物车页（商品列表、数量修改、结算摘要）

### 第二阶段：用户系统 ✅

- [x] 登录页（用户名密码、记住我、路由守卫）
- [x] 注册页（表单验证、验证码、密码强度）
- [x] 结算页（地址选择、订单确认、提交订单）
- [x] 订单列表页（状态Tab、订单卡片、操作按钮）
- [x] 订单详情页（状态进度、收货信息、订单信息）
- [x] 个人中心（资料编辑、地址管理）

### 第三阶段：扩展功能 📝

- [ ] 附近商店页（地图展示、商店列表、路线导航）
- [ ] 宠物视频页（视频列表、播放器、关联商品）
- [ ] AI智能问答助手（悬浮按钮、聊天窗口、Mock回答）

### 第四阶段：管理后台 ✅

- [x] 管理后台布局（深色侧边栏、顶部栏）
- [x] 数据概览仪表盘
- [x] 商品管理（CRUD、搜索、分页）
- [x] 订单管理（发货、退款处理）
- [x] 用户管理（列表、搜索）
- [x] 商店管理（增删改查、图片上传）
- [x] 视频管理（上传、关联商品）

---

## 🎯 快速导航

### 我要开始新项目
→ 打开 [03-开发指南/PROJECT-KICKSTART.md](03-开发指南/PROJECT-KICKSTART.md)

### 我要继续开发功能
→ 查看上方**开发进度**，选择待开发功能
→ 找到对应的 PROMPT 文档，复制内容到新会话

### 我要查设计规范
→ 打开 [02-设计规范/DESIGN-CHEATSHEET.md](02-设计规范/DESIGN-CHEATSHEET.md)（快速参考）
→ 打开 [02-设计规范/DESIGN-SYSTEM.md](02-设计规范/DESIGN-SYSTEM.md)（详细规范）

### 我要看业务需求
→ 打开 [01-需求文档/design.txt](01-需求文档/design.txt)（功能列表）
→ 打开 [01-需求文档/totalDesign.txt](01-需求文档/totalDesign.txt)（完整说明）

### 我要参考 Chewy 设计
→ 查看 [04-参考资料/前端参考/](04-参考资料/前端参考/) 目录

---

## 🛠️ 技术栈

- **框架**：Vue 3 + Composition API
- **构建**：Vite
- **UI库**：Element Plus
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **HTTP**：Axios
- **样式**：SCSS
- **本地存储**：localStorage（购物车、订单、地址等数据持久化）

---

## 📋 文档使用建议

### 开发前
1. ✅ 阅读 `01-需求文档/` 了解业务需求
2. ✅ 阅读 `02-设计规范/DESIGN-SYSTEM.md` 了解设计规范
3. ✅ 参考 `04-参考资料/前端参考/` 看 Chewy 实际效果

### 开发中
- 📌 手边放一份 `02-设计规范/DESIGN-CHEATSHEET.md` 快速查阅
- 🎨 按照设计规范的颜色、字体、间距开发
- 📱 注意响应式适配

### 新会话启动
- 🚀 复制对应 PROMPT 文档内容到新会话
- 💬 Claude 会自动理解上下文并开始开发

---

## 📂 项目结构（最终）

```
petStore/
├── txt/                            # 文档目录
│   ├── 01-需求文档/
│   ├── 02-设计规范/
│   ├── 03-开发指南/                # PROMPT文档
│   └── 04-参考资料/
│
├── petstore-frontend/              # 前端项目
│   ├── src/
│   │   ├── api/                    # Mock数据
│   │   ├── components/             # 组件
│   │   │   ├── business/           # 业务组件
│   │   │   ├── cart/               # 购物车组件
│   │   │   ├── layout/             # 布局组件
│   │   │   ├── order/              # 订单组件
│   │   │   ├── product/            # 商品组件
│   │   │   └── user/               # 用户组件
│   │   ├── router/                 # 路由
│   │   ├── stores/                 # Pinia Store
│   │   ├── styles/                 # 全局样式
│   │   └── views/                  # 页面
│   │       ├── Home.vue
│   │       ├── auth/               # 登录注册
│   │       ├── product/            # 商品页面
│   │       ├── cart/                # 购物车
│   │       ├── order/               # 订单页面
│   │       ├── user/                # 个人中心
│   │       └── admin/               # 管理后台
│   └── package.json
│
└── petstore-server/                # 后端项目（暂未开发）
```

---

## 📝 注意事项

1. **Mock 数据**：所有数据都是 Mock，无需真实后端
2. **localStorage**：购物车、订单、地址等数据本地持久化
3. **设计一致**：所有页面保持 Chewy 设计风格（蓝色、橙色CTA）
4. **响应式**：支持桌面、平板、手机端
5. **无 emoji**：界面文字不使用 emoji（参考 UI-OPTIMIZATION-PROMPT.md）
6. **留白充足**：避免页面拥挤，参考 DESIGN-SYSTEM.md

---

## 🌿 Git分支

```bash
# 主分支（稳定版本）
main

# 前端重构分支（当前开发）
feature/frontend-ui-refactor
```

---

## 📅 更新日志

### 2026-06-24
- ✅ 完成第一阶段所有页面开发（商品列表、详情、购物车）
- ✅ 完成第二阶段用户系统（登录注册、订单、个人中心）
- ✅ 完成第四阶段管理后台（商品、订单、用户、商店、视频管理）
- ✅ 完成设计规范文档
- ✅ 完成所有核心功能 PROMPT 文档
- 📝 编写第三阶段（扩展功能）文档

---

如有问题，请联系项目负责人。

**祝开发顺利！**
