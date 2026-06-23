<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="220px" class="admin-sidebar">
        <div class="sidebar-header">
          <h2>🐾 后台管理</h2>
        </div>
        <el-menu :default-active="activeMenu" router background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
          <el-menu-item index="/admin/shops"><el-icon><Shop /></el-icon> 商店管理</el-menu-item>
          <el-menu-item index="/admin/products"><el-icon><Goods /></el-icon> 商品管理</el-menu-item>
          <el-menu-item index="/admin/videos"><el-icon><VideoCamera /></el-icon> 视频管理</el-menu-item>
          <el-menu-item index="/admin/users"><el-icon><User /></el-icon> 用户管理</el-menu-item>
          <el-menu-item index="/admin/orders"><el-icon><Document /></el-icon> 订单管理</el-menu-item>
        </el-menu>
        <div class="sidebar-footer">
          <el-button type="info" @click="$router.push('/')" size="small" style="width:100%">返回前台</el-button>
        </div>
      </el-aside>
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.admin-layout { min-height: 100vh; }
.admin-sidebar { background: #304156; min-height: 100vh; display: flex; flex-direction: column; }
.sidebar-header { padding: 20px; text-align: center; }
.sidebar-header h2 { color: #fff; font-size: 20px; }
.sidebar-footer { padding: 16px; margin-top: auto; }
.admin-main { background: #f5f7fa; padding: 20px; }
</style>