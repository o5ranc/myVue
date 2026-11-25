import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(store) // Vuex: member, cart, products 모듈
app.use(createPinia()) // Pinia: stores/counter.ts
app.use(ElementPlus)
app.mount('#app')
