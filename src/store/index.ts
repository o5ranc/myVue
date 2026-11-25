import { createStore } from 'vuex'
import memberStore from './memberStore'
import cart from '@/stores/modules/cart'
import products from '@/stores/modules/products'

export default createStore({
  modules: {
    member: memberStore,
    cart,
    products,
  },
})
