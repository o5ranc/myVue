# 화면과 컴포넌트

`src/views/`의 테스트 화면과 `src/components/`의 컴포넌트가 각각 무엇을 확인하기 위한 것인지 정리한 문서입니다. 화면을 보고 추가하는 방법은 [README](../README.md#화면을-보는-방법)에 있습니다.

## 메뉴 구성

메인 레이아웃 왼쪽 메뉴에 나오는 화면입니다. 목록은 `src/router/menu.ts`에 있고, 경로를 주소창에 직접 입력해도 됩니다.

| 1단 (종류) | 2단 (화면) | 경로 | 파일 |
| --- | --- | --- | --- |
| Element Plus | 브랜치 린트 목록 | `/element/branch-lint` | `views/testViews/BranchLintList.vue` |
| | 세로 탭 (el-tabs) | `/element/tabs` | `views/testViews/ElTabTestView.vue` |
| | ~~테이블 종합 (el-table)~~ | (`/element/table`) | `views/testViews/ElTableUiTestView.vue` — 미커밋이라 메뉴에서 뺌 |
| 차트 · 코드 뷰어 | ECharts 차트 | `/viewer/chart` | `views/testViews/ChartTestView.vue` |
| | 코드 뷰어와 diff | `/viewer/source` | `views/testViews/SourceView.vue` |
| | 파일 트리 | `/viewer/source-tree` | `views/testViews/SourceTreeView.vue` |
| 레이아웃 · CSS | 카드 목록 | `/layout/card-list` | `views/testViews/CardListView.vue` |
| | 칸반 보드 | `/layout/kanban` | `views/testViews/kanban/KanbanList.vue` |
| | 긴 텍스트 정렬 | `/layout/align-text` | `views/testViews/Align/AlignTextView.vue` |
| | 스크롤 반응 헤더 | `/layout/sticky-header` | `views/testViews/dynamically/StickyHeader.vue` |
| | 가변 높이 입력 | `/layout/auto-height` | `views/testViews/dynamically/autoHeightDiv.vue` |
| | CSS 로딩 효과 | `/layout/spinner` | `views/testViews/SpinnerBorder.vue` |
| 알림 | 포스트잇 | `/alert/postit` | `views/alert/PostitView.vue` |
| 기본 · 상태 관리 | v-model 기본 | `/basic/v-model` | `views/testViews/testView.vue` |
| | 상품 목록 (Vuex) | `/basic/products` | `components/ProductList.vue` |
| | 장바구니 (Vuex) | `/basic/cart` | `components/ShoppingCart.vue` |
| | 멤버 선택 (Vuex) | `/basic/member-selector` | `components/MemberSelector.vue` |
| | 멤버 관리 (빈 화면) | `/basic/member` | `views/testViews/member/AdminMembers.vue` |

예전 `App.vue`에서 주석으로 골라 보던 화면은 모두 메뉴에 들어 있고, 거기에 없던 `autoHeightDiv.vue`와 `AdminMembers.vue`도 함께 넣었습니다. 상품 목록과 장바구니는 같은 Vuex 스토어를 쓰므로, 상품 목록에서 담은 뒤 장바구니 메뉴로 가면 담긴 상품이 보입니다.

## 1. 테스트 화면 (`src/views/testViews/`)

### `elTableTestView.vue` — Element Plus 테이블 종합

> 이 파일은 저장소에서 삭제되었고, 후속 화면인 `ElTableUiTestView.vue`는 아직 저장소에 커밋되어 있지 않습니다. 그래서 메뉴에서는 빠져 있으며, 파일을 커밋한 뒤 `src/router/menu.ts`의 주석 처리된 항목을 살리면 `/element/table`로 볼 수 있습니다. 아래 설명은 이전 파일 기준입니다.

가장 크고 많이 고친 화면입니다. `el-table`로 다음을 실험합니다.

- 체크박스 선택(`selectable`로 특정 행 선택 금지), 전체 선택과 중간 상태(`isIndeterminate`)
- 확장 행(`type="expand"`)과 `expand-row-keys`로 펼친 상태 유지
- 두 줄 구조의 커스텀 헤더, 동적 컬럼 표시/숨김
- 셀 안 `el-input`을 직접 다루는 인라인 편집: `inputRefs`로 포커스 이동, `handleKeyDown`/`handleKeyUp`으로 방향키·엔터 이동, textarea일 때는 줄 위치를 계산해서 다음 행으로 넘어갈지 판단
- 반응성 확인용 "test update" 버튼 — `tableData[0].commitDetails[0].user`를 직접 바꿔 화면이 갱신되는지 봅니다

### `BranchLintList.vue` — 진행 상태가 있는 목록

브랜치별 린트 검사 결과 목록 UI입니다. `el-tag`로 진행중/성공/실패를 구분하고, 실패한 행에만 "재조회"와 "더보기" 버튼을 보여 줍니다. "더보기"를 누르면 확장 행에 커밋 메시지·작성자·시간·SHA가 나오는 중첩 테이블이 펼쳐집니다. 진행률(`progress`)에 따라 표시가 달라지는 패턴을 확인하는 화면입니다.

### `ChartTestView.vue` — ECharts 차트

연도·월 선택(`el-select`)에 따라 데이터를 바꾸는 ECharts 차트입니다. `echarts.init`으로 DOM에 직접 붙이고, `onUnmounted`에서 정리합니다. 상단에는 레이어 토글 실험 코드가 주석으로 남아 있습니다.

### `SourceView.vue` — 코드 뷰어와 diff

CodeMirror 6(`vue-codemirror`)로 코드 보기 영역을 만들고, JavaScript / CSS / Markdown 언어 모드와 One Dark 테마를 적용해 봅니다. 함께 확인하는 것들:

- `FileDiffViewer`로 `src/views/data/content.js`의 두 버전(약 7.4만 줄의 `package-lock.json` 텍스트)을 비교
- `el-button`의 타입·크기·커스텀 색상·`plain`·`disabled`·버튼 그룹 모음
- `IndexComponent`, `InfiniteComponent` 끼워 넣기

### `ElTabTestView.vue` — 세로 탭

`el-tabs`의 `tab-position="left"`로 세로 탭을 만들고, 그라데이션 배경과 고정 높이 컨테이너 안에서 탭 헤더 스타일을 덮어쓰는 실험입니다. `<script setup>`으로 작성되어 있습니다.

### `SourceTreeView.vue` — 파일 트리

`TreeView` 컴포넌트에 실제 프로젝트 구조를 닮은 트리 데이터를 넘겨 폴더/파일 트리를 그립니다. (같은 이름의 `src/components/SourceTreeView.vue`는 빈 파일입니다.)

### `SpinnerBorder.vue` — CSS 로딩 효과

JavaScript 없이 CSS만으로 만드는 로딩 표현 모음입니다. `::before`/`::after`와 `conic-gradient`, 애니메이션을 조합해 그라데이션 테두리 버튼, 테두리가 회전하는 박스 두 종류, 카드형 스피너, 링 스피너를 비교합니다.

### `dynamically/StickyHeader.vue` — 스크롤에 반응하는 헤더

스크롤을 내리면 전체 헤더가 compact 헤더로 바뀌고, 올리면 다시 돌아옵니다. `isCompact` 하나로 두 헤더를 `v-show`로 교체하는 방식이며, 아래에는 스크롤 확인용 더미 섹션 5개가 있습니다. 고정 헤더의 왼쪽 위치는 `var(--layout-sidebar-width, 0)`이라, 메인 레이아웃 안에서는 메뉴를 가리지 않고 단독으로 쓰면 화면 왼쪽 끝부터 그려집니다.

### `dynamically/autoHeightDiv.vue` — 가변 높이 입력

`el-input`을 담은 박스의 높이가 내용에 따라 늘어나는지 확인하는 작은 화면입니다. flex 관련 CSS가 주석으로 남아 있어 켜고 끄며 비교할 수 있습니다.

### `Align/AlignTextView.vue` — 긴 텍스트 정렬

flex 안에서 라벨과 긴 본문을 나란히 두었을 때 줄바꿈과 넘침을 어떻게 다룰지 보는 화면입니다. `min-width: 0`과 `flex: 1 1 0`의 효과를 확인하는 것이 핵심입니다.

### `CardListView.vue` — 카드 목록 레이아웃

좌측 메뉴 + 우측 컨텐츠 구조 안에 컬럼별 카드 목록을 배치합니다. 데이터는 컴포넌트 안에 하드코딩되어 있습니다.

### `kanban/KanbanList.vue`, `kanban/KanbanItem.vue` — 칸반 보드

`To Do / In Progress / Review / Done` 네 컬럼과 카드 컴포넌트로 이루어진 칸반 보드 초안입니다. 드래그 기능은 아직 없습니다(`vuedraggable`은 설치만 되어 있음). 카드 이미지가 `/path/to/profile.jpg`라는 자리표시자 경로를 가리켜 깨진 이미지로 보입니다.

### `testView.vue` — `v-model` 기본

`<select>`에 `v-model`을 붙여 선택값이 바뀌는 것을 확인하는 가장 단순한 화면입니다.

### `member/AdminMembers.vue` — 빈 화면

제목만 있는 껍데기입니다. 메뉴의 `/basic/member`가 이 화면을 가리키며, 예전 경로 `/member`도 이곳으로 리다이렉트됩니다.

## 2. 알림 화면 (`src/views/alert/`)

### `PostitView.vue` — 포스트잇 스타일 표시

작성전/작성중/제출완료 세 상태를 색이 다른 포스트잇 모양으로 보여 줍니다. 꼬리 부분은 별도 `div`에 CSS로 만들었습니다. 함께 확인하는 것:

- `public/images/icons/`의 SVG 아이콘 세 개를 `<img>`로 불러오기
- moment.js로 현재·1·2·3개월 전 날짜를 계산해 출력

## 3. 컴포넌트 (`src/components/`)

| 컴포넌트 | 역할 | 사용처 |
| --- | --- | --- |
| `MemberSelector.vue` | 멤버 목록과 선택 목록을 좌우로 나눈 선택 UI. `members.json` 300명을 15개씩 무한 스크롤로 불러오고, lodash `debounce`로 검색을 지연 처리. 양쪽 목록에 각각 검색창이 있음 | 메뉴 `/basic/member-selector` |
| `FileDiffViewer.vue` | `diff` 패키지의 `createTwoFilesPatch`로 두 텍스트를 비교해, 줄 번호 두 개와 변경 종류(추가/삭제/유지)를 표 형태로 표시 | `SourceView.vue` |
| `InfiniteComponent.vue` | 세 개 컬럼이 각자 독립적으로 무한 스크롤되는 구조. 컬럼별 페이지 번호를 따로 관리하고 스크롤 끝에서 10개씩 추가 | `SourceView.vue` |
| `TreeView.vue` | 자기 자신을 재귀 호출해 폴더/파일 트리를 그리는 컴포넌트. 트리 항목 타입 `TreeItem`을 export함. 펼침 토글은 아직 `console.log`만 하고 상태를 바꾸지 않음(직접 대입 방식의 코드가 주석으로 남아 있음) | `testViews/SourceTreeView.vue` |
| `IndexComponent.vue` | 전달받은 인덱스 값을 테두리 안에 출력하는 디버그용 최소 컴포넌트 | `SourceView.vue` |
| `ProductList.vue` | Vuex 쇼핑카트 예제의 상품 목록. 재고가 없으면 담기 버튼 비활성화 | 메뉴 `/basic/products` |
| `ShoppingCart.vue` | Vuex 쇼핑카트 예제의 장바구니·결제. 결제는 목 API라 50% 확률로 실패 | 메뉴 `/basic/cart` |
| `InputTodo.vue` | 투두 입력창. `useStore()`로 `src/constant.ts`의 `ADD_TODO` mutation을 commit. `todolist` 상태를 가진 스토어 모듈이 없어 실제 동작은 하지 않음 | 미사용 |
| `List.vue` | 투두 목록. 원래 파일 전체가 주석이던 참고용 코드를 `<script setup>`으로 살림. `InputTodo.vue`와 같은 이유로 실제 동작은 하지 않음 | 미사용 |
| `HelloWorld.vue` | Vue CLI 기본 샘플. `vue-class-component` 대신 `defineProps`로 `msg`를 받음 | 미사용 |
| `SourceTreeView.vue` | 빈 파일 | 미사용 |

정리 후보와 동작하지 않는 코드는 [NOTES.md](NOTES.md)에 모아 두었습니다.
