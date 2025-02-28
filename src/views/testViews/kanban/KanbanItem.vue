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
<script lang="ts">
export default {
  name: 'KanbanItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
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
