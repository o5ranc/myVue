<template>
  <div class="member-selector">
    <div class="member-list-container">
      <h2>멤버 목록 ({{ displayedMembers.length }} / {{ filteredMembers.length }})</h2>
      <div class="search-box">
        <input
          v-model="search"
          placeholder="이름으로 검색"
          type="text"
        />
      </div>
      <div
        class="member-list"
        ref="memberListRef"
        @scroll="handleScroll"
      >
        <template v-if="filteredMembers.length > 0">
          <div
            v-for="member in displayedMembers"
            :key="member.id"
            class="member-item"
          >
            <div class="member-info">{{ member.name }} - {{ member.department }} ({{ member.email }})</div>
            <button
              @click="selectMember(member)"
              class="select-btn"
            >
              선택
            </button>
          </div>
          <div
            v-if="loading"
            class="loading"
          >
            Loading...
          </div>
        </template>
        <div
          v-else-if="search"
          class="empty-message"
        >
          검색 결과가 없습니다.
        </div>
        <div
          v-else
          class="empty-message"
        >
          데이터가 없습니다.
        </div>
      </div>
    </div>

    <div class="selected-list-container">
      <h2>선택된 멤버 ({{ filteredSelectedMembers.length }} / {{ selectedMembers.length }})</h2>
      <div class="search-box">
        <input
          v-model="selectedSearch"
          placeholder="이름으로 검색"
          type="text"
        />
      </div>
      <div class="selected-list">
        <template v-if="filteredSelectedMembers.length > 0">
          <div
            v-for="member in filteredSelectedMembers"
            :key="member.id"
            class="member-item"
          >
            <div class="member-info">{{ member.name }} - {{ member.department }} ({{ member.email }})</div>
            <button
              @click="unselectMember(member)"
              class="unselect-btn"
            >
              삭제
            </button>
          </div>
        </template>
        <div
          v-else-if="selectedSearch"
          class="empty-message"
        >
          검색 결과가 없습니다.
        </div>
        <div
          v-else
          class="empty-message"
        >
          선택된 멤버가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Member } from '@/types/member'
import membersData from '@/data/members.json'

const PAGE_SIZE = 15

export default defineComponent({
  name: 'MemberSelector',

  setup() {
    const allMembers = ref<Member[]>([])
    const availableMembers = ref<Member[]>([])
    const selectedMembers = ref<Member[]>([])
    const memberListRef = ref<HTMLElement | null>(null)
    const search = ref('')
    const selectedSearch = ref('')
    const currentPage = ref(1)
    const loading = ref(false)

    // 검색어에 따라 필터링된 전체 멤버 목록
    const filteredMembers = computed(() => {
      if (!search.value) return availableMembers.value
      const searchLower = search.value.toLowerCase().trim()
      return availableMembers.value.filter((member) => member.name.toLowerCase().includes(searchLower))
    })

    // 현재 페이지에 표시될 멤버 목록
    const displayedMembers = computed(() => {
      const start = 0
      const end = currentPage.value * PAGE_SIZE
      return filteredMembers.value.slice(start, end)
    })

    // 선택된 멤버 중 검색어에 맞는 멤버 목록
    const filteredSelectedMembers = computed(() => {
      if (!selectedSearch.value) return selectedMembers.value
      const searchLower = selectedSearch.value.toLowerCase().trim()
      return selectedMembers.value.filter((member) => member.name.toLowerCase().includes(searchLower))
    })

    // 검색어 변경 시 페이지 리셋 (200ms 디바운스 적용)
    const debouncedReset = debounce(() => {
      currentPage.value = 1
    }, 200)

    // search 값 감시
    watch(search, () => {
      debouncedReset()
    })

    const handleScroll = async (event: Event) => {
      const element = event.target as HTMLElement
      if (
        !loading.value &&
        element.scrollHeight - element.scrollTop <= element.clientHeight + 100 &&
        displayedMembers.value.length < filteredMembers.value.length
      ) {
        loading.value = true
        // 실제 API 호출을 시뮬레이션하기 위한 지연
        await new Promise((resolve) => setTimeout(resolve, 500))
        currentPage.value++
        loading.value = false
      }
    }

    const selectMember = (member: Member) => {
      // 선택된 멤버 목록에 검색어가 있다면 초기화
      if (selectedSearch.value) {
        selectedSearch.value = ''
      }
      selectedMembers.value.push(member)
      availableMembers.value = availableMembers.value.filter((m) => m.id !== member.id)
    }

    const unselectMember = (member: Member) => {
      // 멤버 목록에 검색어가 있다면 초기화
      if (search.value) {
        search.value = ''
        currentPage.value = 1
      }
      selectedMembers.value = selectedMembers.value.filter((m) => m.id !== member.id)
      availableMembers.value.push(member)
      // 정렬을 유지하기 위해 id 기준으로 정렬
      availableMembers.value.sort((a, b) => a.id - b.id)
    }

    onMounted(() => {
      allMembers.value = membersData.members
      availableMembers.value = [...allMembers.value]
    })

    return {
      displayedMembers,
      filteredMembers,
      selectedMembers,
      loading,
      search,
      selectedSearch,
      filteredSelectedMembers,
      memberListRef,
      handleScroll,
      selectMember,
      unselectMember,
    }
  },
})
</script>

<style scoped>
.member-selector {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  height: 100vh;
}

.member-list-container,
.selected-list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}

h2 {
  margin: 0 0 1rem 0;
  color: #333;
}

.search-box {
  margin-bottom: 1rem;
}

.search-box input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.member-list,
.selected-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0.5rem;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background: white;
}

.member-info {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 1rem;
}

.select-btn,
.unselect-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  flex-shrink: 0;
}

.select-btn {
  background: #4caf50;
  color: white;
}

.unselect-btn {
  background: #f44336;
  color: white;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 0.9rem;
  background: #f5f5f5;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>
