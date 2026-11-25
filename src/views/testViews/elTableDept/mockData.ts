// ElTableDeptTestView에서 쓰는 임의 테스트 데이터입니다.
// 확장 조건(배열 length > 0)과 표시를 확인할 수 있도록 일부러 여러 경우를 섞었습니다.
//  - dtSets가 비어 있는 요청 / 1개 / 여러 개인 요청
//  - hisLog가 비어 있는 dtSet / step 1개 / 3~8개인 dtSet
//  - deployState: SUCCESS, FAIL, RUNNING, WAITING, CANCELED
//  - step 상태: 이행대기(WAIT), 이행시작(START), 이행완료(DONE), 실패(FAIL)
import type { DeployListResponse, DtSet, HisLog, RegUser, StepState } from './types'

const STEP_NAMES = [
  '소스 체크아웃',
  '빌드',
  '단위 테스트',
  '이미지 푸시',
  '승인 대기',
  '배포',
  '헬스 체크',
  '결과 알림',
]

const USERS: Record<string, RegUser> = {
  kim: { userId: 'kimdev', userName: '김개발' },
  lee: { userId: 'leeops', userName: '이운영' },
  park: { userId: 'parkqa', userName: '박품질' },
  choi: { userId: 'choipm', userName: '최기획' },
}

