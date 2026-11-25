<template>
  <div id="app">
    <!-- <ProductList /> -->
    <!-- <ShoppingCart /> -->
    <!-- <TestView /> -->
    <ElTableUiTestView />
    <!-- <ChartTestView /> -->
    <!-- <SourceView /> -->
    <!-- <CardListView/> -->
    <!-- <SourceTreeView /> -->
    <!-- <KanbanList /> -->
    <!-- <PostitView /> -->
    <!-- <BranchLintList /> -->
    <!-- <MemberSelector /> -->
    <!-- <StickyHeader /> -->
    <!-- <AlignTextView /> -->
    <!-- <SpinnerBorder /> -->
    <!-- <SourceView></SourceView> -->
  </div>
</template>

<script setup lang="ts">
// <script setup>에서는 import한 컴포넌트를 components 옵션에 등록하지 않아도 템플릿에서 바로 쓸 수 있습니다.
// 화면을 바꾸려면 아래 import 한 줄과 템플릿의 태그 한 줄만 주석을 옮기면 됩니다.
import { ref } from 'vue'
// import { storeToRefs } from 'pinia'
// import { useCounterStore } from '@/stores/counter'
// import ProductList from './components/ProductList.vue'
// import ShoppingCart from './components/ShoppingCart.vue'
// import TestView from './views/testViews/testView.vue'
import ElTableUiTestView from './views/testViews/ElTableUiTestView.vue'
// import ChartTestView from './views/testViews/ChartTestView.vue'
// import SourceView from './views/testViews/SourceView.vue'
// import CardListView from './views/testViews/CardListView.vue'
// import SourceTreeView from './views/testViews/SourceTreeView.vue'
// import KanbanList from './views/testViews/kanban/KanbanList.vue'
// import PostitView from './views/alert/PostitView.vue'
// import BranchLintList from './views/testViews/BranchLintList.vue'
// import MemberSelector from './components/MemberSelector.vue'
// import ElTabTestView from './views/testViews/ElTabTestView.vue'
// import StickyHeader from './views/testViews/dynamically/StickyHeader.vue'
// import AlignTextView from './views/testViews/Align/AlignTextView.vue'
// import SpinnerBorder from './views/testViews/SpinnerBorder.vue'

interface MenuItem {
  name: string
  path: string
}

// 사이드바 메뉴용 상태 (아직 템플릿에서는 사용하지 않음)
const isMenuOpen = ref(true)
const menuItems = ref<MenuItem[]>([
  { name: 'Home', path: '/' },
  { name: 'Test1', path: '/test1' },
  { name: 'Test2', path: '/test2' },
  // 실제 파일들에 맞게 추가해주세요
])

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100vh;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background-color: #f1f1f1;
  padding: 20px;
  width: 250px;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar.closed {
  width: 50px;
}

.toggle-button {
  position: absolute;
  right: -20px;
  top: 20px;
  background: #f1f1f1;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 0 5px 5px 0;
}

.menu-item {
  display: block;
  padding: 10px;
  color: #333;
  text-decoration: none;
  margin-bottom: 5px;
  border-radius: 5px;
}

.menu-item:hover {
  background-color: #e0e0e0;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.sidebar.closed .menu-item {
  display: none;
}

.router-link-active {
  background-color: #e0e0e0;
  font-weight: bold;
}
</style>
