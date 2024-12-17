<template>
  <div class="infinite-container">
    <div
      v-for="num in state.numbers"
      :key="num"
      class="number-item"
    >
      {{ num }}
    </div>
    <div
      ref="observer"
      class="observer"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  props: {
    selectIndex: Number,
  },

  setup() {
    const observer = ref<HTMLElement | null>(null)
    const state = reactive({
      numbers: Array.from({ length: 10 }, (_, i) => i + 1),
      page: 1,
    })

    const loadMore = () => {
      const nextPage = state.page + 1
      const startNum = state.numbers.length + 1
      const newNumbers = Array.from({ length: 10 }, (_, i) => startNum + i)
      state.numbers.push(...newNumbers)
      state.page = nextPage
    }

    let intersectionObserver: IntersectionObserver | null = null

    onMounted(() => {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore()
          }
        },
        { threshold: 0.5 },
      )

      if (observer.value) {
        intersectionObserver.observe(observer.value)
      }
    })

    onUnmounted(() => {
      if (intersectionObserver) {
        intersectionObserver.disconnect()
      }
    })

    return {
      state,
      observer,
    }
  },
})
</script>

<style scoped>
.infinite-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.number-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.observer {
  height: 20px;
}
</style>
