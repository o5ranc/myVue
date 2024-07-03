<template>
  <div>ddd
    <div class="mb-4">
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </div>
    <div>
      <el-table border :data="state.boardList">
        <el-table-column prop="bno" label="글번호"></el-table-column>
        <el-table-column prop="title" label="제목"></el-table-column>
        <el-table-column prop="content" label="내용"></el-table-column>
        <el-table-column prop="writer" label="작성자"></el-table-column>
        <el-table-column prop="regDate" label="등록일" :formatter="DateFormat"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"

export default defineComponent({
  name: "ElementView",
  compnents: {
    // Add any components here
  },
  props: {
    // Add any props here
  },
  setup(props) {
    // Add any setup code here
    const state = reactive({
      message: "Hello Ran World",
      boardList: [
        { bno: 1, title: '제목1', content: '내용1', writer: '작성자1', regDate: '2021-09-01' },
        { bno: 2, title: '제목2', content: '내용2', writer: '작성자1', regDate: '2021-09-01' },
        { bno: 3, title: '제목3', content: '내용3', writer: '작성자1', regDate: '2021-09-01' },

      ]
    })

    return {
      selected: "",
      state,
      options: [
        { value: "option1", label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
        // Add more options as needed
      ]
    }
  }
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
