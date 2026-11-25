<template>
  <div style="border: 1px solid black">{{ selectIndex }}</div>
</template>

<script setup lang="ts">
// 타입 기반 defineProps: 런타임 선언(props: { selectIndex: Number }) 대신 TS 타입으로 선언합니다.
defineProps<{
  selectIndex?: number
}>()
</script>
