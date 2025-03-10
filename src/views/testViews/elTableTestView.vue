<template>
  <div>
    <div>
      <!--  체크박스가 있는 테이블  -->
      <!-- <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        :border="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :selectable="selectable"
          width="55"
        />
        <el-table-column
          label="Date"
          width="120"
        >
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          property="name"
          label="Name"
          width="120"
        />
        <el-table-column
          property="address"
          label="Address"
        />
      </el-table> -->
      <!-- <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">
          Toggle selection status of second and third rows
        </el-button>
        <el-button @click="toggleSelection([tableData[1], tableData[2]], false)">
          Toggle selection status based on selectable
        </el-button>
        <el-button @click="toggleSelection()">Clear selection</el-button>
      </div> -->
      <el-button @click="showColumnSelector = !showColumnSelector">컬럼 선택</el-button>

      <!-- 컬럼 선택 영역 -->
      <div
        v-show="showColumnSelector"
        class="column-selector"
      >
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          전체 선택
        </el-checkbox>
        <el-checkbox-group
          v-model="checkedColumns"
          @change="handleCheckedColumnsChange"
        >
          <el-checkbox
            v-for="column in columns"
            :key="column.prop"
            :label="column.prop"
          >
            {{ column.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div>
      <el-table
        ref="editableTableNewRef"
        :data="editableTableData"
        style="width: 100%"
        :border="true"
      >
        <el-table-column
          v-if="columns.find((column) => column.prop === 'date')"
          label="Multi Input"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.multiInput"
              type="textarea"
              :rows="3"
              placeholder="Please input"
              @keydown.down="handleKeyDown($event, scope.$index, 0)"
              @keydown.up="handleKeyUp($event, scope.$index, 0)"
              @keydown.left="handleKeyLeft($event, scope.$index, 0)"
              @keydown.right="handleKeyRight($event, scope.$index, 0)"
              :ref="
                (el) => {
                  if (el) inputRefs[`${scope.$index}-0`] = el
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="columns.find((column) => column.prop === 'name')"
          label="Single Input"
          width="200"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.singleInput"
              placeholder="Please input"
              @keydown.down="handleKeyDown($event, scope.$index, 1)"
              @keydown.up="handleKeyUp($event, scope.$index, 1)"
              @keydown.left="handleKeyLeft($event, scope.$index, 1)"
              @keydown.right="handleKeyRight($event, scope.$index, 1)"
              @focus="(e) => handleFocus(e, 1)"
              :ref="
                (el) => {
                  if (el) inputRefs[`${scope.$index}-1`] = el
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="columns.find((column) => column.prop === 'address')"
          label="Address"
          width="200"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.anotherInput"
              placeholder="Please input"
              @keydown.down="handleKeyDown($event, scope.$index, 2)"
              @keydown.up="handleKeyUp($event, scope.$index, 2)"
              @keydown.left="handleKeyLeft($event, scope.$index, 2)"
              @keydown.right="handleKeyRight($event, scope.$index, 2)"
              :ref="
                (el) => {
                  if (el) inputRefs[`${scope.$index}-2`] = el
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          v-for="column in visibleColumns"
          :key="column.label"
          :prop="column.prop"
          :label="column.label"
          :min-width="column.minWidth"
          :width="column.width"
          :align="column.align"
        ></el-table-column>
      </el-table>
    </div>
    <!-- <div>
      <el-table
        ref="editableTableRef"
        :data="editableTableData"
        style="width: 100%"
        :border="true"
      >
        <el-table-column
          label="Multi Input"
          width="200"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.multiInput"
              type="textarea"
              :rows="3"
              placeholder="Please input"
              @keydown.down="handleKeyDown($event, scope.$index, 0)"
              @keydown.up="handleKeyUp($event, scope.$index, 0)"
              @keydown.left="handleKeyLeft($event, scope.$index, 0)"
              @keydown.right="handleKeyRight($event, scope.$index, 0)"
              :ref="
                (el) => {
                  if (el) inputRefs[`${scope.$index}-0`] = el
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          label="Single Input"
          width="200"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.singleInput"
              placeholder="Please input"
              @keydown.down="handleKeyDown($event, scope.$index, 1)"
              @keydown.up="handleKeyUp($event, scope.$index, 1)"
              @keydown.left="handleKeyLeft($event, scope.$index, 1)"
              @keydown.right="handleKeyRight($event, scope.$index, 1)"
              @focus="(e) => handleFocus(e, 1)"
              :ref="
                (el) => {
                  if (el) inputRefs[`${scope.$index}-1`] = el
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          label="Another Single Input"
          width="200"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.anotherInput"
              placeholder="Please input"
              @keydown.down="handleKeyDown($event, scope.$index, 2)"
              @keydown.up="handleKeyUp($event, scope.$index, 2)"
              @keydown.left="handleKeyLeft($event, scope.$index, 2)"
              @keydown.right="handleKeyRight($event, scope.$index, 2)"
              :ref="
                (el) => {
                  if (el) inputRefs[`${scope.$index}-2`] = el
                }
              "
            />
          </template>
        </el-table-column>
      </el-table>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { TableInstance } from 'element-plus'
import type { CheckboxValueType } from 'element-plus'
import { renderBlock } from 'element-plus/es/utils'

interface User {
  id: number
  date: string
  name: string
  address: string
}

interface EditableRow {
  id: number
  multiInput: string
  singleInput: string
  anotherInput: string
}

const multipleTableRef = ref<TableInstance>()
const multipleSelection = ref<User[]>([])
// const checkedColumns = ref(['phone1'])

const checkAll = ref(false)
const isIndeterminate = ref(true)
const selectable = (row: User) => ![1, 2].includes(row.id)

const toggleSelection = (rows?: User[], ignoreSelectable?: boolean) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, undefined, ignoreSelectable)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 5,
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 6,
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 7,
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const editableTableData: EditableRow[] = [
  {
    id: 1,
    multiInput: 'ㄴㅇㄻㄴㅇㅁㄴㅇㄻㄴㄹㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㄹㄴㅇㅊㅈㄷㄱㅊㄷㄴㅇㅇㄹㄴㄹㄴㅇㄹㄴㅇㄹㄴㄹㄹ',
    singleInput: '',
    anotherInput: '',
  },
  {
    id: 2,
    multiInput: '',
    singleInput: '',
    anotherInput: '',
  },
  {
    id: 3,
    multiInput: '',
    singleInput: '',
    anotherInput: '',
  },
]

const editableTableRef = ref<TableInstance>()
const inputRefs = ref<{ [key: string]: any }>({})
const columns = ref([
  {
    prop: 'date',
    label: 'Multi Input',
    align: 'left',
  },
  {
    prop: 'name',
    label: 'Single Input',
    width: 200,
    align: 'left',
  },
  {
    prop: 'address',
    label: 'Multi Input',
    width: 200,
    align: 'left',
  },
])

const focusInput = (rowIndex: number, colIndex: number) => {
  const key = `${rowIndex}-${colIndex}`
  const input = inputRefs.value[key]
  if (input) {
    if (colIndex === 0) {
      // textarea
      const textarea = input.$el.querySelector('textarea')
      textarea.focus()
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    } else if (colIndex === 1) {
      // 중간 컬럼의 input만 전체 선택
      const inputEl = input.$el.querySelector('input')
      inputEl.focus()
      inputEl.select()
    } else {
      // 마지막 컬럼의 input은 커서만 끝으로
      const inputEl = input.$el.querySelector('input')
      inputEl.focus()
      inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length)
    }
  }
}

const handleKeyDown = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const isTextarea = target instanceof HTMLTextAreaElement

  if (isTextarea) {
    const textarea = target
    const lines = textarea.value.split('\n')
    const currentLine = textarea.value.substr(0, textarea.selectionStart).split('\n').length

    // 마지막 줄이고 커서가 텍스트 끝에 있는 경우에만 다음 행으로 이동
    if (currentLine === lines.length && textarea.selectionStart === textarea.value.length) {
      if (rowIndex < editableTableData.length - 1) {
        event.preventDefault()
        focusInput(rowIndex + 1, colIndex)
      }
    }
  } else {
    // 일반 input의 경우 커서가 텍스트 끝에 있을 때만 다음 행으로 이동
    if (target.selectionStart === target.value.length) {
      if (rowIndex < editableTableData.length - 1) {
        event.preventDefault()
        focusInput(rowIndex + 1, colIndex)
      }
    }
  }
}

const handleKeyUp = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const isTextarea = target instanceof HTMLTextAreaElement

  if (isTextarea) {
    const textarea = target
    const currentLine = textarea.value.substr(0, textarea.selectionStart).split('\n').length

    // 첫 번째 줄이고 커서가 텍스트 시작점에 있는 경우에만 이전 행으로 이동
    if (currentLine === 1 && textarea.selectionStart === 0) {
      if (rowIndex > 0) {
        event.preventDefault()
        focusInput(rowIndex - 1, colIndex)
      }
    }
  } else {
    // 일반 input의 경우 커서가 텍스트 시작점에 있을 때만 이전 행으로 이동
    if (target.selectionStart === 0) {
      if (rowIndex > 0) {
        event.preventDefault()
        focusInput(rowIndex - 1, colIndex)
      }
    }
  }
}

const handleKeyLeft = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement

  // 커서가 텍스트 시작점에 있을 때만 왼쪽 셀로 이동
  if (target.selectionStart === 0) {
    if (colIndex > 0) {
      event.preventDefault()
      focusInput(rowIndex, colIndex - 1)
    }
  }
}

const handleKeyRight = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement

  // 커서가 텍스트 끝에 있을 때만 오른쪽 셀로 이동
  if (target.selectionStart === target.value.length) {
    if (colIndex < 2) {
      event.preventDefault()
      focusInput(rowIndex, colIndex + 1)
    }
  }
}

// input 포커스 이벤트 핸들러 수정
const handleFocus = (event: FocusEvent, colIndex: number) => {
  const target = event.target as HTMLInputElement
  if (colIndex === 1) {
    target.select()
  }
}

// 컬럼 선택 관련 상태 추가
const showColumnSelector = ref(false)
const checkedColumns = ref(columns.value.map((col) => col.prop))

// 체크박스 관련 메서드 수정
const handleCheckAllChange = (val: boolean) => {
  checkedColumns.value = val ? columns.value.map((col) => col.prop) : []
  isIndeterminate.value = false
  console.log('handleCheckAllChange checkedColumns : ', checkedColumns.value)
}

const handleCheckedColumnsChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === columns.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < columns.value.length
}

// computed 속성 추가
const visibleColumns = computed(() => {
  return columns.value.filter((col) => checkedColumns.value.includes(col.prop))
})

const handleClick = () => {}
</script>

<style scoped>
.column-selector {
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
}
</style>
