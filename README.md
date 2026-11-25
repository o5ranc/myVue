# myVue

Vue 3 + TypeScript 학습용 저장소입니다. 하나의 완성된 애플리케이션이 아니라, **다양한 화면 표시 방식과 UI 패턴을 하나씩 만들어 보고 확인하는 실험장**입니다.

- Element Plus 테이블/탭, ECharts 차트, CodeMirror 에디터, 칸반 보드, 무한 스크롤, Sticky 헤더, CSS 스피너 등 주제별 테스트 화면이 `src/views/testViews/` 아래에 쌓여 있습니다.
- 앱을 열면 **왼쪽에 종류별 2단 메뉴, 오른쪽에 선택한 화면**이 나오는 메인 레이아웃이 뜹니다. 화면 목록은 `src/router/menu.ts` 한 곳에서 관리합니다. 자세한 내용은 [화면을 보는 방법](#화면을-보는-방법)을 참고하세요.

## 문서

| 문서 | 내용 |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 디렉터리 구조, 라우팅, 상태 관리, 빌드·툴링 설정 |
| [docs/SCREENS.md](docs/SCREENS.md) | 각 테스트 화면과 공용 컴포넌트의 역할 |
| [docs/NOTES.md](docs/NOTES.md) | 분석 중 확인된 미사용 코드와 정리 후보 |

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 프레임워크 | Vue 3.4, 모든 컴포넌트를 Composition API `<script setup lang="ts">`로 작성 |
| 언어 | TypeScript 5.4 (`.vue` 파일은 모두 TS, 쇼핑카트 스토어 모듈·목 API 등 일부 `.js`) |
| UI | Element Plus 2.7, Bootstrap 5, 직접 작성한 CSS |
| 라우팅 | Vue Router 4 (메인 레이아웃 + 중첩 라우트로 화면 전환) |
| 상태 관리 | Vuex 4 (멤버, 쇼핑카트), Pinia 2 (카운터 예제) |
| 차트 | ECharts 5 (실제 사용). ApexCharts도 설치되어 있으나 미사용 |
| 에디터·뷰어 | CodeMirror 6, CKEditor 5, Quill, TinyMCE, `diff` |
| 빌드 | Vue CLI 5 (webpack) — 실제 실행 경로. Vite 6 설정 파일도 함께 존재 |
| 코드 품질 | ESLint 8 + eslint-plugin-vue, Prettier 3 |

의존성 목록은 실험용으로 설치해 둔 것이 많아, `package.json`에 있는 패키지 중 상당수는 현재 코드에서 사용되지 않습니다.

## 시작하기

```bash
npm install     # 의존성 설치
npm run serve   # 개발 서버 (vue-cli-service, http://localhost:8080)
npm run build   # 프로덕션 빌드 → dist/
npm run lint    # ESLint 검사 및 자동 수정
```

Node.js 18 이상을 권장합니다.

### 테스트용 멤버 데이터 생성

`src/components/MemberSelector.vue`가 사용하는 `src/data/members.json`은 스크립트로 만듭니다.

```bash
node scripts/generateMembers.js   # 랜덤 멤버 300명 생성
```

## 화면을 보는 방법

`npm run serve`로 띄우면 메인 레이아웃(`src/layouts/MainLayout.vue`)이 나옵니다.

- 왼쪽 메뉴는 2단입니다. 1단은 화면 종류(Element Plus, 차트 · 코드 뷰어, 레이아웃 · CSS, 알림, 기본 · 상태 관리), 2단은 각 화면입니다.
- 항목을 누르면 주소가 `/viewer/chart`처럼 바뀌고, 오른쪽 영역(`<router-view />`)에 해당 화면이 표시됩니다. 오른쪽 위에는 지금 보는 화면의 파일 경로가 나옵니다.
- 첫 화면(`/`)은 전체 화면 목록입니다. 주소를 직접 입력하거나 새로고침해도 같은 화면이 열립니다.

### 화면을 추가하는 방법

`src/router/menu.ts`의 알맞은 그룹 `children`에 한 줄을 추가하면 메뉴와 라우트가 함께 생깁니다.

```ts
{
  title: '새 화면',                 // 메뉴 이름
  path: 'new-screen',              // → /그룹경로/new-screen
  component: () => import('@/views/testViews/NewScreen.vue'),
  file: 'views/testViews/NewScreen.vue',
},
```

새 종류가 필요하면 `screenMenu` 배열에 그룹을 하나 더 추가합니다. 각 화면의 설명은 [docs/SCREENS.md](docs/SCREENS.md)에 정리되어 있습니다.

> `ElTableUiTestView.vue`(Element Plus 테이블 종합)는 아직 저장소에 커밋되어 있지 않아 메뉴에서 빠져 있습니다. 파일을 커밋한 뒤 `menu.ts`의 해당 항목 주석을 해제하면 메뉴에 나타납니다.

## 디렉터리 개요

```
src/
├── App.vue              # 루트 컴포넌트 (<router-view />만 둠)
├── layouts/             # 메인 레이아웃 (왼쪽 2단 메뉴 + 오른쪽 화면 영역)
├── main.ts              # 앱 부트스트랩 (router + Element Plus 등록)
├── router/              # Vue Router 설정, menu.ts = 메뉴·라우트 목록
├── views/
│   ├── testViews/       # 주제별 테스트 화면
│   ├── alert/           # 포스트잇 스타일 알림 화면
│   └── data/            # 테스트용 대용량 텍스트 데이터
├── components/          # 여러 화면에서 쓰거나 쓰려고 만든 컴포넌트
├── store/               # Vuex 멤버 스토어 (모듈 방식)
├── stores/              # Pinia 스토어 + Vuex 쇼핑카트 모듈
├── services/            # axios 기반 API 호출 계층
├── types/               # 공용 TypeScript 타입
├── utils/               # 포맷 함수 등 공용 유틸
├── api/                 # 목(mock) API
└── data/                # 생성된 JSON 데이터
```

더 자세한 설명은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)에 있습니다.
