import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { fullPath, screenMenu } from './menu'

// route.meta에 넣는 값의 타입 (MainLayout 상단 안내에 사용)
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    group?: string
    file?: string
  }
}

// 메뉴 목록(menu.ts)에서 MainLayout의 자식 라우트를 만듭니다.
// 자식 라우트는 MainLayout 안의 <router-view />(오른쪽 영역)에 그려집니다.
const screenRoutes: RouteRecordRaw[] = screenMenu.flatMap((group) =>
  group.children.map((item) => ({
    path: fullPath(group, item).slice(1), // 자식 라우트는 앞의 '/' 없이 적습니다
    component: item.component,
    meta: { title: item.title, group: group.title, file: item.file },
  })),
)

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '홈' },
      },
      ...screenRoutes,
    ],
  },
  // 예전 경로 호환
  { path: '/member', redirect: '/basic/member' },
  // 없는 경로는 홈으로
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
