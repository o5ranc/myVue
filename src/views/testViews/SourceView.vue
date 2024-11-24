<template>
  <div>
    <div>코드보기</div>
    <div class="nocopy">
      <!-- <button @click="onClickCSSType">css 코드</button>
      <button @click="onClickMDType">markdown 코드</button> -->
      <Codemirror
        class="cm-devops"
        v-model="code"
        :style="{ height: '400px' }"
        :indent-with-tab="true"
        :tabSize="2"
        :disabled="false"
        :extensions="state.extensions"
      ></Codemirror>
    </div>
    <div style="margin-top: 20px">
      <el-button class="elbtn">el-btn 200px</el-button>
      <el-button class="elbtn h100px">el-btn 100px</el-button>
      <el-button type="info">type="info"</el-button>
      <el-button
        type="info"
        plain
      >
        type="info" plain
      </el-button>
      <el-button
        type="info"
        plain
        disabled
      >
        type="info" plain disabled
      </el-button>
      <el-button
        color="#4cd431"
        plain
      >
        custom color Plain
      </el-button>
      <br />
      <el-button-group class="ml-4">
        <el-button
          type="info"
          :plain="!state.isSideView"
          @click="state.isSideView = true"
        >
          line by line
        </el-button>
        <el-button
          type="info"
          :plain="state.isSideView"
          @click="state.isSideView = false"
        >
          side by side
        </el-button>
      </el-button-group>
    </div>
    <div class="table-section">
      <el-table
        ref="tableRef"
        :data="tableData"
        :max-height="state.tableMaxHeight"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column
          prop="date"
          label="Date"
          width="180"
        />
        <el-table-column
          prop="name"
          label="Name"
          width="180"
        />
        <el-table-column
          prop="address"
          label="Address"
        />
      </el-table>
      <div class="scroll-arrow">
        <el-button
          class="arrow-button"
          circle
          :icon="state.isTableExpanded ? ArrowUp : ArrowDown"
          @click="toggleTableHeight"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Codemirror } from 'vue-codemirror'
import { EditorView } from '@codemirror/view'
// import { EditorView, keymap } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark, oneDarkTheme } from '@codemirror/theme-one-dark'
import { reactive, readonly, ref, nextTick } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import type { ElTable } from 'element-plus'

interface State {
  extensions: Extension[]
  isSideView: boolean
  tableMaxHeight: number | undefined // number | undefined 타입 허용
  isTableExpanded: boolean
}

