<template>
	<div id="app">
		<!-- <ProductList /> -->
		<!-- <ShoppingCart /> -->
		<TestView />
	</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { storeToRefs } from 'pinia'
// import { useCounterStore } from '@/stores/counter'
// import ProductList from './components/ProductList.vue'
// import ShoppingCart from './components/ShoppingCart.vue'
import TestView from './views/testViews/testView.vue'

export default defineComponent({
	components: {
		// ProductList,
		// ShoppingCart
		TestView
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
