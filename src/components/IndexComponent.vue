<template>
  <div style="border: 1px solid black">{{ selectIndex }}</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  props: {
    selectIndex: Number,
  },

  setup() {
    const state = reactive({})
    return {}
  },
})
</script>
