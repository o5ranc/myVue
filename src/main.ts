import { createApp } from 'vue';
import App from './App.vue';

// import router from './router';
// import {createPinia} from 'pinia';
import ElementPlus from 'element-plus';

const app = createApp(App);
// const pinia = createPinia();

app.use(ElementPlus);
app.mount('#app');
