# 구조와 설정

저장소의 전체 구조, 진입 경로, 상태 관리, 빌드·툴링 설정을 정리한 문서입니다. 각 화면의 역할은 [SCREENS.md](SCREENS.md)를 참고하세요.

## 1. 앱 진입 경로

```
public/index.html  →  src/main.ts  →  src/App.vue  →  layouts/MainLayout.vue  →  (메뉴에서 선택한 테스트 화면)
```

### `src/main.ts`

```ts
const app = createApp(App)
app.use(router)
app.use(store) // Vuex: member, cart, products 모듈
app.use(createPinia()) // Pinia: stores/counter.ts
app.use(ElementPlus)
app.mount('#app')
```

- Vue Router, Vuex 스토어, Pinia, Element Plus를 등록합니다. Vuex와 Pinia는 학습 목적으로 함께 쓰고 있으며 서로 간섭하지 않습니다.
- Element Plus는 전역 등록이라 모든 화면에서 `el-*` 컴포넌트를 바로 쓸 수 있습니다.

### `src/App.vue`

`<router-view />` 하나와 전역 기본 스타일(`#app`, `body`, `box-sizing`)만 있습니다. 어떤 화면을 그릴지는 라우터가 정합니다. (예전에는 테스트 화면 태그와 import를 주석으로 옮겨 가며 하나씩 띄우는 스위치 역할이었고, 쓰이지 않던 사이드바 상태·CSS도 이번에 정리했습니다.)

### `src/layouts/MainLayout.vue`

`/` 라우트의 컴포넌트로, 앱의 메인 페이지입니다.

- 왼쪽: Element Plus `el-menu`로 만든 2단 메뉴입니다. `el-sub-menu`(1단, 화면 종류) 안에 `el-menu-item`(2단, 화면)을 둡니다. `router` 속성을 켜서 항목의 `index`(전체 경로)로 바로 이동하고, `default-active`를 현재 경로에 맞춰 선택 표시를 유지합니다. 처음에는 모든 그룹을 펼쳐 둡니다.
- 오른쪽: 상단에 `그룹 / 화면 이름`과 파일 경로(`route.meta`)를 보여 주고, 그 아래 `<router-view />`에 자식 라우트 화면을 그립니다.
- 스크롤은 창 전체로 두고 메뉴만 `position: sticky`로 고정합니다. `StickyHeader.vue`처럼 `window` 스크롤을 감지하는 화면이 그대로 동작하게 하기 위해서입니다. 메뉴 폭은 CSS 변수 `--layout-sidebar-width`(240px)로 두었고, `position: fixed` 헤더를 쓰는 `StickyHeader.vue`가 이 값만큼 왼쪽을 비켜 섭니다.

## 2. 라우팅

`createWebHistory` 기반의 중첩 라우트입니다. 메뉴와 라우트는 같은 목록에서 만들어집니다.

| 파일 | 역할 |
| --- | --- |
| `src/router/menu.ts` | `screenMenu`: 그룹(1단) → 화면(2단) 목록. 화면마다 메뉴 이름(`title`), 경로 조각(`path`), 지연 로딩 컴포넌트(`component`), 파일 경로(`file`)를 적습니다. `fullPath(group, item)`가 `/그룹/화면` 경로를 만듭니다 |
| `src/router/index.ts` | `screenMenu`를 펼쳐 `MainLayout`의 자식 라우트로 등록합니다. `title`·`group`·`file`은 `route.meta`에 들어가며, `RouteMeta` 타입을 확장해 두었습니다 |

