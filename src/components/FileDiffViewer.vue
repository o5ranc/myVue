<template>
  <div class="file-diff-viewer">
    <div class="diff-header">
      <div class="file-info">
        <span>{{ fileName }}</span>
      </div>
    </div>
    <div
      class="diff-content"
      ref="diffContainer"
    >
      <table>
        <tbody>
          <tr
            v-for="(line, index) in diffLines"
            :key="index"
            :class="line.type"
          >
            <td class="line-number">{{ line.oldLineNumber }}</td>
            <td class="line-number">{{ line.newLineNumber }}</td>
            <td class="line-content">{{ line.content }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import { createTwoFilesPatch } from 'diff'

interface DiffLine {
  type: string
  oldLineNumber: number | null
  newLineNumber: number | null
  content: string
}

export default defineComponent({
  name: 'FileDiffViewer',
  props: {
    oldContent: {
      type: String as PropType<string>,
      required: true,
    },
    newContent: {
      type: String as PropType<string>,
      required: true,
    },
    fileName: {
      type: String as PropType<string>,
      default: 'unnamed file',
    },
  },
  setup(props) {
    const diffContainer = ref<HTMLElement | null>(null)
    const diffLines = ref<DiffLine[]>([])

    const parseDiff = () => {
      const patch = createTwoFilesPatch(props.fileName, props.fileName, props.oldContent, props.newContent)

      const lines = patch.split('\n').slice(4) // 헤더 제거
      let oldLineNumber = 0
      let newLineNumber = 0

      diffLines.value = lines.map((line: String): DiffLine => {
        const firstChar = line.charAt(0)
        let type = 'normal'
        let content = line

        if (firstChar === '+') {
          type = 'addition'
          newLineNumber++
          return {
            type,
            oldLineNumber: null,
            newLineNumber,
            content: content.substring(1),
          }
        } else if (firstChar === '-') {
          type = 'deletion'
          oldLineNumber++
          return {
            type,
            oldLineNumber,
            newLineNumber: null,
            content: content.substring(1),
          }
        } else {
          oldLineNumber++
          newLineNumber++
          return {
            type,
            oldLineNumber,
            newLineNumber,
            content: content.substring(1),
          }
        }
      })
    }

    onMounted(() => {
      parseDiff()
    })

    return {
      diffContainer,
      diffLines,
    }
  },
})
</script>

<style scoped>
.file-diff-viewer {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 16px;
}

.diff-header {
  background-color: #f6f8fa;
  border-bottom: 1px solid #ddd;
  padding: 8px 16px;
}

.diff-content {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
}

.line-number {
  color: #666;
  padding: 0 8px;
  text-align: right;
  width: 1%;
  min-width: 50px;
  background-color: #fafbfc;
  border-right: 1px solid #eee;
}

.line-content {
  padding: 0 8px;
  white-space: pre;
}

tr.addition {
  background-color: #e6ffec;
}

tr.deletion {
  background-color: #ffebe9;
}

tr:hover {
  background-color: #f6f8fa;
}

tr.addition:hover {
  background-color: #d2ebd8;
}

tr.deletion:hover {
  background-color: #f7d5d3;
}
</style>
