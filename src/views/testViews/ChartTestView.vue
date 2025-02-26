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
          start: '2025-12-01',
          end: '2025-12-10',
          members: [
            { name: '김철수', start: '2025-12-01', end: '2025-12-10' },
            { name: '이영희', start: '2025-12-01', end: '2025-12-10' },
            { name: '박지민', start: '2025-12-01', end: '2025-12-10' },
          ],
        },
        {
          name: '로그 분석',
          start: '2025-11-12',
          end: '2025-12-20',
          members: [
            { name: '김철수', start: '2025-11-12', end: '2025-12-20' },
            { name: '최동욱', start: '2025-12-12', end: '2025-12-20' },
            { name: '한소희', start: '2025-12-12', end: '2025-12-20' },
            { name: '정민수', start: '2025-12-12', end: '2025-12-20' },
          ],
        },
        {
          name: '보안 점검',
          start: '2025-12-15',
          end: '2025-12-25',
          members: [
            { name: '이영희', start: '2025-12-15', end: '2025-12-25' },
            { name: '박지민', start: '2025-12-15', end: '2025-12-25' },
          ],
        },
        {
          name: '네트워크 모니터링',
          start: '2025-12-05',
          end: '2025-12-15',
          members: [{ name: '최동욱', start: '2025-12-05', end: '2025-12-15' }],
        },
        {
          name: '백업 관리',
          start: '2025-10-08',
          end: '2025-12-28',
          members: [
            { name: '김철수', start: '2025-10-08', end: '2026-01-28' },
            { name: '이영희', start: '2025-12-08', end: '2025-12-28' },
            { name: '박지민', start: '2025-12-08', end: '2025-12-28' },
            { name: '정민수', start: '2025-12-08', end: '2025-12-28' },
            { name: '한소희', start: '2025-12-08', end: '2025-12-28' },
          ],
        },
      ],
    },
  ]

  const yAxisData = []
  const seriesData = []

  // 12월의 시작과 끝 날짜 설정
  const december2025Start = new Date('2025-12-01').getTime()
  const december2025End = new Date('2025-12-31').getTime()

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
          // 날짜 형식을 변환 (이미 YYYY-MM-DD 형식이므로 직접 사용)
          let startDate = new Date(member.start).getTime()
          let endDate = new Date(member.end).getTime()

          // 시작일이 12월 1일 이전이면 12월 1일로 설정
          startDate = Math.max(startDate, december2025Start)
          // 종료일이 12월 31일 이후면 12월 31일로 설정
          endDate = Math.min(endDate, december2025End)

          seriesData.push([
            yAxisData.length - 1,
            startDate,
            endDate,
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
      type: 'time',
      min: new Date('2025-12-01').getTime(), // 2025년 12월 1일로 시작
      max: new Date('2025-12-31').getTime(), // 2025년 12월 31일로 종료
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value)
          return `${date.getMonth() + 1}/${date.getDate()}`
        },
        color: function (value) {
          const date = new Date(value)
          return date.getDate() >= 3 && date.getDate() <= 20 ? '#333' : '#999'
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
          const start = api.coord([api.value(1), categoryIndex])
          const end = api.coord([api.value(2), categoryIndex])
          const isSubtask = api.value(3)
          const subtaskIndex = api.value(4)

          const baseHeight = api.size([0, 0])[1] * 0.6
          const subtaskHeight = baseHeight * 0.2

          let offsetY = 0
          if (isSubtask) {
            offsetY = (subtaskIndex - 2) * subtaskHeight
          }

          const style = api.style()
          return {
            type: 'rect',
            shape: {
              x: start[0],
              y: start[1] - baseHeight / 2 + offsetY,
              width: end[0] - start[0],
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

// start와 end 날짜를 체크하고 조정하는 함수 수정
function adjustDateRange(start, end) {
  const december1st = new Date(2025, 11, 1) // 2025년 12월 1일
  const december31st = new Date(2025, 11, 31) // 2025년 12월 31일

  const startDate = new Date(start)
  const endDate = new Date(end)

  // start가 12월 1일 이전이면 12월 1일로 설정
  if (startDate < december1st) {
    startDate.setTime(december1st.getTime())
  }

  // end가 12월 31일 이후이면 12월 31일로 설정
  if (endDate > december31st) {
    endDate.setTime(december31st.getTime())
  }

  return { start: startDate, end: endDate }
}

// 차트를 그릴 때 이 함수를 사용
const { adjustedStart, adjustedEnd } = adjustDateRange('12/01', '12/31')
// adjustedStart와 adjustedEnd를 사용하여 막대 그리기
</script>
