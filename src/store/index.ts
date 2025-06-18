import { createStore } from 'vuex'
import memberStore from './memberStore'

export default createStore({
  modules: {
    member: memberStore,
  },
})
