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

<script>
import { mapState, mapActions } from 'vuex'
import { formatCurrency } from '@/utils/format'

export default {
  computed: mapState({
    products: state => state.products.all
  }),
  methods: {
    ...mapActions('cart', ['addProductToCart']),
    formatCurrency,
  },
  created() {
    this.$store.dispatch('products/getAllProducts')
  }
}
</script>