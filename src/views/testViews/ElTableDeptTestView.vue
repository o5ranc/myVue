<template>
  <div class="dept-test">
    <h1>3단 확장 테이블 (el-table expand)</h1>
    <p class="desc">
      1단은 배포 요청 <code>list</code>, 2단은 요청별 배포 묶음 <code>dtSets</code>, 3단은 묶음별 step 이력
      <code>hisLog</code>입니다. 하위 배열이 비어 있는 행은 펼침 아이콘이 나오지 않습니다.
    </p>

    <div class="toolbar">
      <span>
        총 <b>{{ response.totalCnt }}</b>건
      </span>
      <div>
        <el-button size="small" @click="expandAll">모두 펼치기</el-button>
        <el-button size="small" @click="collapseAll">모두 접기</el-button>
      </div>
    </div>

    <!-- 1단: list -->
    <el-table
      :data="response.list"
      row-key="reqId"
      :expand-row-keys="expandedReqIds"
      :row-class-name="reqRowClass"
      border
      @expand-change="onReqExpandChange"
    >
      <el-table-column type="expand" width="48">
        <template #default="{ row }: { row: DeployRequest }">
          <div v-if="row.dtSets.length > 0" class="nested nested-2">
            <!-- 2단: dtSets -->
            <el-table
              :data="row.dtSets"
              row-key="dtSetId"
              :expand-row-keys="expandedDtSetIds"
              :row-class-name="dtSetRowClass"
              size="small"
              border
              @expand-change="onDtSetExpandChange"
            >
              <el-table-column type="expand" width="48">
                <template #default="{ row: dt }: { row: DtSet }">
                  <div v-if="dt.hisLog.length > 0" class="nested nested-3">
                    <!-- 3단: hisLog. step 개수만큼 el-steps가 그려집니다 -->
                    <el-steps :space="140" align-center class="step-bar">
                      <el-step
                        v-for="log in dt.hisLog"
                        :key="log.step"
                        :title="log.stepName"
                        :description="STEP_STATE_LABEL[log.state]"
                        :status="STEP_STATE_STATUS[log.state]"
                      />
                    </el-steps>
                    <el-table :data="dt.hisLog" size="small" border>
                      <el-table-column prop="step" label="Step" width="64" align="center" />
                      <el-table-column prop="stepName" label="단계" min-width="110" />
                      <el-table-column label="상태" width="100" align="center">
                        <template #default="{ row: log }: { row: HisLog }">
                          <el-tag :type="STEP_STATE_TAG[log.state]" size="small" effect="plain">
                            {{ STEP_STATE_LABEL[log.state] }}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="이행대기" width="160">
                        <template #default="{ row: log }: { row: HisLog }">{{ log.waitDt ?? '-' }}</template>
                      </el-table-column>
                      <el-table-column label="이행시작" width="160">
                        <template #default="{ row: log }: { row: HisLog }">{{ log.startDt ?? '-' }}</template>
                      </el-table-column>
                      <el-table-column label="이행완료" width="160">
                        <template #default="{ row: log }: { row: HisLog }">{{ log.endDt ?? '-' }}</template>
                      </el-table-column>
                      <el-table-column label="메시지" min-width="160">
                        <template #default="{ row: log }: { row: HisLog }">
                          <span :class="{ 'fail-msg': log.state === 'FAIL' }">{{ log.message ?? '' }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="dtSetId" label="묶음 ID" width="110" />
              <el-table-column prop="env" label="환경" width="64" align="center" />
              <el-table-column label="등록자" width="150">
                <template #default="{ row: dt }: { row: DtSet }">
                  {{ dt.regUser.userName }} <span class="sub">({{ dt.regUser.userId }})</span>
                </template>
              </el-table-column>
              <el-table-column prop="regDt" label="등록일시" width="160" />
              <el-table-column label="배포 상태" width="110" align="center">
                <template #default="{ row: dt }: { row: DtSet }">
                  <el-tag :type="DEPLOY_STATE_TAG[dt.deployState]" size="small">{{ dt.deployState }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="진행" min-width="160">
                <template #default="{ row: dt }: { row: DtSet }">
                  <template v-if="dt.hisLog.length > 0">
                    <el-progress
                      :percentage="donePercent(dt)"
                      :status="dt.deployState === 'FAIL' ? 'exception' : dt.deployState === 'SUCCESS' ? 'success' : undefined"
                      :format="() => `${doneCount(dt)}/${dt.hisLog.length}`"
                    />
                  </template>
                  <span v-else class="sub">이력 없음</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="reqId" label="요청번호" width="90" align="center" />
      <el-table-column prop="title" label="요청 제목" min-width="200" />
      <el-table-column prop="appName" label="앱" width="130" />
      <el-table-column prop="version" label="버전" width="80" align="center" />
      <el-table-column prop="regDt" label="등록일시" width="160" />
      <el-table-column label="배포 묶음" width="90" align="center">
        <template #default="{ row }: { row: DeployRequest }">
          <span v-if="row.dtSets.length > 0">{{ row.dtSets.length }}건</span>
          <span v-else class="sub">없음</span>
        </template>
      </el-table-column>
      <el-table-column label="최근 배포 상태" width="130" align="center">
        <template #default="{ row }: { row: DeployRequest }">
          <el-tag v-if="latestDtSet(row)" :type="DEPLOY_STATE_TAG[latestDtSet(row)!.deployState]" size="small">
            {{ latestDtSet(row)!.deployState }}
          </el-tag>
          <span v-else class="sub">-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { DeployListResponse, DeployRequest, DeployState, DtSet, HisLog, StepState } from './elTableDept/types'
import { deployListResponse } from './elTableDept/mockData'

type TagType = 'success' | 'warning' | 'info' | 'primary' | 'danger'

const response = reactive<DeployListResponse>(deployListResponse)

const DEPLOY_STATE_TAG: Record<DeployState, TagType> = {
  SUCCESS: 'success',
  FAIL: 'danger',
  RUNNING: 'primary',
  WAITING: 'warning',
  CANCELED: 'info',
}

const STEP_STATE_LABEL: Record<StepState, string> = {
  WAIT: '이행대기',
  START: '이행시작',
  DONE: '이행완료',
  FAIL: '실패',
}

const STEP_STATE_TAG: Record<StepState, TagType> = {
  WAIT: 'info',
  START: 'primary',
  DONE: 'success',
  FAIL: 'danger',
}

/** el-step의 status 값 */
const STEP_STATE_STATUS: Record<StepState, 'wait' | 'process' | 'success' | 'error'> = {
  WAIT: 'wait',
  START: 'process',
  DONE: 'success',
  FAIL: 'error',
}

// ---- 펼침 상태 ----
// el-table은 행마다 펼침을 막는 옵션이 없어서, 하위 배열이 빈 행에 클래스를 붙이고
// CSS로 펼침 아이콘을 숨깁니다. 펼친 행은 expand-row-keys로 관리해 버튼으로도 열고 닫을 수 있습니다.
const expandedReqIds = ref<number[]>([])
const expandedDtSetIds = ref<string[]>([])

const reqRowClass = ({ row }: { row: DeployRequest }) => (row.dtSets.length > 0 ? '' : 'no-expand')
const dtSetRowClass = ({ row }: { row: DtSet }) => (row.hisLog.length > 0 ? '' : 'no-expand')

function onReqExpandChange(_row: DeployRequest, expandedRows: DeployRequest[]) {
  expandedReqIds.value = expandedRows.map((r) => r.reqId)
}

function onDtSetExpandChange(row: DtSet, expandedRows: DtSet[]) {
  // 2단 테이블은 1단 행마다 따로 있으므로, 이 테이블에 속한 id만 갈아 끼웁니다.
  const parent = response.list.find((r) => r.dtSets.some((d) => d.dtSetId === row.dtSetId))
  const siblingIds = new Set(parent?.dtSets.map((d) => d.dtSetId) ?? [])
  expandedDtSetIds.value = [
    ...expandedDtSetIds.value.filter((id) => !siblingIds.has(id)),
    ...expandedRows.map((d) => d.dtSetId),
  ]
}

function expandAll() {
  expandedReqIds.value = response.list.filter((r) => r.dtSets.length > 0).map((r) => r.reqId)
  expandedDtSetIds.value = response.list
    .flatMap((r) => r.dtSets)
    .filter((d) => d.hisLog.length > 0)
    .map((d) => d.dtSetId)
}

function collapseAll() {
  expandedReqIds.value = []
  expandedDtSetIds.value = []
}

// ---- 표시용 계산 ----
const latestDtSet = (row: DeployRequest): DtSet | undefined => row.dtSets[row.dtSets.length - 1]
const doneCount = (dt: DtSet) => dt.hisLog.filter((l) => l.state === 'DONE').length
const donePercent = (dt: DtSet) => Math.round((doneCount(dt) / dt.hisLog.length) * 100)
</script>

<style scoped>
.dept-test {
  padding: 20px;
}

.desc {
  color: #606266;
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.nested {
  padding: 8px 16px 12px 48px;
}

.nested-2 {
  background: #f5f7fa;
}

.nested-3 {
  background: #fff;
  border-radius: 4px;
}

.step-bar {
  margin: 8px 0 16px;
}

.sub {
  color: #909399;
  font-size: 12px;
}

.fail-msg {
  color: var(--el-color-danger);
}

/* 하위 배열이 빈 행은 펼침 아이콘을 숨기고 클릭도 막습니다 */
:deep(.no-expand .el-table__expand-icon) {
  visibility: hidden;
  pointer-events: none;
}
</style>
