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
        v-for="(item, index) in []"
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
    <p>업무당 담당자별 차트</p>
    <div
      id="chartContainer"
      style="width: 800px; height: 400px"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { showPanel } from '@codemirror/view'

let myChart: echarts.ECharts

// // 레이어 표시 여부를 위한 상태 변수
// const showLayer = ref(false)

// // 레이어 토글 함수
// const toggleLayer = () => {
//   showLayer.value = !showLayer.value
// }

//================================================================================= 설정 및 정의 값
const selectedYear = ref(2024)
const selectedMonth = ref('11')

// 차트 데이터
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

// 색상 정의 함수
const getColorByIndex = (index: number): string => {
  const colors = [
    '#73c0de', // 하늘
    '#91cc75', // 초록
    '#fac858', // 노랑
    '#ee6666', // 빨강
  ]
  return colors[index % colors.length]
}

watch([selectedYear, selectedMonth], () => {
  updateChart()
})

onMounted(() => {
  // 초기화 및 이벤트 바인딩
  initChart()
  updateChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', function () {
    myChart.resize()
  })
})

//================================================================================= 함수 목록
// 선택된 연월의 시작일과 종료일을 계산하는 함수 수정
const getMonthRange = (year: number, month: string) => {
  // 해당 월의 시작일 (1일)
  const selectStartDate = new Date(year, parseInt(month) - 1, 1).getTime()

  // 해당 월의 마지막 날
  const selectEndDate = new Date(year, parseInt(month), 0, 23, 59, 59).getTime()

  return {
    selectStartDate, // 월 시작일
    selectEndDate, // 월 마지막 날
  }
}

// 차트 리사이즈 핸들러
const handleResize = () => {
  myChart.resize()
}

// 차트 초기화 함수
const initChart = () => {
  myChart = echarts.init(document.getElementById('chartContainer') as HTMLElement)
}

// 차트 업데이트 함수
const updateChart = () => {
  const { yAxisData, seriesData, monthStart, monthEnd } = processChartData(tasks)
  const option = createChartOption(yAxisData, seriesData, monthStart, monthEnd)
  myChart.setOption(option, true)
}

// 차트 데이터 가공 함수
const processChartData = (tasks: any[]) => {
  const yAxisData: string[] = []
  const seriesData: any[] = []

  // monthStart: 선택된 월의 1일 시작 시간 (예: 2024년 11월 1일 00:00:00)
  // startDate: 각 task의 projectsWithUsers에 있는 개별 일정의 시작 시간 (예: 2024년 11월 13일)
  const { selectStartDate: monthStart, selectEndDate: monthEnd } = getMonthRange(
    selectedYear.value,
    selectedMonth.value,
  )

  tasks.forEach((task, taskIndex) => {
    yAxisData.push(task.wrName)

    if (task.projectsWithUsers && task.projectsWithUsers.length > 0) {
      const totalUsers = task.projectsWithUsers.length

      task.projectsWithUsers.forEach((user, userIndex) => {
        let startDate = new Date(user.wrStartDate).getTime()
        let endDate = new Date(user.wrEndDate).getTime()

        // 11월을 선택했다면 monthStart는 11월 1일, 특정 task의 startDate가 11월 13일이라면
        // Math.max(startDate, monthStart)는 11월 13일
        startDate = Math.max(startDate, monthStart)
        endDate = Math.min(endDate, monthEnd)

        // 이 데이터는 나중에 renderItem 함수에서 api.value(index)로 접근할 때 사용
        // 데이터를 push할 때는 반드시 이 dimensions 배열에 정의된 순서와 일치하도록
        seriesData.push([
          taskIndex, // 0: y축 위치 인덱스
          startDate, // 1: 시작 시간
          endDate, // 2: 종료 시간
          userIndex, // 3: 사용자 인덱스
          totalUsers, // 4: 전체 사용자 수
          task.wrName, // 5: 업무 이름
          user.wrUserName, // 6: 사용자 이름
          getColorByIndex(userIndex), // 7: 색상
        ])
      })
    }
  })

  return { yAxisData, seriesData, monthStart, monthEnd }
}

