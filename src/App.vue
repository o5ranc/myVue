<template>
  <!-- 화면 구성은 라우터가 맡습니다: '/' → layouts/MainLayout.vue (왼쪽 메뉴 + 오른쪽 화면) -->
  <!-- 화면 목록은 src/router/menu.ts에 있습니다 -->
  <router-view />
</template>

<script setup lang="ts"></script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
