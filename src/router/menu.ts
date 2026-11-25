import type { RouteComponent } from 'vue-router'

/**
 * 왼쪽 2depth 메뉴와 라우트를 함께 만드는 화면 목록입니다.
 * 화면을 추가하려면 알맞은 그룹의 children에 한 줄만 추가하면 됩니다.
 * (라우트는 src/router/index.ts에서 이 목록으로 자동 생성됩니다.)
 */
export interface ScreenMenuItem {
  /** 메뉴에 보일 이름 */
  title: string
  /** 그룹 경로 뒤에 붙는 경로 조각 (예: 'chart' → /viewer/chart) */
  path: string
  /** 화면 컴포넌트. 지연 로딩으로 메뉴를 눌렀을 때만 불러옵니다 */
  component: () => Promise<RouteComponent>
  /** 파일 위치 (화면 상단 안내용) */
  file: string
}

export interface ScreenMenuGroup {
  /** 1depth 메뉴 이름 */
  title: string
  /** 그룹 경로 (예: 'element' → /element/...) */
  path: string
  children: ScreenMenuItem[]
}

export const screenMenu: ScreenMenuGroup[] = [
  {
    title: 'Element Plus',
    path: 'element',
    children: [
      // ElTableUiTestView.vue는 아직 저장소에 커밋되지 않아 메뉴에서 뺐습니다.
      // 파일을 커밋한 뒤 아래 주석을 해제하면 메뉴에 나타납니다.
      // {
      //   title: '테이블 종합 (el-table)',
      //   path: 'table',
      //   component: () => import('@/views/testViews/ElTableUiTestView.vue'),
      //   file: 'views/testViews/ElTableUiTestView.vue',
      // },
      {
        title: '브랜치 린트 목록',
        path: 'branch-lint',
        component: () => import('@/views/testViews/BranchLintList.vue'),
        file: 'views/testViews/BranchLintList.vue',
      },
      {
        title: '세로 탭 (el-tabs)',
        path: 'tabs',
        component: () => import('@/views/testViews/ElTabTestView.vue'),
        file: 'views/testViews/ElTabTestView.vue',
      },
    ],
  },
  {
    title: '차트 · 코드 뷰어',
    path: 'viewer',
    children: [
      {
        title: 'ECharts 차트',
        path: 'chart',
        component: () => import('@/views/testViews/ChartTestView.vue'),
        file: 'views/testViews/ChartTestView.vue',
      },
      {
        title: '코드 뷰어와 diff',
        path: 'source',
        component: () => import('@/views/testViews/SourceView.vue'),
        file: 'views/testViews/SourceView.vue',
      },
      {
        title: '파일 트리',
        path: 'source-tree',
        component: () => import('@/views/testViews/SourceTreeView.vue'),
        file: 'views/testViews/SourceTreeView.vue',
      },
    ],
  },
  {
    title: '레이아웃 · CSS',
    path: 'layout',
    children: [
      {
        title: '카드 목록',
        path: 'card-list',
        component: () => import('@/views/testViews/CardListView.vue'),
        file: 'views/testViews/CardListView.vue',
      },
      {
        title: '칸반 보드',
        path: 'kanban',
        component: () => import('@/views/testViews/kanban/KanbanList.vue'),
        file: 'views/testViews/kanban/KanbanList.vue',
      },
      {
        title: '긴 텍스트 정렬',
        path: 'align-text',
        component: () => import('@/views/testViews/Align/AlignTextView.vue'),
        file: 'views/testViews/Align/AlignTextView.vue',
      },
      {
        title: '스크롤 반응 헤더',
        path: 'sticky-header',
        component: () => import('@/views/testViews/dynamically/StickyHeader.vue'),
        file: 'views/testViews/dynamically/StickyHeader.vue',
      },
      {
        title: '가변 높이 입력',
        path: 'auto-height',
        component: () => import('@/views/testViews/dynamically/autoHeightDiv.vue'),
        file: 'views/testViews/dynamically/autoHeightDiv.vue',
      },
      {
        title: 'CSS 로딩 효과',
        path: 'spinner',
        component: () => import('@/views/testViews/SpinnerBorder.vue'),
        file: 'views/testViews/SpinnerBorder.vue',
      },
    ],
  },
  {
    title: '알림',
    path: 'alert',
    children: [
      {
        title: '포스트잇',
        path: 'postit',
        component: () => import('@/views/alert/PostitView.vue'),
        file: 'views/alert/PostitView.vue',
      },
    ],
  },
  {
    title: '기본 · 상태 관리',
    path: 'basic',
    children: [
      {
        title: 'v-model 기본',
        path: 'v-model',
        component: () => import('@/views/testViews/testView.vue'),
        file: 'views/testViews/testView.vue',
      },
      {
        title: '상품 목록 (Vuex)',
        path: 'products',
        component: () => import('@/components/ProductList.vue'),
        file: 'components/ProductList.vue',
      },
      {
        title: '장바구니 (Vuex)',
        path: 'cart',
        component: () => import('@/components/ShoppingCart.vue'),
        file: 'components/ShoppingCart.vue',
      },
      {
        title: '멤버 선택 (Vuex)',
        path: 'member-selector',
        component: () => import('@/components/MemberSelector.vue'),
        file: 'components/MemberSelector.vue',
      },
      {
        title: '멤버 관리 (빈 화면)',
        path: 'member',
        component: () => import('@/views/testViews/member/AdminMembers.vue'),
        file: 'views/testViews/member/AdminMembers.vue',
      },
    ],
  },
]

/** 그룹 경로와 항목 경로를 합친 전체 경로 (예: /viewer/chart) */
export function fullPath(group: ScreenMenuGroup, item: ScreenMenuItem): string {
  return `/${group.path}/${item.path}`
}
