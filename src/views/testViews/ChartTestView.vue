<template>
  <!-- <div style="width: 100%; height: 30px; border: 1px solid black">
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
  </div> -->

  <div>
    <el-select
      style="width: 100px"
      v-model="selectedYear"
      placeholder="년도 선택"
    >
      <el-option
        v-for="year in [2023, 2024, 2025, 2026]"
        :key="year"
        :label="year"
        :value="year"
      />
    </el-select>
    <el-select
      style="width: 100px"
      v-model="selectedMonth"
      placeholder="월 선택"
    >
      <el-option
        v-for="month in ['01', '11', '12']"
        :key="month"
        :label="month"
        :value="month"
      />
    </el-select>
    <div
      id="chartContainer"
      style="width: 800px; height: 400px"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

// 레이어 표시 여부를 위한 상태 변수
const showLayer = ref(false)
// 샘플 목록 데이터
const sampleList = ref(['샘플 1', '샘플 2', '샘플 3', '샘플 4', '샘플 5'])

// 레이어 토글 함수
const toggleLayer = () => {
  showLayer.value = !showLayer.value
}

const selectedYear = ref(2024)
const selectedMonth = ref('11')

// 선택된 연월의 시작일과 종료일을 계산하는 함수 수정
const getMonthRange = (year, month) => {
  // 해당 월의 시작일 (1일)
  const startDate = new Date(year, parseInt(month) - 1, 1).getTime()

  // 해당 월의 마지막 날
  const endDate = new Date(year, parseInt(month), 0, 23, 59, 59).getTime()

  return {
    startDate, // 월 시작일
    endDate, // 월 마지막 날
  }
}