/** 'YYYY-MM-DD HH:mm:ss' 형식으로 분 단위 더하기 */
function addMinutes(base: string, minutes: number): string {
  const d = new Date(base.replace(' ', 'T'))
  d.setMinutes(d.getMinutes() + minutes)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

/**
 * step 상태 배열로 hisLog를 만듭니다. 배열 길이가 곧 step 개수입니다.
 * 이행대기 시각은 모든 step에 있고, 이행시작은 START/DONE/FAIL, 이행완료는 DONE/FAIL에만 채웁니다.
 */
function makeHisLog(base: string, states: StepState[], failMessage = '오류가 발생해 중단되었습니다'): HisLog[] {
  return states.map((state, i) => {
    const waitDt = addMinutes(base, i * 7)
    const startDt = state === 'WAIT' ? null : addMinutes(waitDt, 1)
    const endDt = state === 'DONE' || state === 'FAIL' ? addMinutes(waitDt, 5) : null
    return {
      step: i + 1,
      stepName: STEP_NAMES[i % STEP_NAMES.length],
      state,
      waitDt,
      startDt,
      endDt,
      ...(state === 'FAIL' ? { message: failMessage } : {}),
    }
  })
}

const done = (n: number): StepState[] => Array<StepState>(n).fill('DONE')
const wait = (n: number): StepState[] => Array<StepState>(n).fill('WAIT')

function dtSet(
  dtSetId: string,
  env: DtSet['env'],
  user: RegUser,
  regDt: string,
  deployState: DtSet['deployState'],
  hisLog: HisLog[],
): DtSet {
  return { dtSetId, env, regUser: user, regDt, deployState, hisLog }
}

export const deployListResponse: DeployListResponse = {
  list: [
    {
      reqId: 1001,
      title: '로그인 화면 문구 수정',
      appName: 'web-portal',
      version: '1.4.2',
      regDt: '2026-11-20 09:12:00',
      // 3단계 모두 성공한 dtSet 하나
      dtSets: [
        dtSet('DT-1001-1', 'DEV', USERS.kim, '2026-11-20 09:15:00', 'SUCCESS',
          makeHisLog('2026-11-20 09:15:00', done(3))),
      ],
    },
    {
      reqId: 1002,
      title: '결제 모듈 버전 업그레이드',
      appName: 'payment-api',
      version: '2.0.0',
      regDt: '2026-11-21 10:00:00',
      // 여러 dtSet: 성공 / 실패 / 진행 중 / 아직 이력 없음(확장 불가)
      dtSets: [
        dtSet('DT-1002-1', 'DEV', USERS.kim, '2026-11-21 10:05:00', 'SUCCESS',
          makeHisLog('2026-11-21 10:05:00', done(5))),
        dtSet('DT-1002-2', 'STG', USERS.lee, '2026-11-21 13:30:00', 'FAIL',
          makeHisLog('2026-11-21 13:30:00', ['DONE', 'DONE', 'FAIL', 'WAIT'], '단위 테스트 12건 실패')),
        dtSet('DT-1002-3', 'STG', USERS.lee, '2026-11-22 09:00:00', 'RUNNING',
          makeHisLog('2026-11-22 09:00:00', ['DONE', 'DONE', 'DONE', 'START', 'WAIT', 'WAIT'])),
        dtSet('DT-1002-4', 'PRD', USERS.choi, '2026-11-22 09:10:00', 'WAITING', []),
      ],
    },
    {
      reqId: 1003,
      title: '공지사항 게시판 신규 개발',
      appName: 'web-portal',
      version: '1.5.0',
      regDt: '2026-11-22 14:20:00',
      // dtSets가 비어 있음 → 1단 확장 불가
      dtSets: [],
    },
    {
      reqId: 1004,
      title: '배치 스케줄 변경',
      appName: 'batch-worker',
      version: '0.9.7',
      regDt: '2026-11-23 08:40:00',
      // step이 1개뿐인 dtSet과 8개인 dtSet
      dtSets: [
        dtSet('DT-1004-1', 'DEV', USERS.park, '2026-11-23 08:45:00', 'SUCCESS',
          makeHisLog('2026-11-23 08:45:00', done(1))),
        dtSet('DT-1004-2', 'PRD', USERS.lee, '2026-11-23 18:00:00', 'SUCCESS',
          makeHisLog('2026-11-23 18:00:00', done(8))),
      ],
    },
    {
      reqId: 1005,
      title: '긴급 보안 패치',
      appName: 'auth-server',
      version: '3.1.1',
      regDt: '2026-11-24 07:55:00',
      // 취소된 배포와 대기 중(모든 step 이행대기) 배포
      dtSets: [
        dtSet('DT-1005-1', 'STG', USERS.kim, '2026-11-24 08:00:00', 'CANCELED',
          makeHisLog('2026-11-24 08:00:00', ['DONE', 'START', 'WAIT'])),
        dtSet('DT-1005-2', 'PRD', USERS.choi, '2026-11-24 08:30:00', 'WAITING',
          makeHisLog('2026-11-24 08:30:00', wait(4))),
      ],
    },
    {
      reqId: 1006,
      title: '대시보드 차트 성능 개선',
      appName: 'admin-console',
      version: '4.2.0',
      regDt: '2026-11-24 11:00:00',
      // 모든 dtSet의 hisLog가 비어 있음 → 1단은 펼쳐지지만 2단은 펼쳐지지 않음
      dtSets: [
        dtSet('DT-1006-1', 'DEV', USERS.park, '2026-11-24 11:05:00', 'WAITING', []),
        dtSet('DT-1006-2', 'STG', USERS.park, '2026-11-24 11:06:00', 'WAITING', []),
      ],
    },
    {
      reqId: 1007,
      title: '회원 등급 정책 반영',
      appName: 'member-api',
      version: '1.0.3',
      regDt: '2026-11-25 09:30:00',
      // 같은 요청 안에서 실패 후 재배포 성공, 운영 배포 진행 중
      dtSets: [
        dtSet('DT-1007-1', 'STG', USERS.lee, '2026-11-25 09:35:00', 'FAIL',
          makeHisLog('2026-11-25 09:35:00', ['DONE', 'FAIL'], '빌드 중 의존성 다운로드 실패')),
        dtSet('DT-1007-2', 'STG', USERS.lee, '2026-11-25 10:10:00', 'SUCCESS',
          makeHisLog('2026-11-25 10:10:00', done(4))),
        dtSet('DT-1007-3', 'PRD', USERS.choi, '2026-11-25 13:00:00', 'RUNNING',
          makeHisLog('2026-11-25 13:00:00', ['DONE', 'DONE', 'DONE', 'DONE', 'START', 'WAIT', 'WAIT'])),
      ],
    },
  ],
  totalCnt: 0,
}

deployListResponse.totalCnt = deployListResponse.list.length
