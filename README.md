# PetStore 宠物用品商城

基于 Vue 3 + Spring Boot + uni-app 的全平台宠物用品电商系统，课程实训项目。

## 技术栈

**前端** `petstore-frontend/`
- Vue 3 + Composition API + Vite
- Element Plus UI 组件库
- Pinia 状态管理
- Vue Router 路由
- 高德地图 JS API 2.0（附近商店）

**移动端** `petstore-mobile/`
- uni-app (Vue 3)
- 多端适配（H5 / 微信小程序 / App）

**后端** `petstore-server/`
- Spring Boot 2.7
- Spring Data JPA + SQLite
- RESTful API

## 快速启动

### 后端

```bash
cd petstore-server
mvn spring-boot:run
# 启动后访问 http://localhost:8080
```

首次启动自动建表并导入种子数据（含测试商品、商店、视频）。

### 前端

```bash
cd petstore-frontend
npm install
npm run dev
# 启动后访问 http://localhost:5173
```

Vite 已配置代理，开发环境自动转发 `/api` 到后端 8080 端口。

### 一键启动（Windows）

```bash
start.bat   # 同时启动前后端
stop.bat    # 停止所有服务
```

### 外网访问（内网穿透）

通过 frp 将本地服务暴露到外网，详见 `部署注意.md`。

| 隧道 | 远程端口 | 本地端口 | 说明 |
|------|---------|---------|------|
| petstore_web | 46077 | 5173 | 前端页面 |
| petstore_api | 53577 | 8080 | API 接口（移动端用） |

## 功能模块

### 用户端
| 模块 | 说明 |
|------|------|
| 首页 | 轮播图、热门商品、分类导航、附近商店入口 |
| 商品 | 列表（分类/子分类/品牌/价格/评分筛选、排序、分页、搜索）、详情（收藏、加购、评价展示） |
| 购物车 | 数量修改、库存校验、全选/反选、缺货提示 |
| 订单 | 下单确认（地址选择、库存校验）、订单列表、订单详情、取消/退款申请/评价 |
| 用户 | 登录注册（支持手机号）、个人资料编辑、收货地址管理（省市区三级联动） |
| 附近商店 | 高德地图定位、POI 搜索、距离过滤（50km） |
| 宠物视频 | 分类浏览、封面图展示、播放器弹窗 |
| 收藏 | 商品收藏/取消 |

### 管理后台
| 模块 | 说明 |
|------|------|
| 数据概览 | 销售额、订单数、用户数等统计 |
| 商品管理 | 新增/编辑（含子分类）/删除商品 |
| 订单管理 | 发货、同意退款、拒绝退款（含拒绝理由）、直接退单（含退单理由） |
| 用户管理 | 用户列表、删除用户 |
| 视频管理 | 新增/编辑（含封面上传）/删除视频 |

## 项目结构

```
petStore/
├── petstore-frontend/          # Vue 3 前端
│   ├── src/
│   │   ├── api/                # 各模块 API 封装
│   │   ├── components/         # 公共组件（ProductCard、AppHeader）
│   │   ├── data/               # 静态数据（省市区）
│   │   ├── router/             # 路由配置
│   │   ├── stores/             # Pinia 状态管理
│   │   └── views/              # 页面组件（user/admin/product/order/video/shop）
│   └── vite.config.js
├── petstore-mobile/            # uni-app 移动端
│   ├── pages/                  # 页面
│   ├── services/               # API 封装
│   └── static/                 # 静态资源
├── petstore-server/            # Spring Boot 后端
│   └── src/main/java/com/petstore/
│       ├── config/             # 配置（数据库迁移）
│       ├── controller/         # REST 接口
│       ├── dto/                # 数据传输对象
│       ├── entity/             # JPA 实体
│       ├── repository/         # 数据访问层
│       └── service/            # 业务逻辑层
├── deploy.bat                  # 一键构建部署
├── start.bat                   # Windows 一键启动
└── stop.bat                    # Windows 一键停止
```

## 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | admin123 |
| 普通用户 | user1 | 123456 |
