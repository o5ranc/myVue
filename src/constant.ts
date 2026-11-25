// InputTodo.vue / List.vue 예제에서 쓰는 Vuex mutation 이름입니다.
// (해당 예제는 todolist 상태를 가진 스토어가 있어야 실제로 동작합니다.)
export default {
  ADD_TODO: 'addTodo',
  DELETE_TODO: 'deleteTodo',
  DONE_TOGGLE: 'doneToggle',
} as const
