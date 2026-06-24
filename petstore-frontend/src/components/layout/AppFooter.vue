<script setup>
const footerLinks = {
  shop: {
    title: '购物指南',
    items: [
      { label: '狗狗用品', href: '#' },
      { label: '猫咪用品', href: '#' },
      { label: '水族用品', href: '#' },
      { label: '小宠用品', href: '#' },
      { label: '新品上市', href: '#' },
    ],
  },
  support: {
    title: '客户服务',
    items: [
      { label: '帮助中心', href: '#' },
      { label: '配送说明', href: '#' },
      { label: '退换货政策', href: '#' },
      { label: '订单追踪', href: '#' },
      { label: '联系我们', href: '#' },
    ],
  },
  about: {
    title: '关于我们',
    items: [
      { label: '公司介绍', href: '#' },
      { label: '加入我们', href: '#' },
      { label: '品牌合作', href: '#' },
      { label: '用户协议', href: '#' },
      { label: '隐私政策', href: '#' },
    ],
  },
}
</script>

<template>
  <footer class="footer">
    <!-- 主要内容区 -->
    <div class="footer__main">
      <div class="container footer__grid">
        <!-- 品牌信息 -->
        <div class="footer__brand">
          <div class="footer__logo">
            <span class="footer__logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-.5 3-1.5c.5-.5 1-1 1.5-1.5"/>
                <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-.5-3-1.5c-.5-.5-1-1-1.5-1.5"/>
                <path d="M8 14v.5M16 14v.5"/>
                <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
                <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a13.152 13.152 0 0 0-.42-3.31"/>
              </svg>
            </span>
            <span class="footer__logo-text">PetStore</span>
          </div>
          <p class="footer__desc">
            您值得信赖的宠物用品商城，为毛孩子提供优质食品、玩具和生活用品。
          </p>
          <div class="footer__social">
            <a href="#" class="footer__social-link" title="微信">
              <el-icon :size="20"><ChatDotRound /></el-icon>
            </a>
            <a href="#" class="footer__social-link" title="微博">
              <el-icon :size="20"><Promotion /></el-icon>
            </a>
            <a href="#" class="footer__social-link" title="抖音">
              <el-icon :size="20"><VideoCamera /></el-icon>
            </a>
          </div>
        </div>

        <!-- 链接列 -->
        <div
          v-for="(section, key) in footerLinks"
          :key="key"
          class="footer__links-section"
        >
          <h4 class="footer__links-title">{{ section.title }}</h4>
          <ul class="footer__links-list">
            <li v-for="item in section.items" :key="item.label">
              <a :href="item.href" class="footer__link">{{ item.label }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 底部版权栏 -->
    <div class="footer__bottom">
      <div class="container footer__bottom-inner">
        <p class="footer__copyright">
          © 2026 PetStore 宠物用品商城. All rights reserved.
        </p>
        <div class="footer__badges">
          <span class="footer__badge">
            <el-icon><Lock /></el-icon> 安全支付
          </span>
          <span class="footer__badge">
            <el-icon><Van /></el-icon> 闪电发货
          </span>
          <span class="footer__badge">
            <el-icon><CircleCheck /></el-icon> 正品保证
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-bg-secondary);
  margin-top: var(--spacing-16);
}

/* ========== 主要内容区 ========== */
.footer__main {
  padding: var(--spacing-12) 0;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: var(--spacing-10);
}

/* 品牌 */
.footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.footer__logo-icon {
  display: flex;
  align-items: center;
  color: var(--color-brand-blue);
}

.footer__logo-text {
  font-size: var(--text-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-brand-blue);
}

.footer__desc {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  max-width: 28rem;
}

.footer__social {
  display: flex;
  gap: var(--spacing-3);
}

.footer__social-link {
  width: 3.6rem;
  height: 3.6rem;
  border-radius: var(--radius-full);
  background-color: var(--color-bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.footer__social-link:hover {
  color: var(--color-brand-blue);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 链接列 */
.footer__links-title {
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.footer__links-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.footer__link {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer__link:hover {
  color: var(--color-brand-blue);
}

/* ========== 底部版权栏 ========== */
.footer__bottom {
  border-top: 1px solid var(--color-border-light);
  padding: var(--spacing-4) 0;
}

.footer__bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer__copyright {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

.footer__badges {
  display: flex;
  gap: var(--spacing-4);
}

.footer__badge {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }

  .footer__bottom-inner {
    flex-direction: column;
    gap: var(--spacing-3);
    text-align: center;
  }

  .footer__badges {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
