# Header UI 修复提示词

> 修复 Header 图标位置和添加促销条

---

## 📋 问题描述

### 问题1：图标位置不对
```
当前：Logo | 搜索栏 | 管理员 购物车  ← 图标在搜索栏旁边
期望：Logo | 搜索栏 |         管理员 购物车  ← 图标靠右对齐
```

### 问题2：缺少促销条
```
当前：没有促销信息
期望：像 Chewy 一样有绿色背景的滚动促销条
```

---

## 🔧 修复方案

### 修复1：Header图标靠右

**文件**：`src/components/layout/AppHeader.vue`

**CSS修改**：
```scss
.header__main-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;  /* 关键：两端对齐 */
  width: 100%;
}
```

**效果**：Logo和搜索栏在左，图标操作区在右

---

### 修复2：添加绿色促销条

**文件**：`src/components/layout/AppHeader.vue`

**在主导航栏上方添加**：
```vue
<!-- 促销信息条 -->
<div class="header__promo">
  <div class="container">
    新用户首单满99减20，全场满199包邮
  </div>
</div>
```

**CSS**：
```scss
.header__promo {
  background: linear-gradient(135deg, #e6f9ee 0%, #d1f0d9 100%);
  color: #00a651;
  text-align: center;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
}
```

---

## 📝 完整代码

### AppHeader.vue 模板修改

```vue
<template>
  <header class="header">
    <!-- 顶部信息栏 -->
    <div class="header__top-bar">...</div>

    <!-- 新增：促销信息条 -->
    <div class="header__promo">
      <div class="container">
        新用户首单满99减20，全场满199包邮
      </div>
    </div>

    <!-- 主导航栏 -->
    <div class="header__main">
      <div class="container header__main-inner">
        <router-link to="/" class="header__logo">...</router-link>
        <div class="header__search">...</div>
        <div class="header__actions">...</div>
      </div>
    </div>

    <!-- 分类导航栏 -->
    <nav class="header__nav">...</nav>
  </header>
</template>
```

### AppHeader.vue 样式修改

```scss
/* 修改：主导航栏内部布局 */
.header__main-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* 新增：促销信息条 */
.header__promo {
  background: linear-gradient(135deg, #e6f9ee 0%, #d1f0d9 100%);
  color: #00a651;
  text-align: center;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
}
```

---

## ✅ 验收标准

### 图标对齐
- [ ] Logo 在最左边
- [ ] 搜索栏在中间（占据剩余空间）
- [ ] 管理员/登录图标在最右边
- [ ] 购物车图标在最右边

### 促销条
- [ ] 绿色渐变背景
- [ ] 文字居中显示
- [ ] 在主导航栏上方
- [ ] 不影响其他布局

### 整体效果
- [ ] 像 Chewy 专业电商风格
- [ ] 层次清晰（顶部信息 → 促销条 → Logo搜索 → 分类导航）

---

## 📂 参考文件

- `src/components/layout/AppHeader.vue` - 需要修改的文件
- 设计参考：Chewy.com Header 布局

---

## 💬 启动指令

```
修复 PetStore Header 的两个UI问题：

1. 图标位置：
   - 当前：管理员和购物车图标在搜索栏右边（紧挨着）
   - 期望：图标应该靠右对齐，与搜索栏分开
   - 修改：.header__main-inner 添加 justify-content: space-between

2. 添加促销条：
   - 在主导航栏上方添加绿色促销条
   - 背景：绿色渐变
   - 文字：新用户首单满99减20，全场满199包邮

参考 Chewy.com 的 Header 设计风格。
```

---

**修复完成后效果会更专业！**
