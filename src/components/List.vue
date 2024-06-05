<!-- import Vue from 'vue'
import store from './store'
import TodoList from './components/TodoList.vue'

new Vue({
store,
el: '#app',
render: h => h(TodoList)
})
<style></style>
<template>
  <ul id="todolist">
    <li v-for="(a, index) in todolist" v-bind:class="checked(a.done)" v-on:click="doneToggle(index)">
      <span>{{ a.todo }}</span>
      <span v-if="a.done"> (완료)</span>
      <span class="close" v-on:click.stop="deleteTodo(index)">×</span>
    </li>
  </ul>
</template>
<script type="text/javascript">
import Constant from '../constant'

export default {
  computed: {
    todolist() {
      return this.$store.state.todolist;
    }
  },
  methods: {
    checked: function (done) {
      if (done) return { checked: true };
      else return { checked: false };
    },
    deleteTodo: function (index) {
      this.$store.commit(Constant.DELETE_TODO, { index: index });
    },
    doneToggle: function (index) {
      this.$store.commit(Constant.DONE_TOGGLE, { index: index });
    }
  }
}
</script>
출처: https://12bme.tistory.com/452 [길은 가면, 뒤에 있다.:티스토리] -->