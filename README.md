# PetStore 宠物用品商城

基于 Vue 3 + Spring Boot 的前后端分离宠物用品电商系统，课程实训项目。

## 技术栈

**前端** `petstore-frontend/`
- Vue 3 + Composition API + Vite
- Element Plus UI 组件库
- Pinia 状态管理
- Vue Router 路由
- 高德地图 JS API 2.0（附近商店）

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

## 功能模块

| 模块 | 说明 |
|------|------|
| 首页 | 轮播图、热门商品、分类导航、附近商店入口 |
| 商品 | 列表（筛选/排序/分页）、详情（收藏、加购） |
| 购物车 | 数量修改、规格选择、全选/反选 |
| 订单 | 下单确认、订单列表、订单详情、取消/评价 |
| 用户 | 登录注册、个人资料、收货地址（省市区三级联动） |
| 附近商店 | 高德地图定位、POI 搜索、距离过滤（50km） |
| 宠物视频 | 分类浏览、渐变封面、播放器弹窗 |
| 收藏 | 商品收藏/取消（localStorage） |
| 管理后台 | 商品管理、订单管理（发货/退款）、用户管理 |

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
│   │   └── views/              # 页面组件
│   └── vite.config.js
├── petstore-server/            # Spring Boot 后端
│   └── src/main/java/com/petstore/
│       ├── controller/         # REST 接口
│       ├── entity/             # JPA 实体
│       ├── repository/         # 数据访问层
│       └── service/            # 业务逻辑层
├── start.bat                   # Windows 一键启动
└── stop.bat                    # Windows 一键停止
```

## 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | admin123 |
| 普通用户 | user1 | 123456 |
