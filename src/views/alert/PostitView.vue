<template>
  <div>
    <h1>PostitView</h1>
    <div v-for="postit in postitList" :key="postit.id">
      <div class="postit-container">
        <div class="postit-content-container">
          <div class="postit-content"
            :class="postit.title === 'before' ? 'before' : postit.title === 'ing' ? 'ing' : 'complete'">
            <span>{{ postit.content }}</span>
          </div>
          <div class="postit-right"
            :class="postit.title === 'before' ? 'before-end' : postit.title === 'ing' ? 'ing-end' : 'complete-end'">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const postitList = ref([
  { id: 1, title: 'before', content: '작성전' },
  { id: 2, title: 'ing', content: '작성중' },
  { id: 3, title: 'complete', content: '제출완료' },
]);
</script>

<style scoped>
.postit-container {
  width: 100px;
  margin-bottom: 20px;
  position: relative;
}

.postit-content-container {
  position: relative;
  display: flex;
  width: 130px; /* Added width to include both content and right part */
  box-shadow: 3px 4px 8px -6px #333;
}

.postit-content {
  width: 100px;
  height: 35px;
  background-color: transparent;
  text-align: center;
  align-content: center;
  /* padding: 10px; */
}

.postit-content::before {
  content: '';
  height: 50px;
  display: block;
  position: absolute;
  left: 0px;
  top: -17%;
  border: 1px solid #EDEEEF;
}
/* .postit-content::after {
  content: '';
  width: 30px;
  height: 100%;
  display: block;
  background-color: transparent;
  position: absolute;
  left: 100px;
  top: 0;
} */
.postit-right {
  width: 30px;
  height: 35px;
  display: block;
  background-color: transparent;
}

.before { background-color: #F5AD9E !important; }
.ing { background-color: #FFECB9 !important; }
.complete { background-color: #BCDDAE !important; }
.before-end { background-color: #EA5852 !important; }
.ing-end { background-color: #FCCC26 !important; }
.complete-end { background-color: #60B85D !important; }
</style>
