# 분석 메모

현재 코드를 읽으면서 확인한, 동작하지 않거나 정리 후보인 부분을 모았습니다. 학습용 저장소라 일부러 남겨 둔 코드도 많으니, "고쳐야 할 목록"이 아니라 **다음에 손댈 때 참고할 메모**로 보면 됩니다.

## 지금 그대로는 동작하지 않는 것

| 항목 | 내용 |
| --- | --- |
| 파일명 대소문자 | `App.vue`가 `./views/testViews/ElTableTestView.vue`를 import하지만 실제 파일은 `elTableTestView.vue`입니다. 대소문자를 구분하는 환경(Linux CI, Docker 빌드)에서 모듈을 찾지 못합니다. `tsconfig.json`의 `forceConsistentCasingInFileNames: true`와도 어긋납니다 |
| 스토어 미등록 | `main.ts`에서 Vuex 스토어와 Pinia를 모두 등록하지 않습니다. `ProductList.vue`, `ShoppingCart.vue`, Vuex 멤버 스토어, Pinia 카운터는 화면에 올려도 동작하지 않습니다 |
| 쇼핑카트 모듈 미연결 | `src/stores/modules/cart.js`, `products.js`가 `src/store/index.ts`의 `modules`에 들어 있지 않습니다 |
| Vue 2 필터 문법 | `ProductList.vue`, `ShoppingCart.vue`가 `{{ price | currency }}` 형태의 필터를 씁니다. Vue 3에서 제거된 문법이라 컴파일 에러가 납니다 |
| 없는 모듈 import | `InputTodo.vue`, `List.vue`가 `../constant`를 import하지만 해당 파일이 없습니다. `HelloWorld.vue`는 설치되지 않은 `vue-class-component`를 씁니다 |
| `TreeView` 펼침 | `toggleItem`이 `console.log`만 합니다. Vue 3에서 `this.$set`이 사라졌기 때문이며, `item.isOpen = !item.isOpen` 직접 대입으로 바꾸면 동작합니다 |
| `index.html` | `<title>` 여는 태그가 없고 `<%= htmlWebpackPlugin.options.title %>` 뒤에 `</title>`만 있습니다. 또 `favicons.ico`를 참조하는데 실제 파일은 `public/favicon.ico`입니다 |
| 라우팅 | `App.vue`에 `<router-view />`가 없어 `/member` 등 라우트가 화면에 그려지지 않습니다. `/` 라우트는 `App.vue` 자신을 가리킵니다 |
| 칸반 이미지 | `KanbanList.vue`, `KanbanItem.vue`의 이미지 경로가 `/path/to/profile.jpg` 자리표시자입니다 |
| `KanbanItem.vue` CSS | `.kanban-item` 블록 닫는 중괄호 뒤에 글자 `S`가 섞여 있어 이후 규칙이 무시될 수 있습니다 |

## 정리 후보

- **빈 파일**: `src/components/SourceTreeView.vue`, `src/core/helpers/config.ts`
- **중복 ESLint 설정**: `.eslintrc.json`(`plugin:vue/essential`, Vue 2용)과 `package.json`의 `eslintConfig`(`plugin:vue/vue3-essential`). 한쪽으로 합치고 Vue 3 규칙을 쓰는 편이 낫습니다
- **빌드 도구 두 벌**: `vue.config.js`(사용 중)와 `vite.config.ts`(스크립트 없음). Vite로 옮길 계획이 없으면 설정 하나를 정리하거나, 옮긴다면 `package.json` 스크립트와 `index.html`을 함께 바꿔야 합니다
- **미사용 자산**: `src/assets/`의 SVG 세 개는 `public/images/icons/`와 중복입니다. `public/css/common.css`는 `index.html`에 링크되어 있지 않습니다
- **대용량 데이터 파일**: `src/views/data/content.js`가 약 7.4만 줄입니다. diff 테스트 목적이라면 더 작은 샘플로 줄이거나, 번들에 들어가지 않도록 런타임에 fetch하는 방식을 고려할 수 있습니다
- **미선언 의존성**: `SourceView.vue`가 `@element-plus/icons-vue`를 import하지만 `package.json`에 없습니다. 현재는 Element Plus를 통해 설치되어 동작하지만, 직접 의존성으로 명시하는 것이 안전합니다
- **미사용 의존성**: CKEditor, TinyMCE, Quill, FullCalendar, GoJS, ApexCharts, Tagify, Dropzone, Prisma 등 상당수가 코드에서 쓰이지 않습니다. 설치 시간과 `node_modules` 크기에 영향이 있습니다
- **`App.vue`의 잔재**: 사용되지 않는 `isMenuOpen` / `menuItems` 데이터와 사이드바 CSS

## 화면 전환 방식에 대해

지금은 `App.vue`에서 주석을 옮겨 가며 화면을 바꾸기 때문에, 화면 하나를 볼 때마다 세 곳(템플릿·import·components)을 고쳐야 하고 그 수정이 커밋에 섞입니다. 화면이 더 늘어나면 다음 방식이 편합니다.

1. `App.vue`를 `<router-view />`와 간단한 메뉴만 두는 레이아웃으로 바꿉니다. 사이드바 CSS가 이미 있으니 그대로 활용할 수 있습니다.
2. `src/router/index.ts`에 테스트 화면별 라우트를 지연 로딩으로 등록합니다.
3. 메뉴는 라우트 목록에서 자동으로 만들면 화면을 추가할 때 라우트 한 줄만 늘어납니다.
