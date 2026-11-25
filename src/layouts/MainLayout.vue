<template>
  <div class="main-layout">
    <aside class="sidebar">
      <router-link
        to="/"
        class="sidebar-title"
      >
        MyVue 테스트 화면
      </router-link>
      <!-- router 속성: 메뉴 항목의 index(경로)로 바로 이동합니다 -->
      <el-menu
        router
        :default-active="route.path"
        :default-openeds="openedGroups"
        class="sidebar-menu"
      >
        <!-- 1depth: 화면 종류 -->
        <el-sub-menu
          v-for="group in screenMenu"
          :key="group.path"
          :index="group.path"
        >
          <template #title>{{ group.title }}</template>
          <!-- 2depth: 각 화면 -->
          <el-menu-item
            v-for="item in group.children"
            :key="item.path"
            :index="fullPath(group, item)"
          >
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <main class="content">
      <header
        v-if="route.meta.file"
        class="content-header"
      >
        <span class="breadcrumb">{{ route.meta.group }} / {{ route.meta.title }}</span>
        <code class="file-path">src/{{ route.meta.file }}</code>
      </header>
      <div class="content-body">
        <!-- 선택한 메뉴의 화면이 여기에 그려집니다 -->
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { fullPath, screenMenu } from '@/router/menu'

const route = useRoute()

// 처음에는 모든 1depth 메뉴를 펼쳐 둡니다
const openedGroups = screenMenu.map((group) => group.path)
</script>

<style scoped>
.main-layout {
  /* 메뉴 폭. position: fixed를 쓰는 화면(StickyHeader)도 이 값을 참고합니다 */
  --layout-sidebar-width: 240px;
  display: flex;
  min-height: 100vh;
}

/* 스크롤은 창(window) 전체로 둡니다. StickyHeader처럼 window 스크롤을 쓰는 화면도 그대로 동작합니다 */
.sidebar {
  position: sticky;
  top: 0;
  flex: 0 0 var(--layout-sidebar-width);
  height: 100vh;
  overflow-y: auto;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
}

.sidebar-title {
  display: block;
  padding: 18px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  border-bottom: 1px solid #e4e7ed;
}

.sidebar-menu {
  border-right: none;
}

.content {
  flex: 1;
  /* flex 자식이 내용 폭만큼 늘어나 가로로 넘치지 않도록 */
  min-width: 0;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  font-size: 13px;
}

.breadcrumb {
  font-weight: bold;
}

.file-path {
  color: #909399;
}

.content-body {
  padding: 20px;
}
</style>
