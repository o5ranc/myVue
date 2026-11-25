<template>
  <div class="kanban-item">
    <div class="kanban-item-header">
      <img src="/path/to/profile.jpg" class="profile-image" alt="Profile" />
      <span>Kanban Item</span>
    </div>
    <div class="kanban-item-content">
      <p>{{ item.content }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { KanbanCard } from './types'

defineProps<{
  item: KanbanCard
}>()
</script>

<style scoped>
.kanban-item {
  width: 300px;
  height: 100px;
  padding: 10px;
  border: 1px solid #645555;
  border-radius: 5px;
}S
.kanban-item-header {
  height: 70px;
} 
.kanban-item-content {
  height: 150px;
}
</style>
