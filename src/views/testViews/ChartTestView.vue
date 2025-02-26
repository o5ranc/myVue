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

  // 업무별 기간 데이터 정의
  const taskSchedules = [
    { name: '기획', start: '12/03', end: '12/08' },
    { name: '설계', start: '12/06', end: '12/12' },
    { name: '개발', start: '12/10', end: '12/18' },
    { name: '테스트', start: '12/15', end: '12/20' },
    { name: '배포', start: '12/19', end: '12/20' },
  ]

  var option = {
    title: {
      text: '12월 업무별 일정',
      left: 'center',
    },
    grid: {
      left: '15%',
      right: '15%',
      top: '15%',
      bottom: '10%',
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}<br/>기간: ${params.data.start} ~ ${params.data.end}`
      },
    },
    xAxis: {
      type: 'value',
      min: 1,
      max: 31,
      interval: 1,
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
      data: taskSchedules.map((task) => task.name),
      axisLabel: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
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

          const height = api.size([0, 0])[1] * 0.6
          const x0 = api.coord([start, categoryIndex])[0]
          const y0 = api.coord([start, categoryIndex])[1]
          const x1 = api.coord([end + 1, categoryIndex])[0]

          const style = api.style()
          return {
            type: 'rect',
            shape: {
              x: x0,
              y: y0 - height / 2,
              width: x1 - x0,
              height: height,
            },
            style: style,
          }
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: taskSchedules.map((task, index) => [
          index,
          parseInt(task.start.split('/')[1]),
          parseInt(task.end.split('/')[1]),
          task.name,
          task.start,
          task.end,
        ]),
        itemStyle: {
          color: function (params) {
            const colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae']
            return colors[params.dataIndex]
          },
        },
        label: {
          show: true,
          formatter: function (params) {
            const task = taskSchedules[params.dataIndex]
            return `${task.start} ~ ${task.end}`
          },
          position: 'inside',
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
