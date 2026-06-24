<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AIChat from '@/components/ai/AIChat.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div class="app-layout">
    <AppHeader v-if="!isAdmin" />
    <main class="main-content" :class="{ 'main-content--admin': isAdmin }">
      <router-view />
    </main>
    <AppFooter v-if="!isAdmin" />
    <AIChat v-if="!isAdmin" />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.main-content--admin {
  display: flex;
  flex-direction: column;
}
</style>
