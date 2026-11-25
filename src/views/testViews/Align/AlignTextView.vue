<template>
  <div class="container">
    <div class="front">123123123123</div>
    <div class="d-flex flex-row">
      <div class="d-flex flex-row min-width-0">
        <div class="title">변경 사유</div>
        <span class="min-width-0" style="flex: 1 1 0;">{{ reason }}</span>
      </div>
      <div class="d-flex flex-row min-width-0">
        <div class="title">배포 사유</div>
        <span class="min-width-0" style="flex: 1 1 0;">{{ reason2 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const reason = ref('일정변경 아하하하 우히히히 오호호호호호호')
const reason2 = ref('배포 아하하하 우히히히 오호호호호호호 배포배포배포배 포배포변경 아하하하 우히히히 오호호호호호호')
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}

.front {
  background-color: #f0f0f0;
  width: 100px;
}

.items {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-width: 0;
}

.item {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.title {
  width: 130px;
  font-weight: bold;
  font-size: 1.1em;
  padding: 10px;
  flex-shrink: 0;
}

.item-content {
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
  padding: 10px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
}
</style>