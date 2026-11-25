<template>
  <div class="cart">
    <h2>Your Cart</h2>
    <p v-show="!products.length">
      <i>Please add some products to cart.</i>
    </p>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.title }} - {{ formatCurrency(product.price) }} x {{ product.quantity }}
      </li>
    </ul>
    <p>Total: {{ formatCurrency(total) }}</p>
    <p><button :disabled="!products.length" @click="checkout(products)">Checkout</button></p>
    <p v-show="checkoutStatus">Checkout {{ checkoutStatus }}.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/utils/format'

interface CartProduct {
  id: number
  title: string
  price: number
  quantity: number
}

// mapState / mapGetters 대신 useStore() + computed로 같은 값을 만듭니다.
const store = useStore()

const checkoutStatus = computed<string | null>(() => store.state.cart.checkoutStatus)
const products = computed<CartProduct[]>(() => store.getters['cart/cartProducts'])
const total = computed<number>(() => store.getters['cart/cartTotalPrice'])

function checkout(items: CartProduct[]) {
  store.dispatch('cart/checkout', items)
}
</script>