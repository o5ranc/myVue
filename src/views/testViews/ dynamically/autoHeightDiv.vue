<template>
  <div class="input-wrap">
    <div>
      <span>내용입력</span>
      <el-input
        class="mh-50"
        v-model="state.inContent"
      />
    </div>
    <div>
      <button>수정</button>
    </div>
    <div>
      <button>수정</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  inContent: '',
})
</script>

<style scoped>
.input-wrap {
  /* display: flex; */
  /* flex-direction: column; */
  /* gap: 10px; */
  width: 600px;
  background-color: beige;
  padding: 20px;
}
</style>
