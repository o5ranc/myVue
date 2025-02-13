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
            />
          </template>
        </el-table-column>
        <el-table-column label="Single Input" width="200">
          <template #default="scope">
            <el-input
              v-model="scope.row.singleInput"
              placeholder="Please input"
            />
          </template>
        </el-table-column>
        <el-table-column label="Another Single Input" width="200">
          <template #default="scope">
            <el-input
              v-model="scope.row.anotherInput"
              placeholder="Please input"
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
    multiInput: '',
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
</script>
