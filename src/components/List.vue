<!-- eslint-disable vue/multi-word-component-names -->
<!--
  출처: https://12bme.tistory.com/452 [길은 가면, 뒤에 있다.:티스토리]

  Vue 2 시절 진입점 예시(참고용):
  import Vue from 'vue'
  import store from './store'
  import TodoList from './components/TodoList.vue'

  new Vue({
    store,
    el: '#app',
    render: h => h(TodoList)
  })
-->
<template>
  <ul id="todolist">
    <li v-for="(a, index) in todolist" :key="index" v-bind:class="checked(a.done)" v-on:click="doneToggle(index)">
      <span>{{ a.todo }}</span>
      <span v-if="a.done"> (완료)</span>
      <span class="close" v-on:click.stop="deleteTodo(index)">×</span>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
// NOTE: 예제용 컴포넌트입니다(어디서도 import하지 않음). todolist 상태를 가진 스토어가 있어야 동작합니다.
import Constant from '../constant'

interface TodoItem {
  todo: string
  done: boolean
}

const store = useStore()

const todolist = computed<TodoItem[]>(() => store.state.todolist)

function checked(done: boolean) {
  return { checked: done }
}

function deleteTodo(index: number) {
  store.commit(Constant.DELETE_TODO, { index })
}

function doneToggle(index: number) {
  store.commit(Constant.DONE_TOGGLE, { index })
}
</script>

<style></style>
