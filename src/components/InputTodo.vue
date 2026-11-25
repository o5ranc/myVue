<style></style>
<template>
  <div>
    <input class="input" type="text" id="task" v-model.trim="todo" placeholder="입력 후 엔터!" v-on:keyup.enter="addTodo">
    <span class="addbutton" v-on:click="addTodo">추가</span>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
// NOTE: 예제용 컴포넌트입니다(어디서도 import하지 않음). todolist 상태를 가진 스토어가 있어야 동작합니다.
import Constant from '../constant'

const store = useStore()
const todo = ref('')

function addTodo() {
  store.commit(Constant.ADD_TODO, { todo: todo.value })
  todo.value = ''
}
</script>