onMounted(() => {
  var myChart = echarts.init(document.getElementById('chartContainer'))

  const tasks = [
    {
      wrTaskId: '1111',
      wrName: '업무요청서111',
      projectsWithUsers: [
        {
          wrCode: 'WRT1042-DP7',
          wrEndDate: '2025-12-25',
          wrMasterId: 23438,
          wrMonthlyId: 44,
          wrName: '업무요청서111',
          wrStartDate: '2024-11-13',
          wrTaskId: '1111',
          wrUserId: '401331',
          wrUserName: '정답자',
          wrWorkLoad: 1.2,
        },
        {
          wrCode: 'WRT1042-DP7',
          wrEndDate: '2025-12-25',
          wrMasterId: 23438,
          wrMonthlyId: 44,
          wrName: '업무요청서111',
          wrStartDate: '2024-11-13',
          wrTaskId: '1111',
          wrUserId: '401331',
          wrUserName: '비빔밥',
          wrWorkLoad: 1.2,
        },
        {
          wrCode: 'WRT1042-DP7',
          wrEndDate: '2025-12-25',
          wrMasterId: 23438,
          wrMonthlyId: 44,
          wrName: '업무요청서111',
          wrStartDate: '2024-11-13',
          wrTaskId: '1111',
          wrUserId: '401331',
          wrUserName: '최최란',
        },
        {
          wrCode: 'WRT1042-DP7',
          wrEndDate: '2024-11-29',
          wrMasterId: 23438,
          wrMonthlyId: 44,
          wrName: '업무요청서111',
          wrStartDate: '2024-11-05',
          wrTaskId: '1111',
          wrUserId: '401331',
          wrUserName: '강자',
        },
      ],
    },
    {
      wrTaskId: '2222',
      wrName: '업무요청서22sdfsdfsdf222222 2323 322',
      projectsWithUsers: [
        {
          wrCode: 'WRT1042-DP7',
          wrEndDate: '2025-12-25',
          wrMasterId: 23438,
          wrMonthlyId: 44,
          wrName: '업무요청서22sdfsdfsdf222222 2323 322',
          wrStartDate: '2024-11-13',
          wrUserId: '401331',
          wrUserName: '김란란',
        },
      ],
    },
    {
      wrTaskId: '3333',
      wrName: '업무요청서3333',
      projectsWithUsers: [
        {
          wrCode: 'WRT1042-DP7',
          wrEndDate: '2025-12-25',
          wrMasterId: 23438,
          wrMonthlyId: 44,
          wrName: '업무요청서111',
          wrStartDate: '2024-11-13',
          wrUserId: '401331',
          wrUserName: '홍홍홍',
        },
      ],
    },
  ]

  // 차트 업데이트 함수 수정
  const updateChart = () => {
    const { startDate: monthStart, endDate: monthEnd } = getMonthRange(selectedYear.value, selectedMonth.value)

    const yAxisData = []
    const seriesData = []

    // index에 따른 색상 정의
    const getColorByIndex = (index) => {
      const colors = [
        '#73c0de', // 하늘
        '#91cc75', // 초록
        '#fac858', // 노랑
        '#ee6666', // 빨강
      ]
      return colors[index % colors.length] // 색상 배열을 순환하며 사용
    }

    tasks.forEach((task, taskIndex) => {
      yAxisData.push(task.wrName)

      if (task.projectsWithUsers && task.projectsWithUsers.length > 0) {
        const totalUsers = task.projectsWithUsers.length

        task.projectsWithUsers.forEach((user, userIndex) => {
          let startDate = new Date(user.wrStartDate).getTime()
          let endDate = new Date(user.wrEndDate).getTime()

          // 현재 달의 범위로 제한
          startDate = Math.max(startDate, monthStart)
          endDate = Math.min(endDate, monthEnd)

          if (startDate < endDate) {
            seriesData.push([
              taskIndex, // 0: y축 위치
              startDate, // 1: 시작 시간
              endDate, // 2: 종료 시간
              userIndex, // 3: 사용자 인덱스
              totalUsers, // 4: 전체 사용자 수
              user.wrName, // 5: 업무 이름
              user.wrUserName, // 6: 사용자 이름
              getColorByIndex(userIndex), // 7: index 기반 색상
            ])
          }
        })
      }
    })

    const option = {
      title: {
        text: '업무별 일정',
        left: 'center',
      },
      grid: {
        left: 200, // grid는 200px에서 시작
        right: '5%',
        top: '15%',
        bottom: '5%',
        containLabel: false,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          const data = params.data
          if (!data) return ''
          return `${data[6]}<br/>${data[5]}<br/>기간: ${new Date(data[1]).toLocaleDateString()} ~ ${new Date(
            data[2],
          ).toLocaleDateString()}`
        },
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
        extraCssText: 'box-shadow: 0 0 8px rgba(0,0,0,0.1);',
      },
      xAxis: {
        type: 'time',
        position: 'top',
        min: monthStart,
        max: monthEnd,
        axisLabel: {
          formatter: (value) => {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          },
          interval: 0,
        },
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#e0e0e0' },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        axisLabel: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'bold',
          align: 'left',
          padding: [0, 0, 0, -180],
          width: 180, // grid left(200px)보다 작은 값
          overflow: 'truncate',
          lineHeight: 20,
          inside: false,
          verticalAlign: 'middle',
          position: 'left', // 라벨 위치를 왼쪽으로
          distance: 10, // grid와의 거리
        },
        position: 'left',
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
        },
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#e0e0e0' },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.6)', 'rgba(245,245,245,0.6)'],
          },
        },
      },
      series: [
        {
          type: 'custom',
          renderItem: function (params, api) {
            const categoryIndex = api.value(0)
            const start = api.coord([api.value(1), categoryIndex])
            const end = api.coord([api.value(2), categoryIndex])
            const userIndex = api.value(3)
            const totalUsers = api.value(4)
            const color = api.value(7)
            const userName = api.value(6)

            const height = api.size([0, 1])[1]
            const barHeight = Math.min((height * 0.6) / totalUsers, 20)
            const offsetY = -(barHeight * totalUsers) / 2 + userIndex * barHeight

            const validStart = Math.max(start[0], api.coord([monthStart, 0])[0])
            const validEnd = Math.min(end[0], api.coord([monthEnd, 0])[0])
            const barWidth = Math.max(validEnd - validStart, 2)

            return {
              type: 'group',
              children: [
                {
                  type: 'rect',
                  shape: {
                    x: validStart,
                    y: start[1] + offsetY,
                    width: barWidth,
                    height: barHeight * 0.8,
                  },
                  style: {
                    fill: color,
                    shadowBlur: 2,
                    shadowColor: 'rgba(0,0,0,0.1)',
                    borderRadius: 2,
                  },
                },
                {
                  type: 'text',
                  style: {
                    text: userName,
                    fontSize: 12,
                    fill: '#333',
                    x: validStart + 4,
                    y: start[1] + offsetY + barHeight * 0.4,
                    align: 'left',
                    verticalAlign: 'middle',
                    overflow: 'truncate',
                    width: barWidth - 8,
                  },
                },
              ],
            }
          },
          dimensions: ['taskIndex', 'startDate', 'endDate', 'userIndex', 'totalUsers', 'taskName', 'userName', 'color'],
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: seriesData,
        },
      ],
      // legend: {
      //   show: true,
      //   orient: 'horizontal',
      //   top: 10,
      //   data: [
      //     { name: '첫 번째', itemStyle: { color: '#5470c6' } },
      //     { name: '두 번째', itemStyle: { color: '#91cc75' } },
      //     { name: '세 번째', itemStyle: { color: '#fac858' } },
      //     { name: '네 번째', itemStyle: { color: '#ee6666' } },
      //     { name: '다섯 번째', itemStyle: { color: '#73c0de' } },
      //     { name: '여섯 번째', itemStyle: { color: '#3ba272' } },
      //     { name: '일곱 번째', itemStyle: { color: '#fc8452' } },
      //     { name: '여덟 번째', itemStyle: { color: '#9a60b4' } },
      //   ],
      // },
    }

    myChart.setOption(option, true)
  }

  // 초기 차트 렌더링
  updateChart()

  // select 값 변경 시 차트 업데이트
  watch([selectedYear, selectedMonth], () => {
    updateChart()
  })

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
