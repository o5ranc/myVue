<template>
  <div class="main-container">
    <div class="numbers-container">
      <div class="number-column"
        v-for="(numArray, i) in state.numbers"
        :key="'column-' + i"
        :style="{ width: `${100 / state.numbers.length}%` }">
        <div class="infinite-container"
          @scroll="handleScroll($event, i)"
          :ref="el => scrollContainers[i] = el">
          <div v-for="(item, idx) in numArray" 
            :key="'item-' + idx"
            class="number-item">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted, watch } from 'vue'

export default defineComponent({
  props: {
    selectIndex: Number,
  },

  setup() {
    const scrollContainers = ref<(HTMLElement | null)[]>([])
    const state = reactive({
      numbers: [
        Array.from({ length: 10 }, (_, i) => i + 1),
        Array.from({ length: 10 }, (_, i) => i + 1),
        Array.from({ length: 10 }, (_, i) => i + 1),
      ],
      pages: [] as number[],
    })

    // numbers 배열 길이에 맞춰 pages 초기화
    state.pages = Array(state.numbers.length).fill(1)

    watch(
      () => state.numbers.length,
      (newLength) => {
        state.pages = Array(newLength).fill(1)
      }
    )

    const loadMore = (columnIndex: number) => {
      const nextPage = state.pages[columnIndex] + 1
      const startNum = state.numbers[columnIndex].length + 1
      const newNumbers = Array.from({ length: 10 }, (_, i) => startNum + i)
      state.numbers[columnIndex].push(...newNumbers)
      state.pages[columnIndex] = nextPage
    }

    const handleScroll = (event: Event, columnIndex: number) => {
      const container = event.target as HTMLElement
      const scrollPosition = container.scrollTop + container.clientHeight
      const totalHeight = container.scrollHeight
      
      // 스크롤이 하단에서 50px 이내일 때 새로운 데이터 로드
      if (totalHeight - scrollPosition < 50) {
        loadMore(columnIndex)
      }
    }

    return {
      state,
      scrollContainers,
      handleScroll,
    }
  },
})
</script>

<style scoped>
.main-container {
  width: 100%;
}

.numbers-container {
  display: flex;
  width: 100%;
}

.number-column {
  padding: 0 10px;
}

.infinite-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.number-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
</style>