export default {
  components: {
    Codemirror,
  },

  setup() {
    const preventEvent = () => {
      return EditorView.domEventHandlers({
        copy: (event) => {
          event.preventDefault()
          alert('Copy is disabled!')
          console.log('Disable copy event!')
        },
        cut: (event) => {
          event.preventDefault()
          console.log('Disable cut event!')
        },
        paste: (event) => {
          event.preventDefault()
          console.log('Disable paste event!')
        },
      })
    }

    const tableRef = ref<InstanceType<typeof ElTable> | null>(null)

    const state = reactive<State>({
      extensions: [javascript(), preventEvent()],
      isSideView: true,
      tableMaxHeight: 250,
      isTableExpanded: false,
    })

    const code = ref(`
/* GitLab은 기본적으로 다음과 같은 폰트를 사용합니다:

폰트 패밀리: Menlo, Monaco, "Courier New", monospace
폰트 크기: 12px (보통 기본 설정)
줄 간격(line-height): 약 1.5 */

// 숫자 배열을 입력받아서 홀수의 값만 합치는 함수를 완성해 보세요.
// result 값이 아래아 같이 출력되어야 합니다.
// for문, if문, %(나머지) 연산자를 사용해 보세요.

function sumOdd(arr) {
    let sum = 0;
    // 이 부분을 완성해 보세요.
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 1) sum += arr[i];
    }
    return sum;
}

const result = sumOdd( [1,2,3,4,5 ] );
console.log(result); // 출력 결과: 9`)

    //     const onClickCSSType = () => {
    //       code.value = `//* .gowun-batang-regular {
    //   font-family: "Gowun Batang", serif;
    //   font-weight: 400;
    //   font-style: normal;
    // } */

    // * {
    //   font-family: "Noto Sans KR", sans-serif !important;
    //   font-optical-sizing: auto;
    //   font-weight: 400 !important;
    //   font-style: normal;
    // }

    // .to-block {
    //   display: block;
    // }

    // .btn-nobtn {
    //   background-color: transparent;
    //   border: 0px;
    //   color: #ffffff;
    //   cursor: pointer;
    // }
    // `
    //       state.extensions = [css(), preventEvent()]
    //     }

    //     const onClickMDType = () => {
    //       code.value = `# 가장큰 크기의 text로 변환
    // ## 그다음 작은 크기위 text로 변환
    // ### 그다음 작은 크기의 text로 변환
    // #### 그다음 작은 크기의 text로 변환
    // ##### 그다음 작은 크기의 text로 변환
    // ###### 그다음 작은 크기의 text로 변환
    // `
    //       state.extensions = [markdown(), preventEvent()]
    //     }

    const tableData = ref([
      {
        date: '2024-03-15',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2024-03-16',
        name: 'John',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2024-03-17',
        name: 'Morgan',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2024-03-18',
        name: 'Sarah',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2024-03-19',
        name: 'James',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2024-03-20',
        name: 'Emma',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2024-03-21',
        name: 'Michael',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ])

    const toggleTableHeight = () => {
      state.isTableExpanded = !state.isTableExpanded

      if (state.isTableExpanded) {
        // 테이블이 확장될 때는 약간의 지연을 주어 DOM이 업데이트될 시간을 줍니다
        nextTick(() => {
          if (tableRef.value) {
            const table = tableRef.value.$el
            const headerHeight = table.querySelector('.el-table__header-wrapper')?.offsetHeight || 0
            const bodyWrapper = table.querySelector('.el-table__body-wrapper')
            const bodyTable = bodyWrapper?.querySelector('.el-table__body')
            const fullHeight = (bodyTable?.offsetHeight || 0) + headerHeight + 10 // 여유 공간 10px 추가

            console.log(tableRef.value.$el)
            console.log(`table : ${table}`, { ...table })
            console.log(`headerHeight : ${headerHeight}`)
            console.dir(`bodyWrapper : ${bodyWrapper}`)
            console.dir(`bodyTable : ${bodyTable}`)
            console.log(`bodyTable?.offsetHeight  : ${bodyTable?.offsetHeight}`)
            console.log(`fullHeight : ${fullHeight}`)

            state.tableMaxHeight = fullHeight
          }
        })
      } else {
        state.tableMaxHeight = 250
      }
    }

    return {
      state,
      code,
      // onClickCSSType,
      // onClickMDType,
      tableData,
      tableRef,
      toggleTableHeight,
      ArrowDown,
      ArrowUp,
    }
  },
}
</script>

<style lang="css" scoped>
.nocopy {
  user-select: none;
}
/* CodeMirror 에디터의 기본 폰트 스타일 */
/* .CodeMirror {
  font-family: Menlo, Monaco, 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
} */

.cm-devops .cm-content {
  background-color: cadetblue;
  font-family: 'Gowun Batang', serif;
  font-size: 12px;
}

.elbtn {
  height: 100px;
}

.elbtn.h100px {
  height: 50px;
}

.table-section {
  margin-top: 20px;
  position: relative;
}

.scroll-arrow {
  text-align: center;
  margin-top: 10px;
}

.arrow-button {
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 12px;
}

/* 테이블 스크롤바 스타일링 */
.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
}

.el-table__body-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 테이블 전환 애니메이션 추가 */
.el-table {
  transition: max-height 0.3s ease-in-out;
}
</style>
