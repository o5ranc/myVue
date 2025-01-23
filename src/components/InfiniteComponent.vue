<template>
  <div class="main-container">
    <div class="numbers-container">
      <div class="number-column"
        v-for="(numArray, i) in state.numbers"
        :key="'column-' + i"
        :style="{ width: `${100 / state.numbers.length}%` }">
        <div class="infinite-container">
          <div v-for="(item, idx) in numArray" 
            :key="'item-' + idx"
            class="number-item">
            {{ item }}
          </div>
          <div
          :ref="el => observers[i] = el"
          class="observer"
        ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  props: {
    selectIndex: Number,
  },

  setup() {
    const observers = ref<(HTMLElement | null)[]>([])
    const state = reactive({
      numbers: [
        Array.from({ length: 10 }, (_, i) => i + 1),
        Array.from({ length: 10 }, (_, i) => i + 1),
        Array.from({ length: 10 }, (_, i) => i + 1),
      ],
      pages: [1, 1, 1], // 각 컬럼별 페이지 관리
    })

    const loadMore = (columnIndex: number) => {
        console.log('@@@ loadMore columnIndex : ', columnIndex)
      const nextPage = state.pages[columnIndex] + 1
      const startNum = state.numbers[columnIndex].length + 1
      const newNumbers = Array.from({ length: 10 }, (_, i) => startNum + i)
      state.numbers[columnIndex].push(...newNumbers)
      state.pages[columnIndex] = nextPage
    }

    const intersectionObservers: IntersectionObserver[] = []

    onMounted(() => {
      state.numbers.forEach((_, index) => {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadMore(index)
            }
          },
          { threshold: 0.5 }
        )

        if (observers.value[index]) {
          observer.observe(observers.value[index]!)
        }

        intersectionObservers.push(observer)
      })
    })

    onUnmounted(() => {
      intersectionObservers.forEach(observer => {
        observer.disconnect()
      })
    })

    return {
      state,
      observers,
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

.observer {
  height: 20px;
}
</style>
