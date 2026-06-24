# PetStore 前端设计规范（基于 Chewy）

> 逆向分析自 Chewy.com 的 CSS 变量系统（Chirp Design System）

---

## 🎨 色彩系统 (Color Palette)

### 主色调
```css
/* 文字颜色 */
--color-text-primary: #121212;      /* 主要文字（深黑） */
--color-text-secondary: #4d4d4d;   /* 次要文字（中灰） */

/* 品牌色 */
--color-brand-blue: #1c49c2;       /* Chewy 蓝色（链接、图标） */
--color-brand-orange: #ff6c10;     /* Chewy 橙色（CTA、促销） */

/* 价格色 */
--color-price-primary: #bd2848;    /* 价格/折扣（深红） */
--color-price-sale: #cc0000;       /* 促销价格 */

/* 背景色 */
--color-bg-primary: #ffffff;       /* 主背景（白） */
--color-bg-secondary: #f5f5f5;     /* 区块背景（浅灰） */
--color-bg-card: #ffffff;          /* 卡片背景（白） */

/* 状态色 */
--color-success: #00a651;          /* 成功/完成（绿） */
--color-warning: #ffa500;          /* 警告（橙） */
--color-error: #cc0000;            /* 错误（红） */
```

---

## 🔤 字体系统 (Typography)

### 字体家族
```css
/* 主字体（段落、正文） */
--font-primary: 'Work Sans', 'Verdana', 'Lucida Sans', 
                'Helvetica Neue', 'Arial', 'Roboto', sans-serif;

/* 等宽字体（数据、价格） */
--font-mono: 'Menlo', 'Monaco', 'Courier New', monospace;
```

### 字体大小（基于 rem，1rem = 10px）
```css
/* 标题 */
--text-h1: 3.2rem;    /* 32px - 大标题 */
--text-h2: 2.4rem;    /* 24px - 区块标题 */
--text-h3: 2.0rem;    /* 20px - 卡片标题 */
--text-h4: 1.8rem;    /* 18px - 小标题 */

/* 正文 */
--text-body-lg: 1.8rem;   /* 18px - 大正文 */
--text-body-md: 1.6rem;   /* 16px - 标准正文 */
--text-body-sm: 1.4rem;   /* 14px - 小正文 */

/* 辅助 */
--text-caption: 1.2rem;   /* 12px - 标签、说明 */
--text-small: 1.0rem;     /* 10px - 最小文字 */
```

### 字重
```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 行高
```css
--line-height-tight: 1.2;    /* 标题 */
--line-height-normal: 1.25;  /* 正文 */
--line-height-loose: 1.5;    /* 长文本 */
```

---

## 📏 间距系统 (Spacing)

### 基础单位（8px 网格）
```css
--spacing-1: 0.4rem;   /* 4px */
--spacing-2: 0.8rem;   /* 8px */
--spacing-3: 1.2rem;   /* 12px */
--spacing-4: 1.6rem;   /* 16px */
--spacing-5: 2.0rem;   /* 20px */
--spacing-6: 2.4rem;   /* 24px */
--spacing-8: 3.2rem;   /* 32px */
--spacing-10: 4.0rem;  /* 40px */
--spacing-12: 4.8rem;  /* 48px */
--spacing-16: 6.4rem;  /* 64px */
```

---

## 📐 布局系统 (Layout)

### 容器宽度
```css
--container-max: 1440px;     /* 最大宽度 */
--container-wide: 1200px;    /* 宽屏内容 */
--container-narrow: 960px;   /* 窄屏内容 */
--container-text: 720px;     /* 文本区域 */
```

### 断点 (Breakpoints)
```css
--breakpoint-sm: 576px;    /* 手机竖屏 */
--breakpoint-md: 768px;    /* 手机横屏 */
--breakpoint-lg: 992px;    /* 平板 */
--breakpoint-xl: 1200px;   /* 桌面 */
--breakpoint-2xl: 1400px;  /* 大桌面 */
```

### 网格系统
```css
--grid-columns: 12;
--grid-gutter: 2.4rem;    /* 24px */
```

---

## 🎯 组件样式 (Components)

### 按钮 (Buttons)
```css
/* 主按钮 */
.btn-primary {
  background-color: var(--color-brand-orange);
  color: white;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: 0.4rem;
  font-weight: var(--font-weight-semibold);
  transition: background-color 0.2s ease-in-out;
}