// 차트 옵션 생성 함수
const createChartOption = (yAxisData: string[], seriesData: any[], monthStart: number, monthEnd: number) => {
  return {
    // 차트의 전체적인 레이아웃과 위치를 설정
    grid: {
      left: 200, // 왼쪽 여백 (px)
      right: '5%', // 오른쪽 여백 (%)
      top: '15%', // 위쪽 여백 (%)
      bottom: '5%', // 아래쪽 여백 (%)
      containLabel: false, // 라벨을 grid 영역에 포함할지 여부
      backgroundColor: '#fff', // grid 배경색
      borderWidth: 1, // grid 테두리 두께
      borderColor: '#eee', // grid 테두리 색상
    },
    // 마우스 호버시 표시되는 툴팁 설정
    tooltip: {
      trigger: 'item', // 툴팁 트리거 방식
      formatter: function (params: any) {
        // 툴팁 내용 포맷 함수
        const data = params.data
        if (!data) return ''
        return `${data[6]}<br/>${data[5]}<br/>기간: ${new Date(data[1]).toLocaleDateString()} ~ ${new Date(
          data[2],
        ).toLocaleDateString()}`
      },
      backgroundColor: 'rgba(255,255,255,0.9)', // 툴팁 배경색
      borderColor: '#ccc', // 툴팁 테두리 색상
      borderWidth: 1, // 툴팁 테두리 두께
      textStyle: {
        color: '#333', // 툴팁 텍스트 색상
      },
      extraCssText: 'box-shadow: 0 0 8px rgba(0,0,0,0.1);', // 추가 CSS 스타일
    },
    // X축 설정 (시간축)
    xAxis: {
      type: 'time', // 축 타입: 시간
      position: 'top', // 축 위치: 상단
      min: monthStart, // 시작 시간
      max: monthEnd, // 종료 시간
      axisLabel: {
        // 축 라벨 설정
        formatter: (value: number) => {
          // 라벨 포맷 함수
          const date = new Date(value)
          return `${date.getMonth() + 1}/${date.getDate()}`
        },
        interval: 0, // 라벨 간격
      },
      splitLine: {
        // 구분선 설정
        show: true,
        lineStyle: { type: 'dashed', color: '#e0e0e0' },
      },
      axisTick: {
        // 축 눈금 설정
        alignWithLabel: true,
      },
    },
    // Y축 설정 (카테고리축)
    yAxis: {
      type: 'category', // 축 타입: 카테고리
      data: yAxisData, // 축 데이터
      axisLabel: {
        // 축 라벨 설정
        color: '#333', // 라벨 색상
        fontSize: 14, // 폰트 크기
        fontWeight: 'bold', // 폰트 굵기
        align: 'left', // 텍스트 정렬
        padding: [0, 0, 0, -180], // 패딩
        width: 180, // 라벨 너비
        overflow: 'truncate', // 넘침 처리
        lineHeight: 20, // 줄 높이
        inside: false, // 내부 표시 여부
        verticalAlign: 'middle', // 수직 정렬
        position: 'left', // 위치
        distance: 10, // 거리
      },
      position: 'left', // 축 위치
      axisLine: {
        // 축 선 설정
        show: true,
      },
      axisTick: {
        // 축 눈금 설정
        show: true,
      },
      splitLine: {
        // 구분선 설정
        show: true,
        lineStyle: { type: 'dashed', color: '#e0e0e0' },
      },
      splitArea: {
        // 구분 영역 설정
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0.6)', 'rgba(245,245,245,0.6)'],
        },
      },
    },
    // 시리즈 데이터 설정
    series: [
      {
        type: 'custom', // 커스텀 시리즈 타입
        renderItem: function (params: any, api: any) {
          // 커스텀 렌더링 함수
          const categoryIndex = api.value(0) // Y축 위치 인덱스
          const start = api.coord([api.value(1), categoryIndex]) // 시작 좌표
          const end = api.coord([api.value(2), categoryIndex]) // 종료 좌표
          const userIndex = api.value(3) // 사용자 인덱스
          const totalUsers = api.value(4) // 전체 사용자 수
          const color = api.value(7) // 색상
          const userName = api.value(6) // 사용자 이름

          const height = api.size([0, 1])[1] // 전체 높이
          const barHeight = Math.min((height * 0.6) / totalUsers, 20) // 막대 높이
          const offsetY = -(barHeight * totalUsers) / 2 + userIndex * barHeight // Y축 오프셋

          const validStart = Math.max(start[0], api.coord([monthStart, 0])[0]) // 유효 시작점
          const validEnd = Math.min(end[0], api.coord([monthEnd, 0])[0]) // 유효 종료점
          const barWidth = Math.max(validEnd - validStart, 2) // 막대 너비

          return {
            type: 'group', // 그룹 타입
            children: [
              {
                type: 'rect', // 사각형 도형
                shape: {
                  // 도형 모양 설정
                  x: validStart,
                  y: start[1] + offsetY,
                  width: barWidth,
                  height: barHeight * 0.8,
                },
                style: {
                  // 도형 스타일 설정
                  fill: color,
                  shadowBlur: 2,
                  shadowColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 2,
                },
              },
              {
                type: 'text', // 텍스트 요소
                style: {
                  // 텍스트 스타일 설정
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
        // 데이터 차원 정의
        dimensions: ['taskIndex', 'startDate', 'endDate', 'userIndex', 'totalUsers', 'taskName', 'userName', 'color'],
        // 데이터 매핑 설정
        encode: {
          x: [1, 2], // X축에 매핑될 데이터 인덱스
          y: 0, // Y축에 매핑될 데이터 인덱스
        },
        data: seriesData, // 시리즈 데이터
      },
    ],
  }
}
</script>
