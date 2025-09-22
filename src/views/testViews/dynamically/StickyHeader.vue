<template>
  <div>
    <!-- 전체 헤더 -->
    <div 
      class="sticky-header full-header" 
      :class="{ 'hidden': isCompact }"
    >
      <h2>헤더 테스트</h2>
      <div class="header-content">
        <h1 class="sticky-header-title">My Website</h1>
        <nav class="header-nav">
          <a href="#" class="nav-link">Home</a>
          <a href="#" class="nav-link">About</a>
          <a href="#" class="nav-link">Services</a>
          <a href="#" class="nav-link">Contact</a>
        </nav>
      </div>
    </div>
    
    <!-- Compact 헤더 -->
    <div 
      class="sticky-header compact-header" 
      :class="{ 'hidden': !isCompact }"
    >
      <div class="header-content">
        <h1 class="sticky-header-title">My Website</h1>
        <nav class="header-nav">
          <a href="#" class="nav-link">Home</a>
          <a href="#" class="nav-link">About</a>
          <a href="#" class="nav-link">Services</a>
          <a href="#" class="nav-link">Contact</a>
        </nav>
      </div>
    </div>
    
    <!-- 컨텐츠 영역 -->
    <div class="content">
      <div v-for="i in 50" :key="i" class="content-section">
        <h2>섹션 {{ i }}</h2>
        <p>이것은 테스트 컨텐츠입니다. 스크롤을 아래로 내리면 헤더가 compact하게 변하고, 위로 올리면 전체 헤더가 나타납니다.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isCompact = ref(false)
const lastScrollY = ref(0)
const scrollThreshold = 100

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // 스크롤이 임계값을 넘었을 때만 헤더 상태 변경
  if (currentScrollY > scrollThreshold) {
    if (currentScrollY > lastScrollY.value) {
      // 아래로 스크롤 - compact 헤더 표시
      isCompact.value = true
    } else {
      // 위로 스크롤 - 전체 헤더 표시
      isCompact.value = false
    }
  } else {
    // 스크롤이 임계값 아래일 때는 항상 전체 헤더 표시
    isCompact.value = false
  }
  
  lastScrollY.value = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.sticky-header.hidden {
  transform: translateY(-100%);
}

.full-header {
  height: 180px;
}

.compact-header {
  height: 50px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.sticky-header-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  transition: font-size 0.3s ease;
}

.compact-header .sticky-header-title {
  font-size: 1.2rem;
}

.header-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.compact-header .nav-link {
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
}

.content {
  margin-top: 180px; /* 전체 헤더 높이만큼 여백 */
}

.content-section {
  padding: 3rem 2rem;
  border-bottom: 1px solid #eee;
}

.content-section h2 {
  color: #333;
  margin-bottom: 1rem;
}

.content-section p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .header-nav {
    gap: 1rem;
  }
  
  .nav-link {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }
  
  .compact-header .nav-link {
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
  }
  
  .sticky-header-title {
    font-size: 1.2rem;
  }
  
  .compact-header .sticky-header-title {
    font-size: 1rem;
  }
}
</style>
