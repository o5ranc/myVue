// ElTableDeptTestView(3단 확장 테이블)에서 쓰는 타입입니다.
// 1단 list → 2단 dtSets → 3단 hisLog 순서로 중첩됩니다.

/** 배포 묶음(dtSet)의 전체 배포 상태 */
export type DeployState = 'SUCCESS' | 'FAIL' | 'RUNNING' | 'WAITING' | 'CANCELED'

/** step 하나의 진행 상태: 이행대기 → 이행시작 → 이행완료 (실패하면 FAIL) */
export type StepState = 'WAIT' | 'START' | 'DONE' | 'FAIL'

/** 등록자 */
export interface RegUser {
  userId: string
  userName: string
}

/** 3단: 배포 이력의 step 한 줄. step 개수는 dtSet마다 다릅니다 */
export interface HisLog {
  /** 1부터 시작하는 step 순서 */
  step: number
  stepName: string
  state: StepState
  /** 이행대기 시각 (대기열에 들어간 시각) */
  waitDt: string | null
  /** 이행시작 시각 */
  startDt: string | null
  /** 이행완료 시각 (실패했다면 실패 시각) */
  endDt: string | null
  /** 실패 등 참고 메시지 */
  message?: string
}

/** 2단: 요청 하나에 딸린 배포 묶음 */
export interface DtSet {
  dtSetId: string
  /** 배포 대상 환경 */
  env: 'DEV' | 'STG' | 'PRD'
  regUser: RegUser
  regDt: string
  deployState: DeployState
  hisLog: HisLog[]
}

/** 1단: 배포 요청 목록의 한 행 */
export interface DeployRequest {
  reqId: number
  title: string
  appName: string
  version: string
  regDt: string
  dtSets: DtSet[]
}

/** 목록 조회 응답 형태 */
export interface DeployListResponse {
  list: DeployRequest[]
  totalCnt: number
}