.btn-primary:hover {
  background-color: #e55a00;  /* 深一点的橙色 */
}

/* 次按钮 */
.btn-secondary {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid #ddd;
}

/* 购物车按钮 */
.btn-cart {
  background-color: var(--color-brand-blue);
  padding: var(--spacing-3) var(--spacing-8);
}
```

### 卡片 (Cards)
```css
.card {
  background-color: var(--color-bg-card);
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: var(--spacing-4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 商品卡片 */
.product-card {
  overflow: hidden;
}

.product-card__image {
  border-radius: 0.8rem 0.8rem 0 0;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.product-card__info {
  padding: var(--spacing-4);
}

.product-card__title {
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.product-card__price {
  font-size: var(--text-h4);
  font-weight: var(--font-weight-bold);
  color: var(--color-price-primary);
}
```

### 导航栏 (Header)
```css
.header {
  background-color: var(--color-brand-blue);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header__container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6rem;  /* 60px */
}

.header__search {
  flex: 1;
  max-width: 60rem;
  margin: 0 var(--spacing-8);
}

.header__search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: 0.4rem;
  border: none;
  font-size: var(--text-body-md);
}
```

### 输入框 (Input)
```css
.input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid #ddd;
  border-radius: 0.4rem;
  font-size: var(--text-body-md);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-brand-blue);
  box-shadow: 0 0 0 3px rgba(28, 73, 194, 0.1);
}
```

---

## 🛒 电商特定组件 (E-commerce)

### 价格显示
```css
.price {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
}

.price__current {
  font-size: var(--text-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-price-primary);
}

.price__original {
  font-size: var(--text-body-md);
  color: var(--color-text-secondary);
  text-decoration: line-through;
}

.price__discount {
  font-size: var(--text-caption);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
  background-color: #e6f7ee;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: 0.2rem;
}
```

### 评分星星
```css
.rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.rating__star {
  color: #ffc107;  /* 金色星星 */
  font-size: 1.6rem;
}

.rating__count {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
}
```

### 快速配送标签
```css
.badge-fast-delivery {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--text-caption);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
  background-color: #e6f7ee;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: 0.2rem;
}
```

---

## ✨ 动画和过渡 (Animations)

### 过渡效果
```css
--transition-fast: 0.15s ease-in-out;
--transition-normal: 0.2s ease-in-out;
--transition-slow: 0.3s ease-in-out;
```

### 常用动画
```css
/* 悬停上浮 */
.hover-lift {
  transition: transform var(--transition-normal);
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* 按钮点击 */
.btn:active {
  transform: scale(0.98);
}

/* 渐入动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn var(--transition-normal);
}
```

---

## 📱 响应式策略 (Responsive)

### 移动优先
```css
/* 基础：移动端 */
.container {
  padding: 0 var(--spacing-4);
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-6);
  }
}

/* 桌面 */
@media (min-width: 1200px) {
  .container {
    padding: 0 var(--spacing-8);
  }
}
```

### 商品网格
```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 手机：2列 */
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);  /* 平板：3列 */
  }
}

@media (min-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);  /* 桌面：4列 */
  }
}
```

---

## 🎨 设计原则

### Chewy 风格要点
1. **清晰的视觉层次** - 标题 > 正文 > 辅助文字
2. **一致的间距** - 使用 8px 网格系统
3. **圆角设计** - 0.4rem（按钮）、0.8rem（卡片）
4. **微妙的阴影** - 提升层次感
5. **明确的 CTA** - 橙色按钮突出行动点
6. **友好的颜色** - 橙色（活力）、蓝色（信任）、绿色（成功）

### 不要做的 ❌
- 不要使用纯黑色 (#000000)
- 不要使用过于鲜艳的颜色
- 不要使用复杂的渐变
- 不要使用过多的动画效果
- 不要忽略移动端体验

---

## ✅ 设计检查清单

- [ ] 所有文字颜色符合对比度标准（WCAG AA）
- [ ] 间距使用基础单位的倍数
- [ ] 按钮有明确的 hover/active 状态
- [ ] 图片有合适的 aspect-ratio
- [ ] 移动端适配完整
- [ ] 加载状态有反馈
- [ ] 表单有清晰的错误提示

---

**设计系统版本**: v1.0 (基于 Chewy.com 逆向分析)
**最后更新**: 2026-06-23
