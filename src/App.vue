<template>
  <div id="app">
    <!-- <ProductList /> -->
    <!-- <ShoppingCart /> -->
    <!-- <TestView /> -->
    <!-- <ElTableTestView /> -->
    <!-- <ChartTestView /> -->
    <!-- <SourceView /> -->
    <!-- <CardListView/> -->
    <!-- <SourceTreeView /> -->
    <!-- <KanbanList /> -->
     <!-- <PostitView /> -->
     <BranchLintList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { storeToRefs } from 'pinia'
// import { useCounterStore } from '@/stores/counter'
// import ProductList from './components/ProductList.vue'
// import ShoppingCart from './components/ShoppingCart.vue'
// import TestView from './views/testViews/testView.vue'
// import ElTableTestView from "./views/testViews/ElTableTestView.vue"
// import ChartTestView from './views/testViews/ChartTestView.vue'
// import SourceView from './views/testViews/SourceView.vue'
// import CardListView from './views/testViews/CardListView.vue'
// import SourceTreeView from './views/testViews/SourceTreeView.vue'
// import KanbanList from './views/testViews/kanban/KanbanList.vue';
// import PostitView from './views/alert/PostitView.vue';
import BranchLintList from './views/testViews/BranchLintList.vue';

export default defineComponent({
  components: {
    // ProductList,
    // ShoppingCart
    // TestView,
    // ElTableTestView,
    // ChartTestView,
    // SourceView,
    // CardListView,
    // SourceTreeView,
    // KanbanList,
    // PostitView
    BranchLintList
  },
  setup() {
    // const countStore = useCounterStore()
    // const { count, doubleCount } = storeToRefs(countStore)

    // count.value++
    // let result = countStore.increment()

    // console.log('### ran doubleCount : ', doubleCount)
    // console.log('### ran1 commit test log')

    return {
      // count,
      // doubleCount,
      // result,
      // countStore
    }
  },
})
</script>
