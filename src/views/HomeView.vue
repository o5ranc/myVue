<template>
  <div class="home">
    <h2>테스트 화면 목록</h2>
    <p>왼쪽 메뉴나 아래 목록에서 화면을 고르면 오른쪽 영역에 표시됩니다.</p>
    <section
      v-for="group in screenMenu"
      :key="group.path"
      class="group"
    >
      <h3>{{ group.title }}</h3>
      <ul>
        <li
          v-for="item in group.children"
          :key="item.path"
        >
          <router-link :to="fullPath(group, item)">{{ item.title }}</router-link>
          <code>src/{{ item.file }}</code>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { fullPath, screenMenu } from '@/router/menu'
</script>

<style scoped>
.group {
  margin-top: 20px;
}

li {
  margin: 6px 0;
}

code {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}
</style>
