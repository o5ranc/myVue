# myVue

Vue 3 + TypeScript 학습용 저장소입니다. 하나의 완성된 애플리케이션이 아니라, **다양한 화면 표시 방식과 UI 패턴을 하나씩 만들어 보고 확인하는 실험장**입니다.

- Element Plus 테이블/탭, ECharts 차트, CodeMirror 에디터, 칸반 보드, 무한 스크롤, Sticky 헤더, CSS 스피너 등 주제별 테스트 화면이 `src/views/testViews/` 아래에 쌓여 있습니다.
- 화면 전환은 라우터가 아니라 `src/App.vue`에서 **보고 싶은 컴포넌트의 주석을 해제하는 방식**으로 합니다. 자세한 내용은 [화면을 바꿔 보는 방법](#화면을-바꿔-보는-방법)을 참고하세요.

## 문서

| 문서 | 내용 |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 디렉터리 구조, 라우팅, 상태 관리, 빌드·툴링 설정 |
| [docs/SCREENS.md](docs/SCREENS.md) | 각 테스트 화면과 공용 컴포넌트의 역할 |
| [docs/NOTES.md](docs/NOTES.md) | 분석 중 확인된 미사용 코드와 정리 후보 |

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 프레임워크 | Vue 3.4 (Options API / Composition API / `<script setup>` 혼용) |
| 언어 | TypeScript 5.4, 일부 JavaScript |
| UI | Element Plus 2.7, Bootstrap 5, 직접 작성한 CSS |
| 라우팅 | Vue Router 4 (현재는 거의 사용하지 않음) |
| 상태 관리 | Vuex 4, Pinia 2 (둘 다 포함되어 있으나 앱에 등록되어 있지 않음) |
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

## 화면을 바꿔 보는 방법

`src/App.vue`의 `<template>`에는 테스트 화면들이 주석으로 나열되어 있고, 그중 하나만 활성화되어 있습니다. 다른 화면을 보려면 세 곳을 함께 수정합니다.

1. `<template>`에서 보려는 컴포넌트 태그의 주석을 해제하고, 기존에 열려 있던 태그는 주석 처리합니다.
2. `<script>`의 `import` 문에서 같은 컴포넌트의 주석을 해제합니다.
3. `components` 옵션에 해당 컴포넌트 등록을 해제합니다.

예를 들어 칸반 보드를 보려면 `<KanbanList />`, `import KanbanList ...`, `components: { KanbanList }` 세 줄을 모두 살립니다.

현재 기본값은 `ElTableTestView`입니다. 선택할 수 있는 화면 목록은 [docs/SCREENS.md](docs/SCREENS.md)에 정리되어 있습니다.

## 디렉터리 개요

```
src/
├── App.vue              # 루트 컴포넌트 겸 화면 선택 스위치
├── main.ts              # 앱 부트스트랩 (router + Element Plus 등록)
├── router/              # Vue Router 설정 (/, /member)
├── views/
│   ├── testViews/       # 주제별 테스트 화면
│   ├── alert/           # 포스트잇 스타일 알림 화면
│   └── data/            # 테스트용 대용량 텍스트 데이터
├── components/          # 여러 화면에서 쓰거나 쓰려고 만든 컴포넌트
├── store/               # Vuex 멤버 스토어 (모듈 방식)
├── stores/              # Pinia 스토어 + Vuex 쇼핑카트 모듈
├── services/            # axios 기반 API 호출 계층
├── types/               # 공용 TypeScript 타입
├── api/                 # 목(mock) API
└── data/                # 생성된 JSON 데이터
```

더 자세한 설명은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)에 있습니다.
