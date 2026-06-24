# UI优化提示词 - 去除Emoji + 增加留白

> 将此提示词复制到新的 Claude Code 会话，优化商品列表页的UI

---

## 📋 优化任务

优化 PetStore 商品列表页的UI，解决两个问题：
1. **去除所有Emoji** - 显得不专业
2. **增加留白** - 当前太拥挤，缺乏呼吸感

---

## 🎨 设计原则

### Chewy 风格的留白哲学
参考 Chewy.com 的设计特点：
- ✅ **大量留白** - 内容"漂浮"在空间中
- ✅ **克制使用装饰** - 不用emoji，用图标或纯文字
- ✅ **清晰的视觉层次** - 通过间距和大小区分
- ✅ **内容居中，两侧留空** - 给眼睛休息的地方

---

## 🔧 具体修改清单

### 1. 去除所有Emoji

#### 分类名称
```
❌ 🐶 狗狗 → ✅ 狗狗
❌ 🐱 猫猫 → ✅ 猫猫
❌ 🐟 水族 → ✅ 水族
❌ 🐹 小宠 → ✅ 小宠
❌ 🐦 飞禽 → ✅ 飞禽
```

#### 商品标题
```
❌ 🐾 皇家小型犬成犬粮 → ✅ 皇家小型犬成犬粮
❌ 🎀 宠物蝴蝶结项圈 → ✅ 宠物蝴蝶结项圈
```

#### 按钮文字
```
❌ 🛒 加入购物车 → ✅ 加入购物车
❌ ❤️ 收藏 → ✅ 收藏
❌ 📦 立即购买 → ✅ 立即购买
```

#### 状态/标签
```
❌ ⭐ 4.8 → ✅ 4.8 (用星星图标或评分条)
❌ 🔥 热卖 → ✅ 热卖
❌ 🆕 新品 → ✅ 新品
```

---

### 2. 增加留白和呼吸感

#### 页面整体
```scss
// 页面容器
.page-container {
  max-width: 1400px;  // 最大宽度限制
  margin: 0 auto;      // 居中
  padding: 0 48px;     // 两侧留白 (desktop)
  
  @media (max-width: 768px) {
    padding: 0 24px;   // 移动端减少
  }
}

// 页面顶部间距
.page-header {
  margin-bottom: 48px;  // 标题区域与内容间距
}
```

#### 面包屑导航
```scss
.breadcrumb {
  margin-bottom: 24px;  // 与标题间距
  font-size: 14px;
  color: #666;
}
```

#### 页面标题
```scss
.page-title {
  margin-bottom: 32px;  // 标题与筛选栏间距
  font-size: 28px;
  font-weight: 700;
  
  .product-count {
    font-size: 16px;
    font-weight: 400;
    color: #666;
    margin-left: 12px;
  }
}
```

#### 筛选栏
```scss
.filter-bar {
  margin-bottom: 40px;  // 筛选栏与商品网格间距
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;  // 分割线
}
```

#### 商品网格
```scss
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;  // 增加卡片间距 (原24px)
  margin-bottom: 48px;  // 网格与分页间距
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
```

#### 商品卡片
```scss
.product-card {
  background: #fff;
  border-radius: 12px;  // 增加圆角
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);  // 更柔和的阴影
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);  // 增加上浮距离
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  &__image-wrapper {
    padding: 16px;  // 图片周围留白
    background: #f8f9fa;  // 浅灰背景
    
    img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: contain;  // 改为 contain，不要裁剪
      border-radius: 8px;
    }
  }
  
  &__info {
    padding: 20px;  // 增加内边距 (原16px)
  }
  
  &__title {
    font-size: 15px;  // 稍微减小
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;  // 增加间距
    line-height: 1.4;  // 增加行高
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 42px;  // 固定标题高度，保持对齐
  }
  
  &__rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
    font-size: 13px;
    color: #666;
    
    .rating-stars {
      display: flex;
      gap: 2px;
      
      .star {
        color: #ffc107;
        font-size: 14px;
      }
      
      .star-empty {
        color: #ddd;
      }
    }
    
    .rating-count {
      color: #999;
    }
  }
  
  &__price {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 16px;
    
    .price-current {
      font-size: 22px;  // 增大价格字号
      font-weight: 700;
      color: #bd2848;
    }
    
    .price-original {
      font-size: 14px;
      color: #999;
      text-decoration: line-through;
    }
    
    .price-discount {
      font-size: 12px;
      color: #00a651;
      background: #e6f7ee;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }
  
  &__shop {
    font-size: 12px;
    color: #999;
    margin-bottom: 16px;
  }
  
  &__actions {
    .btn-add-cart {
      width: 100%;
      padding: 12px;
      background: #ff6c10;
      color: #fff;
      border: none;
      border-radius: 8px;  // 增加圆角
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: #e55a00;
        transform: scale(1.02);  // 轻微放大
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
  }
}
```

