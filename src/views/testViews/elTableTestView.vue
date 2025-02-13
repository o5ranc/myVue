<template>
  <div>
    <div>
      <!--  체크박스가 있는 테이블  -->
      <el-table
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
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">
          Toggle selection status of second and third rows
        </el-button>
        <el-button @click="toggleSelection([tableData[1], tableData[2]], false)">
          Toggle selection status based on selectable
        </el-button>
        <el-button @click="toggleSelection()">Clear selection</el-button>
      </div>
    </div>
    <div>
      <el-table
        ref="editableTableRef"
        :data="editableTableData"
        style="width: 100%"
        :border="true"
      >
        <el-table-column label="Multi Input" width="200">
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
              :ref="el => { if (el) inputRefs[`${scope.$index}-0`] = el }"
            />
          </template>
        </el-table-column>
        <el-table-column label="Single Input" width="200">
          <template #default="scope">
            <el-input
              v-model="scope.row.singleInput"
              placeholder="Please input"
              @keydown.down="handleKeyDown($event, scope.$index, 1)"
              @keydown.up="handleKeyUp($event, scope.$index, 1)"
              @keydown.left="handleKeyLeft($event, scope.$index, 1)"
              @keydown.right="handleKeyRight($event, scope.$index, 1)"
              :ref="el => { if (el) inputRefs[`${scope.$index}-1`] = el }"
            />
          </template>
        </el-table-column>
        <el-table-column label="Another Single Input" width="200">
          <template #default="scope">
            <el-input
              v-model="scope.row.anotherInput"
              placeholder="Please input"
              @keydown.down="handleKeyDown($event, scope.$index, 2)"
              @keydown.up="handleKeyUp($event, scope.$index, 2)"
              @keydown.left="handleKeyLeft($event, scope.$index, 2)"
              @keydown.right="handleKeyRight($event, scope.$index, 2)"
              :ref="el => { if (el) inputRefs[`${scope.$index}-2`] = el }"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableInstance } from 'element-plus'

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
    anotherInput: ''
  },
  {
    id: 2,
    multiInput: '',
    singleInput: '',
    anotherInput: ''
  },
  {
    id: 3,
    multiInput: '',
    singleInput: '',
    anotherInput: ''
  }
]

const editableTableRef = ref<TableInstance>()
const inputRefs = ref<{ [key: string]: any }>({})

const focusInput = (rowIndex: number, colIndex: number) => {
  const key = `${rowIndex}-${colIndex}`
  const input = inputRefs.value[key]
  if (input) {
    if (colIndex === 0) {
      // textarea
      const textarea = input.$el.querySelector('textarea')
      textarea.focus()
      // 커서를 텍스트 끝으로 이동
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    } else {
      // regular input
      const inputEl = input.$el.querySelector('input')
      inputEl.focus()
      // 커서를 텍스트 끝으로 이동
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
</script>
