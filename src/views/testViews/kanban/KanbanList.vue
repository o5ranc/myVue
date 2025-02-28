<template>
  <div class="kanban-list-container">
    <div class="kanban-list-header">
      <div class="kanban-list-header-title">
        <img src="/path/to/profile.jpg" class="profile-image" alt="Profile" />
        <span>Kanban List</span>
      </div>
      <div class="kanban-list-header-button">
        <el-button type="primary">Add</el-button>
      </div>
    </div>
    <div v-for="list in kanbanLists" :key="list.id" class="kanban-list">
      <div class="list-title">{{ list.title }}</div>
      <KanbanItem v-for="item in list.items" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
import KanbanItem from './KanbanItem.vue';
import { ref } from 'vue';

export default {
  name: 'KanbanList',
  components: {
    KanbanItem
  },
  setup() {
    const kanbanLists = ref([
      { id: 1, title: 'To Do', items: [{ title: 'aaa', type: 'A', assignName: '홍길동'}, ] },
      { id: 2, title: 'In Progress', items: [] },
      { id: 3, title: 'Review', items: [] },
      { id: 4, title: 'Done', items: [] }
    ]);

    return {
      kanbanLists
    };
  }
}
</script>