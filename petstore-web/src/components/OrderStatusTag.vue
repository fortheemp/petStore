<template>
  <el-tag :type="tagType" :class="['order-status-tag', `status-${status}`]" size="default" effect="plain">
    {{ statusText }}
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: Number,
    required: true
  }
})

const STATUS_MAP = {
  '-4': { text: '管理员退单', type: 'danger' },
  '-3': { text: '退单成功', type: 'danger' },
  '-2': { text: '退单申请中', type: 'warning' },
  '-1': { text: '已取消', type: 'danger' },
  0: { text: '待支付', type: 'warning' },
  1: { text: '待发货', type: 'info' },
  2: { text: '待收货', type: '' },
  3: { text: '待评价', type: 'success' },
  4: { text: '已完成', type: '' }
}

const statusText = computed(() => {
  return STATUS_MAP[props.status]?.text || '未知状态'
})

const tagType = computed(() => {
  return STATUS_MAP[props.status]?.type || 'info'
})
</script>

<style scoped>
.order-status-tag {
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
}

.status--4.order-status-tag,
.status--3.order-status-tag,
.status--1.order-status-tag {
  border-color: #f56c6c;
}

.status--2.order-status-tag,
.status-0.order-status-tag {
  border-color: #e6a23c;
}

.status-1.order-status-tag {
  border-color: #909399;
}

.status-2.order-status-tag {
  border-color: #409eff;
}

.status-3.order-status-tag {
  border-color: #67c23a;
}

.status-4.order-status-tag {
  border-color: #c0c4cc;
}
</style>