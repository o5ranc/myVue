# 구조와 설정

저장소의 전체 구조, 진입 경로, 상태 관리, 빌드·툴링 설정을 정리한 문서입니다. 각 화면의 역할은 [SCREENS.md](SCREENS.md)를 참고하세요.

## 1. 앱 진입 경로

```
public/index.html  →  src/main.ts  →  src/App.vue  →  (주석으로 선택된 테스트 화면)
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

루트 컴포넌트이지만 레이아웃 역할보다 **화면 선택 스위치** 역할이 큽니다.

- `<template>`에 테스트 화면 태그들이 나열되어 있고 한 개만 활성 상태입니다(현재 `ElTableUiTestView`).
- `<script setup>`이라 `components` 옵션이 없고, `import` 문만 같은 방식으로 주석 처리되어 있어 화면을 바꿀 때 두 곳(태그·import)을 수정합니다.
- `isMenuOpen`, `menuItems` ref와 `toggleMenu` 함수가 있고 `<style>`에 사이드바/토글 버튼 CSS가 들어 있지만, 템플릿에 해당 마크업이 없어 **현재는 쓰이지 않는 사이드바 레이아웃의 잔재**입니다.
- `<router-view />`가 없습니다. 그래서 라우터로 화면을 바꾸는 흐름은 사실상 동작하지 않습니다.

## 2. 라우팅

`src/router/index.ts` — `createWebHistory` 기반이며 라우트는 두 개뿐입니다.

| 경로 | 컴포넌트 | 비고 |
| --- | --- | --- |
| `/` | `@/App.vue` | 루트 컴포넌트를 라우트 컴포넌트로 다시 지정한 형태 |
| `/member` | `views/testViews/member/AdminMembers.vue` | 제목만 있는 빈 화면 |

`App.vue`에 `<router-view />`가 없으므로 라우트가 매칭되어도 화면에 그려지지 않습니다. 라우터 기반 화면 전환으로 바꾸려면 `App.vue`에 `<router-view />`를 두고, 각 테스트 화면을 라우트로 옮기는 작업이 필요합니다.

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
| 컴포넌트 등록 | `import`만 하면 템플릿에서 바로 사용 (`components` 옵션 불필요) | `App.vue`, `SourceView.vue` |
| props | 타입 기반 `defineProps<{ ... }>()`, 기본값은 `withDefaults` | `FileDiffViewer.vue`, `TreeView.vue` |
| 상태 / 계산값 | `ref`, `reactive`, `computed` (`data()` / `computed` 옵션 대신) | `MemberSelector.vue`, `CardListView.vue` |
| 템플릿 ref | 템플릿의 `ref="이름"`과 같은 이름의 `ref()` 변수, `v-for` 안에서는 함수형 ref | `SourceView.vue`(`tableRef`), `InfiniteComponent.vue` |
| `created()` 훅 | 스크립트 최상단에서 바로 실행 | `ProductList.vue` |
| Vuex 사용 | `useStore()` + `computed`로 state/getters, `store.dispatch` / `store.commit` (`mapState` 등 대신) | `ProductList.vue`, `ShoppingCart.vue`, `InputTodo.vue` |
| 재귀 컴포넌트 | 파일 이름(`TreeView`)으로 자기 자신을 참조 | `TreeView.vue` |
| 컴포넌트 간 공유 타입 | 별도 `.ts` 파일이나 `<script setup>` 안의 `export interface` | `kanban/types.ts`, `TreeView.vue`의 `TreeItem` |
