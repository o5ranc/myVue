<template>
  <div>
    <button class="gradient-border-btn">
      진행중1...
    </button>
    <div class="mt-5 box-with-border">
      내용 영역
    </div>
    <div class="mt-5 box-with-border2">
      내용 영역
    </div>
    <div class="card">
      진행중2...
    </div>
    <div class="spinner-border">
      진행중3...
    </div>
    <!-- <div class="spin-ring" style="--r:14px; --b:4px;">
      <div class="spin-ring__content">
        content는 가만히!
      </div>
    </div> -->

  </div>
</template>

<style scoped>
.box-with-border {
  position: relative;
  padding: 20px;
  border-radius: 12px;
  background: transparent;
  z-index: 0;
  color: #fff;
}

/* 바깥 테두리 역활 */
.box-with-border::before,
.box-with-border::after {
  content: "";
  position: absolute;
  inset: 0;
  /* 요소를 꽉 채우기 */
  border-radius: inherit;
  background: #4dabff;
  /* 테두리 색(나중에 그라데이션 가능) */
  z-index: -1;
}

.box-with-border2 {
  margin-top: 30px;
  position: relative;
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  color: #000;
}

/* 바깥 테두리 역활 */
.box-with-border2::before,
.box-with-border2::after {
  --angle: 0deg;
  content: "";
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  translate: -50% -50%;
  padding: 3px;
  top: 50%;
  left: 50%;
  /* 요소를 꽉 채우기 */
  border-radius: inherit;
  /* background-image: conic-gradient(from var(--angle), #a596f1, #4A2AEC, #3860FF); */
  background-image: conic-gradient(from var(--angle), transparent 70%, #3860FF);
  animation: 3s spin linear infinite;
  /* 테두리 색(나중에 그라데이션 가능) */
  z-index: -1;
}

.gradient-border-btn {
  position: relative;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: transparent;
  /* 버튼 안쪽 배경 */
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  z-index: 1;
  overflow: hidden;
}

/* 테두리 그라데이션 */
.gradient-border-btn::before {
  content: "";
  position: absolute;
  inset: -2px;
  /* 테두리 두께(조절 가능) */
  z-index: -1;
  border-radius: inherit;
  /* background: linear-gradient(90deg, #ff6b6b, #4dabff); */
  /* 원형(도넛) 그라데이션 */
  background: conic-gradient(from 0deg,
      #ff6b6b,
      #4dabff,
      #ff6b6b);
  /* 2가지 색상 */
  background-size: 200% 200%;
  /* 애니메이션용 */
  /* animation: borderMove 1.2s linear infinite; */
  animation: rotateBorder 3s linear infinite;
  /* 시계방향 회전 */
}

/* 안쪽 내용 영역(실제 버튼 배경 역할) */
.gradient-border-btn::after {
  content: "";
  position: absolute;
  inset: 2px;
  /* ::before와 inset 차이가 테두리 두께 */
  border-radius: inherit;
  background: #111;
  /* 안쪽 배경색 (바꾸고 싶으면 여기 변경) */
  z-index: -1;
}

/* 그라데이션 움직이는 애니메이션 */
@keyframes borderMove {
  0% {
    background-position: 100% 200%;
  }

  100% {
    background-position: 0% 0%;
  }
}

/* 시계방향 회전 애니메이션 */
@keyframes rotateBorder {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
    /* 시계방향 */
  }
}

.card {
  width: 100px;
  height: 100px;
  background-color: #1c1f2b;
  text-align: center;
  border-radius: 10px;
  position: relative;
  margin-left: 5px;
  margin-top: 5px;
}

.card::after,
.card::before {
  --angle: 0deg;
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  /* background-image: conic-gradient(#4A2AEC, #4A2AEC, #3860FF, #3838ff); */
  background-image: conic-gradient(from var(--angle), #a596f1, #4A2AEC, #3860FF);
  translate: -50% -50%;
  z-index: 3;
  padding: 3px;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  animation: 3s spin linear infinite;
}

@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes spin {
  from {
    --angle: 0deg;
  }

  to {
    --angle: 360deg;
  }
}

.spin-ring {
  /* ✅ 원하는 값만 여기서 조절 */
  --r: 14px;
  /* 바깥 라운드 */
  --b: 4px;
  /* 링(테두리) 두께 */
  --bg: #111;
  /* 내부 배경색 */

  position: relative;
  border-radius: var(--r);

  /* content가 위로 올라오게 공간 확보(선택) */
  padding: var(--b);
}

/* ✅ 링(테두리) 레이어: 이것만 회전 */
.spin-ring::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: conic-gradient(red, blue, red);
  animation: ring-spin 2s linear infinite;
  z-index: 0;
}

/* ✅ 가운데를 덮어서 링만 남김 */
.spin-ring::after {
  content: "";
  position: absolute;

  /* 링 두께와 동일하게 안으로 들어옴 */
  inset: var(--b);

  /* ✅ 라운드도 두께만큼 자동 감소 → 모서리에서도 링 두께 일정 */
  border-radius: calc(var(--r) - var(--b));

  background: var(--bg);
  z-index: 1;
}

/* ✅ 실제 콘텐츠 */
.spin-ring__content {
  position: relative;
  z-index: 2;

  height: 100%;
  min-height: 120px;
  /* 예시 */
  border-radius: calc(var(--r) - var(--b));

  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

/* ✅ 링만 회전 */
@keyframes ring-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>