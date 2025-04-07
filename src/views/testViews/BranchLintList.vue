<template>
  <div>
    <h1>Branch Lint List</h1>
    <el-select style="width: 200px; margin-bottom: 20px;">
      <el-option label="ACT_DEV" value="ACT_DEV" />
      <el-option label="ACT_TST" value="ACT_TST" />
      <el-option label="ACT_DEV_TEST1" value="ACT_DEV_TEST1" />
      <el-option label="ACT_DEV_TEST2" value="ACT_DEV_TEST2" />
      <el-option label="ACT_DEV_TEST3" value="ACT_DEV_TEST3" />
    </el-select>

    <el-table :data="getAllLintItems" style="width: 700px" @expand-change="handleExpandClick">
      <el-table-column type="expand">
        <template #expand="{ row }">
          <div v-if="row.progress === 100 && row.result === 'fail' && row.showDetails">
            <el-table :data="row.commitDetails" style="width: 100%; margin-top: 0; border-top: none;">
              <el-table-column prop="message" label="Commits Message" />
              <el-table-column prop="user" label="Commit User" width="150" />
              <el-table-column prop="time" label="Commits 시간" width="180" />
              <el-table-column prop="sha" label="SHA" width="100" />
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="결과" width="100" >
        <template #default="{ row }">
          <el-tag v-if="row.progress > 0 && row.progress < 100" type="success">진행중</el-tag>
          <el-tag v-else-if="row.progress === 100" type="success">
            {{ row.result }}
          </el-tag>
          <el-tag v-else type="danger">
            {{ row.result }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="내용"/>
      <el-table-column prop="range" label="영향범위"/>
      <el-table-column label="작업" width="150">
        <template #default="{ row }">
          <div v-if="row.progress === 100 && row.result === 'fail'">
            <el-button size="small" type="primary" @click="recheckItem(row)">재조회</el-button>
            <el-button 
              size="small" 
              type="info" 
              @click="toggleDetails(row)"
              :icon="row.showDetails ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            >
              {{ row.showDetails ? '접기' : '더보기' }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, computed, ref, nextTick } from 'vue'

interface LintItem {
  content: string;
  coment: string;
  result: string;
  range: string;
  functionName: string;
  progress?: number;
  showDetails?: boolean;
  commitDetails?: CommitDetail[];
  stage?: string;
}

interface CommitDetail {
  message: string;
  user: string;
  time: string;
  sha: string;
}

export default defineComponent({
  name: 'BranchLintList',
  setup() {
    const state = reactive({
      fbLintList: [{
          stage: 'ACT_DEV',
          lintItem: [{
            content: 'dev에서 생성한 피쳐 브랜치 혹은 Rebase한 이력?',
            coment: '피쳐, Main 비교 Merge commits 중 into "dev" 이력 존재 확인',
            result: 'PROCESSING',
            range: 'Critical',
            functionName: 'function1("dev")',
            progress: 0  // 초기값 설정
          },
          {
            content: 'dev에서 생성한 피쳐 브랜치 혹은 Rebase한 이력?',
            coment: '피쳐, Main 비교 Merge commits 중 into "dev" 이력 존재 확인',
            result: 'PROCESSING',
            range: 'Critical',
            functionName: 'function2("dev")',
            progress: 0  // 초기값 설정
          },
          {
            content: 'dev에 머지 안한 것 있음?',
            coment: '피쳐, Main 비교 Merge commits 중 into "dev" 이력 존재 확인',
            result: 'PROCESSING',
            range: 'Critical',
            functionName: 'function3("dev")',
            progress: 0  // 초기값 설정
          },
          ]
        },
        {
          stage: 'ACT_TST',
          lintItem: [{
              content: 'tst 생성한 피쳐 브랜치 혹은 Rebase한 이력1111?',
              coment: '피쳐, Main 비교 Merge commits 중 into "dev" 이력 존재 확인',
              result: 'PROCESSING',
              range: 'Critical',
              functionName: 'function1("tst")',
              progress: 0  // 초기값 설정
            },
            {
              content: 'tst 생성한 피쳐 브랜치 혹은 Rebase한 이력2222?',
              coment: '피쳐, Main 비교 Merge commits 중 into "dev" 이력 존재 확인',
              result: 'PROCESSING',
              range: 'Critical',
              functionName: 'function2("tst")',
              progress: 0  // 초기값 설정
            }, 
            {
              content: 'tst 생성한 피쳐 브랜치 혹은 Rebase한 이력333?',
              coment: '피쳐, Main 비교 Merge commits 중 into "dev" 이력 존재 확인',
              result: 'PROCESSING',
              range: 'Critical',
              functionName: 'function3("tst")',
              progress: 0  // 초기값 설정
            },
          ]
        },
        {
          stage: 'ACT_DEV_TEST',
          lintItem: [{
            content: 'prd 생성한 피쳐 브랜치 혹은 Rebase한 이력1111?',
            coment: '피쳐, Main 비교 Merge commits 중 into "dev" 이력 존재 확인',
            result: 'PROCESSING',
            range: 'Critical',
            functionName: 'function4()',
            progress: 0  // 초기값 설정
          },
          ]
        },
      ]
    })

    // 커밋 상세 정보 관련 상태
    const commitDialogVisible = ref(false)
    const commitDetails = ref<CommitDetail[]>([])

    onMounted(() => {
      executeAllFunctions()
    })

    // 모든 lintItem을 하나의 배열로 합치는 computed 속성
    const getAllLintItems = computed(() => {
      return state.fbLintList.flatMap(item => 
        item.lintItem.map(lintItem => ({
          ...lintItem,
          stage: item.stage,
          showDetails: false,
          commitDetails: [],
          status: lintItem.progress === 100 && lintItem.result === 'fail' ? 'fail' : ''
        }))
      )
    })

    // 함수 매핑 객체 정의
    const functionMap = {
      function1: async (param: string, updateProgress: (progress: number) => void) => {
        const delay = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000;
        const startTime = Date.now();
        
        // 진행률 업데이트를 위한 인터벌
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(Math.floor((elapsed / delay) * 100), 99);
          updateProgress(progress);
        }, 100);

        await new Promise(resolve => setTimeout(resolve, delay));
        clearInterval(interval);
        updateProgress(100);
        
        // 랜덤하게 성공/실패 결정
        const isSuccess = Math.random() > 0.3; // 70% 확률로 성공
        return isSuccess ? 'pass' : 'fail';
      },
      function2: async (param: string, updateProgress: (progress: number) => void) => {
        const delay = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000;
        const startTime = Date.now();
        
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(Math.floor((elapsed / delay) * 100), 99);
          updateProgress(progress);
        }, 100);

        await new Promise(resolve => setTimeout(resolve, delay));
        clearInterval(interval);
        updateProgress(100);
        
        const isSuccess = Math.random() > 0.3;
        return isSuccess ? 'pass' : 'fail';
      },
      function3: async (param: string, updateProgress: (progress: number) => void) => {
        const delay = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000;
        const startTime = Date.now();
        
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(Math.floor((elapsed / delay) * 100), 99);
          updateProgress(progress);
        }, 100);

        await new Promise(resolve => setTimeout(resolve, delay));
        clearInterval(interval);
        updateProgress(100);
        
        const isSuccess = Math.random() > 0.3;
        return isSuccess ? 'pass' : 'fail';
      },
      function4: async (updateProgress: (progress: number) => void) => {
        const delay = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000;
        const startTime = Date.now();
        
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(Math.floor((elapsed / delay) * 100), 99);
          updateProgress(progress);
        }, 100);

        await new Promise(resolve => setTimeout(resolve, delay));
        clearInterval(interval);
        updateProgress(100);
        
        const isSuccess = Math.random() > 0.3;
        return isSuccess ? 'pass' : 'fail';
      }
    }

    // 모든 함수를 병렬로 실행하는 메서드
    const executeAllFunctions = async () => {
      const allPromises = state.fbLintList.flatMap(stage => 
        stage.lintItem.map(item => {
          const match = item.functionName.match(/(\w+)\(/)
          
          if (match) {
            const funcName = match[1]
            const paramMatch = item.functionName.match(/\((.*?)\)/)
            const param = paramMatch ? paramMatch[1] : ''
            
            // 진행률 업데이트 함수
            const updateProgress = (progress: number) => {
              item.progress = progress;
            }
            
            if (funcName === 'function4') {
              return functionMap.function4(updateProgress)
                .then(result => {
                  item.result = result;
                });
            } else {
              return functionMap[funcName as 'function1' | 'function2' | 'function3'](param, updateProgress)
                .then(result => {
                  item.result = result;
                });
            }
          }
          return null
        }).filter(Boolean)
      )

      try {
        await Promise.all(allPromises)
        console.log('모든 함수 실행 완료')
      } catch (error) {
        console.error('함수 실행 중 에러 발생:', error)
      }
    }

    // 재조회 함수
    const recheckItem = (item: LintItem) => {
      // 해당 항목만 다시 실행
      const match = item.functionName.match(/(\w+)\(/)
      
      if (match) {
        const funcName = match[1]
        const paramMatch = item.functionName.match(/\((.*?)\)/)
        const param = paramMatch ? paramMatch[1] : ''
        
        // 진행률 초기화
        item.progress = 0
        item.result = 'PROCESSING'
        
        // 진행률 업데이트 함수
        const updateProgress = (progress: number) => {
          item.progress = progress
        }
        
        if (funcName === 'function4') {
          functionMap.function4(updateProgress)
            .then(result => {
              item.result = result
            })
        } else {
          functionMap[funcName as 'function1' | 'function2' | 'function3'](param, updateProgress)
            .then(result => {
              item.result = result
            })
        }
      }
    }
    
    // 더보기 함수
    const toggleDetails = (item: LintItem) => {
      console.log('더보기 클릭 전:', item.showDetails);
      
      if (!item.commitDetails || item.commitDetails.length === 0) {
        // 랜덤한 커밋 정보 생성
        const users = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown']
        const messages = [
          'Fix bug in login process',
          'Update README with new instructions',
          'Refactor authentication module',
          'Add new feature for user profile',
          'Fix responsive design issues',
          'Update dependencies to latest versions',
          'Implement new API endpoint',
          'Fix memory leak in background process',
          'Add unit tests for core functionality',
          'Optimize database queries'
        ]
        
        // 랜덤한 3개의 커밋 생성
        const randomCommits: CommitDetail[] = []
        
        for (let i = 0; i < 3; i++) {
          const randomUser = users[Math.floor(Math.random() * users.length)]
          const randomMessage = messages[Math.floor(Math.random() * messages.length)]
          const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
          const formattedDate = randomDate.toISOString().replace('T', ' ').substring(0, 19)
          const randomSha = Math.random().toString(36).substring(2, 10)
          
          randomCommits.push({
            message: randomMessage,
            user: randomUser,
            time: formattedDate,
            sha: randomSha
          })
        }
        
        // Vue의 반응형 시스템을 활용하여 데이터 업데이트
        item.commitDetails = [...randomCommits];
      }
      
      // showDetails 속성을 토글
      item.showDetails = !item.showDetails;
      
      // Vue의 nextTick을 사용하여 DOM 업데이트 후 처리
      nextTick(() => {
        console.log('DOM 업데이트 후 처리 시작');
        const table = document.querySelector('.el-table');
        
        if (table) {
          const rows = table.querySelectorAll('.el-table__row');
          
          rows.forEach((row, index) => {
            const currentItem = getAllLintItems.value[index];
            
            // 객체의 고유 속성을 비교
            if (currentItem.functionName === item.functionName && 
                currentItem.content === item.content && 
                currentItem.stage === item.stage) {
              console.log('일치하는 행 찾음:', row);
              
              // expand 버튼 클릭 이벤트를 시뮬레이션
              const expandIcon = row.querySelector('.el-table__expand-icon');
              if (expandIcon) {
                // expand 상태 토글
                if (item.showDetails) {
                  // 펼치기
                  (expandIcon as HTMLElement).classList.add('el-table__expand-icon--expanded');
                  (row as HTMLElement).classList.add('expanded');
                  
                  // expand 행 표시
                  const expandRow = row.nextElementSibling;
                  if (expandRow && expandRow.classList.contains('el-table__expanded-cell')) {
                    (expandRow as HTMLElement).style.display = 'table-row';
                  }
                } else {
                  // 접기
                  (expandIcon as HTMLElement).classList.remove('el-table__expand-icon--expanded');
                  (row as HTMLElement).classList.remove('expanded');
                  
                  // expand 행 숨기기
                  const expandRow = row.nextElementSibling;
                  if (expandRow && expandRow.classList.contains('el-table__expanded-cell')) {
                    (expandRow as HTMLElement).style.display = 'none';
                  }
                }
              }
            }
          });
        }
      });
      
      console.log('더보기 클릭 후:', item.showDetails, item.commitDetails);
    }

    // expand 버튼 클릭 이벤트 핸들러
    const handleExpandClick = (row: LintItem) => {
      if (row.progress === 100 && row.result === 'fail') {
        toggleDetails(row)
      }
    }

    return { 
      state, 
      getAllLintItems, 
      executeAllFunctions,
      recheckItem,
      toggleDetails,
      handleExpandClick
    }
  }
})
</script>

<style scoped>
.el-table {
  margin-bottom: 0;
}

</style>
