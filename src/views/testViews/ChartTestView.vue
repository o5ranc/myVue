<template>
  <div style="position: relative">
    <div style="width: 100%; height: 30px; border: 1px solid black">
      <button @click="toggleLayer">레이어on/off</button>
    </div>
    <div
      v-if="showLayer"
      style="
        position: absolute;
        z-index: 1000;
        width: 200px;
        border: 1px solid #ccc;
        padding: 10px;
        margin-top: 5px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      "
    >
      <ul style="list-style: none; padding: 0; margin: 0">
        <li
          v-for="(item, index) in sampleList"
          :key="index"
          style="padding: 5px 0"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div
      id="chartContainer"
      style="width: 800px; height: 400px"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 레이어 표시 여부를 위한 상태 변수
const showLayer = ref(false)
// 샘플 목록 데이터
const sampleList = ref(['샘플 1', '샘플 2', '샘플 3', '샘플 4', '샘플 5'])

// 레이어 토글 함수
const toggleLayer = () => {
  showLayer.value = !showLayer.value
}

onMounted(() => {
  var myChart = echarts.init(document.getElementById('chartContainer'))

  const tasks = [
    {
      name: '모니터링',
      subtasks: [
        {
          name: '서버 모니터링',
          start: '3/1',
          end: '3/10',
          members: [
            { name: '김철수', start: '3/1', end: '3/10' },
            { name: '이영희', start: '3/1', end: '3/10' },
            { name: '박지민', start: '3/1', end: '3/10' },
          ],
        },
        {
          name: '로그 분석',
          start: '3/12',
          end: '3/20',
          members: [
            { name: '김철수', start: '3/12', end: '3/20' },
            { name: '최동욱', start: '3/12', end: '3/20' },
            { name: '한소희', start: '3/12', end: '3/20' },
            { name: '정민수', start: '3/12', end: '3/20' },
          ],
        },
        {
          name: '보안 점검',
          start: '3/15',
          end: '3/25',
          members: [
            { name: '이영희', start: '3/15', end: '3/25' },
            { name: '박지민', start: '3/15', end: '3/25' },
          ],
        },
        {
          name: '네트워크 모니터링',
          start: '3/5',
          end: '3/15',
          members: [{ name: '최동욱', start: '3/5', end: '3/15' }],
        },
        {
          name: '백업 관리',
          start: '3/8',
          end: '3/28',
          members: [
            { name: '김철수', start: '3/8', end: '3/28' },
            { name: '이영희', start: '3/8', end: '3/28' },
            { name: '박지민', start: '3/8', end: '3/28' },
            { name: '정민수', start: '3/8', end: '3/28' },
            { name: '한소희', start: '3/8', end: '3/28' },
          ],
        },
      ],
    },
  ]

  const yAxisData = []
  const seriesData = []

  tasks.forEach((task, taskIndex) => {
    yAxisData.push({
      value: task.name,
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
      },
    })

    if (task.subtasks) {
      task.subtasks.forEach((subtask, subtaskIndex) => {
        yAxisData.push({
          value: `  ${subtask.name} (${subtask.members.length}명)`,
          textStyle: {
            fontSize: 12,
            color: '#666',
          },
        })

        subtask.members.forEach((member, memberIndex) => {
          seriesData.push([
            yAxisData.length - 1,
            parseInt(member.start.split('/')[1]),
            parseInt(member.end.split('/')[1]),
            1,
            memberIndex,
            subtask.name,
            member.start,
            member.end,
            member.name,
          ])
        })
      })
    }
  })

  var option = {
    title: {
      text: '12월 업무별 일정',
      left: 'center',
    },
    grid: {
      left: '15%',
      right: '15%',
      top: '10%',
      bottom: '5%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const data = params.data
        const name = data[5] // 업무 이름 (5번 인덱스)
        const start = data[6] // 시작일 (6번 인덱스)
        const end = data[7] // 종료일 (7번 인덱스)
        return `${name}<br/>기간: ${start} ~ ${end}`
      },
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'value',
      min: 1,
      max: 31,
      interval: 6,
      axisLabel: {
        formatter: (value) => `12/${String(value).padStart(2, '0')}`,
        color: function (value) {
          return value >= 3 && value <= 20 ? '#333' : '#999'
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#ccc',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      axisLabel: {
        color: (value) => {
          // 하위 업무는 좀 더 연한 색상으로 표시
          return value.startsWith('  ↳ ') ? '#666' : '#333'
        },
        fontSize: (value) => {
          // 하위 업무는 좀 더 작은 폰트 사이즈로 표시
          return value.startsWith('  ↳ ') ? 12 : 14
        },
        fontWeight: (value) => {
          // 메인 업무만 굵게 표시
          return value.startsWith('  ↳ ') ? 'normal' : 'bold'
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.1)'],
        },
      },
    },
    series: [
      {
        name: '업무 일정',
        type: 'custom',
        renderItem: function (params, api) {
          const categoryIndex = api.value(0)
          const start = api.value(1)
          const end = api.value(2)
          const isSubtask = api.value(3)
          const subtaskIndex = api.value(4)

          const baseHeight = api.size([0, 0])[1] * 0.5 // 높이를 50%로 줄여서 여백 확보
          const subtaskHeight = baseHeight * 0.2

          const x0 = api.coord([Math.max(1, start), categoryIndex])[0]
          const y0 = api.coord([start, categoryIndex])[1]
          const x1 = api.coord([Math.min(31, end + 1), categoryIndex])[0]

          let offsetY = 0
          if (isSubtask) {
            offsetY = (subtaskIndex + 1) * subtaskHeight
          }

          const style = api.style()
          return {
            type: 'rect',
            shape: {
              x: x0,
              y: y0 - baseHeight / 2 + offsetY,
              width: x1 - x0,
              height: isSubtask ? subtaskHeight : baseHeight,
            },
            style: style,
          }
        },
        encode: {
          x: [1, 2, 3],
          y: 0,
        },
        data: seriesData,
        itemStyle: {
          color: function (params) {
            const colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae']
            const baseColor = colors[Math.floor(params.dataIndex / 4)]
            return params.data[3] ? echarts.color.lift(baseColor, 0.2) : baseColor
          },
        },
        label: {
          show: true,
          formatter: function (params) {
            const data = params.data
            const name = data[5]
            const start = data[6]
            const end = data[7]
            return data[3] ? name : `${start} ~ ${end}`
          },
          position: 'inside',
          fontSize: 11,
        },
      },
    ],
  }

  myChart.setOption(option)

  window.addEventListener('resize', function () {
    myChart.resize()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', function () {
    myChart.resize()
  })
})
</script>
