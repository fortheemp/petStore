# PetStore 宠物用品商城 — 发行版

基于 Vue 3 + Spring Boot + uni-app 的全平台宠物用品电商系统。

## 快速启动

### Windows 一键启动

```bash
start.bat
```

### 手动启动

```bash
cd petstore-server
mvn spring-boot:run
```

启动后访问：
- 前端页面：`http://localhost:8080`
- 管理后台：`http://localhost:8080/admin`

## 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | admin123 |
| 普通用户 | user1 | 123456 |

## 移动端

包含打包好的 APK，可直接安装到 Android 手机。

## 技术栈

- **前端**：Vue 3 + Element Plus + Vite
- **移动端**：uni-app (Vue 3)
- **后端**：Spring Boot 2.7 + Spring Data JPA + SQLite

## 停止服务

```bash
stop.bat
```
