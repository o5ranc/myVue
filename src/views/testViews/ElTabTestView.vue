<template>
  <div class="tab-container">
    <h1>ElTabTestView</h1>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" tab-position="left" class="custom-tabs">
      <el-tab-pane label="User" name="first">User</el-tab-pane>
      <el-tab-pane label="Config" name="second">Config</el-tab-pane>
      <el-tab-pane label="Role" name="third">Role</el-tab-pane>
      <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeName = ref('first')
const handleClick = (tab: any, event: any) => {
  console.log(tab, event)
}
</script>

<style scoped>
.tab-container {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.tab-container h1 {
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.custom-tabs {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  height: 600px; /* 고정 높이 설정 */
  display: flex;
}

/* 탭 헤더 스타일링 */
:deep(.el-tabs__header) {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  margin: 0;
  padding: 0;
  width: 200px; /* 탭 헤더 너비 고정 */
  flex-shrink: 0;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0;
  height: 100%; /* 전체 높이 사용 */
}

:deep(.el-tabs__nav) {
  border: none;
  height: 100%; /* 전체 높이 사용 */
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__item) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0; /* 패딩 제거 */
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  height: 25%; /* 4개 탭이므로 각각 25% 높이 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

:deep(.el-tabs__item:hover) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateX(5px);
}

:deep(.el-tabs__item.is-active) {
  background: white;
  color: #f5576c;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

:deep(.el-tabs__item.is-active::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

/* 탭 콘텐츠 영역 스타일링 */
:deep(.el-tabs__content) {
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  flex: 1; /* 남은 공간 모두 사용 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤 */
}

:deep(.el-tab-pane) {
  color: #2c3e50;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* 활성 탭 콘텐츠 강조 */
:deep(.el-tab-pane.is-active) {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .tab-container {
    padding: 10px;
  }
  
  .tab-container h1 {
    font-size: 2rem;
  }
  
  .custom-tabs {
    height: 500px;
    flex-direction: column;
  }
  
  :deep(.el-tabs__header) {
    width: 100%;
    height: auto;
  }
  
  :deep(.el-tabs__nav) {
    flex-direction: row;
    height: auto;
  }
  
  :deep(.el-tabs__item) {
    height: 60px;
    width: 25%;
    font-size: 0.9rem;
  }
  
  :deep(.el-tabs__content) {
    padding: 20px;
  }
}
</style>