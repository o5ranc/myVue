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
    <div><img src="/images/icons/pencil.svg" alt="pencil icon" /></div>
      <div><img src="/images/icons/send-check.svg" alt="send check icon" /></div>
      <div><img src="/images/icons/send-fill.svg" alt="send fill icon" /></div>
      현재 : {{ moment(state.now).format('YYYY-MM-DD') }}<br/>
      한달전 : {{ moment(state.onePre).format('YYYY-MM-DD') }}<br/>
      두달전 : {{ moment(state.twoPre).format('YYYY-MM-DD') }}<br/>
      세달전 : {{ moment(state.threePre).format('YYYY-MM-DD') }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import moment from 'moment';

const postitList = ref([
  { id: 1, title: 'before', content: '작성전' },
  { id: 2, title: 'ing', content: '작성중' },
  { id: 3, title: 'complete', content: '제출완료' },
]);

const state = reactive({
  now: new Date(),
  onePre: new Date(),
  twoPre: new Date(),
  threePre: new Date(),
})

onMounted(() => {
  let now = moment();  // 현재 날짜를 moment 객체로 생성
  
  // moment.js의 subtract 메서드를 사용하여 각 날짜 계산
  state.now = now.toDate();
  state.onePre = now.clone().subtract(1, 'months').toDate();
  state.twoPre = now.clone().subtract(2, 'months').toDate();
  state.threePre = now.clone().subtract(3, 'months').toDate();
})

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