| 경로 | 컴포넌트 | 비고 |
| --- | --- | --- |
| `/` | `layouts/MainLayout.vue` | 메인 레이아웃. 자식 라우트가 오른쪽 `<router-view />`에 그려짐 |
| `/` (자식 `''`) | `views/HomeView.vue` | 전체 화면 목록 |
| `/<그룹>/<화면>` | `menu.ts`의 각 화면 | 예: `/viewer/chart`, `/layout/kanban`. 전체 목록은 [SCREENS.md](SCREENS.md#메뉴-구성) |
| `/member` | → `/basic/member`로 리다이렉트 | 예전 경로 호환 |
| 그 밖의 경로 | → `/`로 리다이렉트 | |

모든 화면 컴포넌트는 `() => import(...)`로 지연 로딩되므로, 메뉴를 눌렀을 때 해당 화면의 코드만 내려받습니다. (예: 7.4만 줄짜리 `content.js`를 쓰는 `SourceView`는 그 화면을 열 때만 불러옵니다.)

`vue-cli-service serve`는 history 모드용 fallback이 기본으로 켜져 있어 `/viewer/chart` 같은 주소로 새로고침해도 됩니다. `dist/`를 정적 서버에 올릴 때는 모든 경로를 `index.html`로 돌려주는 설정이 필요합니다.

## 3. 상태 관리

Vuex와 Pinia 두 가지 방식이 함께 있고, `main.ts`에서 둘 다 등록합니다.

### Vuex — 멤버 (`src/store/`)

| 파일 | 역할 |
| --- | --- |
| `index.ts` | `createStore`로 `member`, `cart`, `products` 모듈 등록 |
| `memberStore.ts` | 멤버 목록·선택 목록·페이지·검색어 상태, 무한 스크롤용 mutations/actions (`namespaced: true`) |
| `types.ts` | `RootState`, `MemberState` 타입 정의 |

데이터는 `src/services/memberService.ts`를 통해 가져옵니다.

### Vuex — 쇼핑카트 (`src/stores/modules/`)

Vuex 공식 예제를 옮겨 둔 코드입니다.

| 파일 | 역할 |
| --- | --- |
| `products.js` | 상품 목록 조회 (`products` 모듈) |
| `cart.js` | 장바구니 담기·결제 (`cart` 모듈) |
| `src/api/shop.js` | `setTimeout` 기반 목 API, 결제는 50% 확률로 실패 |

두 모듈은 `src/store/index.ts`에서 `cart`, `products`라는 이름으로 등록되며, `ProductList.vue` / `ShoppingCart.vue`가 이 모듈을 씁니다. 금액 표시는 `src/utils/format.ts`의 `formatCurrency`를 사용합니다.

### Pinia (`src/stores/counter.ts`)

`useCounterStore` — `count`, `doubleCount`, `increment`만 있는 setup 스타일 최소 예제입니다. Pinia는 등록되어 있지만 이 스토어를 쓰는 화면은 아직 없습니다.

## 4. 서비스·타입·데이터

| 파일 | 역할 |
| --- | --- |
| `src/services/memberService.ts` | `GET /api/members` 호출(`getMembers`)과 500명 더미 생성·검색·페이징(`generateDummyMembers`). 페이지 크기 15 |
| `src/types/member.ts` | `Member` 인터페이스 (`id`, `name`, `email`, `department`) |
| `src/data/members.json` | `scripts/generateMembers.js`로 생성한 한국어 이름 멤버 300명 |
| `src/views/data/content.js` | `getOldContent()` / `getNewContent()`. 약 7.4만 줄의 `package-lock.json` 텍스트를 문자열로 담은 diff 테스트용 데이터 |
| `src/api/shop.js` | 쇼핑카트 예제용 목 API |

`src/data/members.json`은 커밋되어 있으므로 다시 생성하지 않아도 되지만, 데이터를 바꾸고 싶을 때 스크립트를 실행하면 덮어쓰기됩니다.

## 5. 빌드·툴링

### 빌드 도구가 두 벌 있습니다

| 설정 | 내용 | 실제 사용 |
| --- | --- | --- |
| `vue.config.js` + `babel.config.js` | Vue CLI 5(webpack), `transpileDependencies: true` | **사용 중** — `npm run serve/build/lint`가 모두 `vue-cli-service` |
| `vite.config.ts` | Vite 6 + `@vitejs/plugin-vue`, 프로덕션 플래그 정의 | `package.json`에 Vite 스크립트가 없어 미사용 |

Vite로 옮기려면 `package.json`에 `"dev": "vite"`, `"build": "vite build"` 같은 스크립트를 추가하고, `public/index.html`을 루트 `index.html`로 옮겨 `<script type="module" src="/src/main.ts">`를 직접 넣어야 합니다. 현재 `public/index.html`은 webpack 템플릿 문법(`<%= BASE_URL %>`, `htmlWebpackPlugin`)을 쓰고 있어 Vite에서 그대로 쓸 수 없습니다.

### TypeScript

`tsconfig.json`

- `strict: true`, `target`/`module`은 `esnext`, `moduleResolution: node`
- `@/*` → `src/*` 경로 별칭
- `resolveJsonModule: true` (멤버 JSON import 때문)
- `allowJs: true` — `.js` 파일 혼용 허용
- `forceConsistentCasingInFileNames: true` — 파일명 대소문자를 엄격히 봅니다
- `src/shims-vue.d.ts`가 `.vue` 파일 타입을 선언합니다

`jsconfig.json`도 함께 있어 같은 경로 별칭을 JS 쪽에 제공합니다.

### 린트·포맷

- `.eslintrc.json`: `plugin:vue/essential` + `@typescript-eslint` 파서
- `package.json`의 `eslintConfig`: `plugin:vue/vue3-essential`, `eslint:recommended`, `@vue/typescript`

ESLint 설정이 두 곳에 나뉘어 있고 내용도 다릅니다. ESLint 8은 `.eslintrc.json`을 우선 적용하므로, 실제로는 Vue 2용 `vue/essential` 규칙이 적용됩니다.

`.prettierrc`: 싱글 쿼트, 세미콜론 없음, 들여쓰기 2칸, 최대 폭 120, `singleAttributePerLine: true`. 다만 이 포맷이 적용되지 않은 파일도 섞여 있습니다.

### 정적 자산

| 위치 | 내용 |
| --- | --- |
| `public/css/common.css` | `.nocopy` 한 가지 규칙만 있음. `index.html`에 링크되어 있지 않음 |
| `public/images/icons/*.svg` | 연필·전송 아이콘. `PostitView.vue`가 `/images/icons/...`로 참조 |
| `src/assets/` | 같은 SVG 세 개와 Vue 로고. 현재 코드에서 import하지 않음 |

## 6. 코드 스타일

모든 `.vue` 파일은 Composition API의 `<script setup lang="ts">`로 작성되어 있습니다. (이전에는 Options API, `defineComponent` + `setup()`, `vue-class-component`가 섞여 있었고 한 번에 변환했습니다.) 스크립트 블록이 없는 `SpinnerBorder.vue`와 빈 파일인 `src/components/SourceTreeView.vue`만 예외입니다.

자주 쓰는 패턴은 다음과 같습니다.

| 하고 싶은 것 | `<script setup>`에서의 방법 | 예시 |
| --- | --- | --- |
| 컴포넌트 등록 | `import`만 하면 템플릿에서 바로 사용 (`components` 옵션 불필요) | `SourceView.vue` |
| props | 타입 기반 `defineProps<{ ... }>()`, 기본값은 `withDefaults` | `FileDiffViewer.vue`, `TreeView.vue` |
| 상태 / 계산값 | `ref`, `reactive`, `computed` (`data()` / `computed` 옵션 대신) | `MemberSelector.vue`, `CardListView.vue` |
| 템플릿 ref | 템플릿의 `ref="이름"`과 같은 이름의 `ref()` 변수, `v-for` 안에서는 함수형 ref | `SourceView.vue`(`tableRef`), `InfiniteComponent.vue` |
| `created()` 훅 | 스크립트 최상단에서 바로 실행 | `ProductList.vue` |
| Vuex 사용 | `useStore()` + `computed`로 state/getters, `store.dispatch` / `store.commit` (`mapState` 등 대신) | `ProductList.vue`, `ShoppingCart.vue`, `InputTodo.vue` |
| 재귀 컴포넌트 | 파일 이름(`TreeView`)으로 자기 자신을 참조 | `TreeView.vue` |
| 컴포넌트 간 공유 타입 | 별도 `.ts` 파일이나 `<script setup>` 안의 `export interface` | `kanban/types.ts`, `TreeView.vue`의 `TreeItem` |