#### 分页组件
```scss
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 48px;  // 增加顶部间距
  margin-bottom: 64px;  // 增加底部间距
  
  // Element Plus 分页样式覆盖
  .el-pagination {
    --el-pagination-font-size: 15px;
    --el-pagination-button-bg-color: #fff;
    --el-pagination-hover-color: #ff6c10;
  }
}
```

---

### 3. 视觉分隔和层次

#### 使用背景色区分区域
```scss
// 页面背景
.page-product-list {
  background: #f5f5f5;
  min-height: 100vh;
  padding-top: 24px;
}

// 内容区域白色背景
.content-wrapper {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
}
```

#### 使用分割线
```scss
// 筛选栏底部分割线
.filter-section {
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid #eee;
}

// 或使用阴影分隔
.content-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}
```

---

## 📐 间距速查表

### 页面级间距
```
页面两侧留白：48px (desktop) / 24px (mobile)
区块之间：48px
标题与内容：32px
筛选栏与网格：40px
网格与分页：48px
页面底部：64px
```

### 组件级间距
```
卡片间距：32px
卡片内边距：20px
图片区域内边距：16px
标题与评分：12px
评分与价格：12px
价格与按钮：16px
```

### 文字间距
```
行高：1.4-1.6
段落间距：12px
列表项间距：8px
```

---

## 🎨 对比参考

### Before (当前问题)
```
❌ Emoji满天飞
❌ 卡片紧贴，没有呼吸
❌ 内容铺满屏幕
❌ 视觉层次混乱
❌ 看起来很业余
```

### After (优化后)
```
✅ 纯文字，专业克制
✅ 充足留白，内容呼吸
✅ 居中布局，两侧留空
✅ 清晰层次，引导明确
✅ Chewy 风格，电商专业感
```

---

## ✅ 验收标准

### Emoji 清理
- [ ] 分类名称无emoji
- [ ] 商品标题无emoji
- [ ] 按钮文字无emoji
- [ ] 状态标签无emoji
- [ ] 可以用 Element Plus 图标替代（如有需要）

### 留白检查
- [ ] 页面两侧有充足留白 (≥24px)
- [ ] 卡片间距 ≥32px
- [ ] 卡片内边距 ≥20px
- [ ] 各区块之间有明显间距 (≥40px)
- [ ] 不会觉得"挤在一起"

### 视觉层次
- [ ] 有背景色区分不同区域
- [ ] 有分割线或阴影分隔内容
- [ ] 标题、正文、辅助文字大小分明
- [ ] 重要内容突出，次要内容弱化

### 整体感觉
- [ ] 看起来专业（像真正的电商网站）
- [ ] 有呼吸感，不压抑
- [ ] 信息清晰，易于浏览
- [ ] 符合 Chewy 的设计风格

---

## 💬 启动指令

```
优化商品列表页的UI：

1. 去除所有emoji（分类、商品标题、按钮）
2. 增加留白（页面边距、卡片间距、内边距）
3. 参考 Chewy 风格，让页面有呼吸感
4. 保持专业电商的感觉

具体修改：
- 分类名称：🐶狗狗 → 狗狗
- 卡片间距：24px → 32px
- 卡片内边距：16px → 20px
- 页面两侧留白：48px
- 增加背景色和分割线分隔区域
```

---

## 📚 参考

开发前阅读：
- `txt/02-设计规范/DESIGN-SYSTEM.md` - 留白和间距规范
- `txt/04-参考资料/前端参考/` - Chewy 实际页面参考

---

**优化完成后，页面应该看起来像真正的 Chewy 宠物电商，而不是学生项目！** 🎯
