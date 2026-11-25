<template>
  <ul>
    <li v-for="product in products" :key="product.id">
      {{ product.title }} - {{ formatCurrency(product.price) }}
      <br>
      <button :disabled="!product.inventory" @click="addProductToCart(product)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/utils/format'

interface Product {
  id: number
  title: string
  price: number
  inventory: number
}

// mapState / mapActions 대신 useStore()로 스토어에 직접 접근합니다.
const store = useStore()

const products = computed<Product[]>(() => store.state.products.all)

function addProductToCart(product: Product) {
  store.dispatch('cart/addProductToCart', product)
}

// created() 훅에 있던 코드는 <script setup> 최상단에서 바로 실행하면 됩니다.
store.dispatch('products/getAllProducts')
</script>