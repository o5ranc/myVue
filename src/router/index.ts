import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/App.vue'),
  },
  {
    path: '/member',
    component: () => import('@/views/testViews/member/AdminMembers.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
