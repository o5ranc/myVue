import { Member } from '@/types/member'
import axios from 'axios'

const PAGE_SIZE = 15

export const memberService = {
  async getMembers(page: number, search: string = '') {
    // 실제 API 호출로 대체해야 합니다
    const response = await axios.get(`/api/members`, {
      params: {
        page,
        pageSize: PAGE_SIZE,
        search,
      },
    })
    return response.data
  },

  // 더미 데이터 생성 (실제 구현시 삭제)
  generateDummyMembers(page: number, search: string = ''): { members: Member[]; hasMore: boolean } {
    const allMembers: Member[] = Array.from({ length: 500 }, (_, index) => ({
      id: index + 1,
      name: `Member ${index + 1}`,
      email: `member${index + 1}@example.com`,
      department: `Department ${Math.floor(index / 50) + 1}`,
    }))

    const filteredMembers = search
      ? allMembers.filter(
          (member) =>
            member.name.toLowerCase().includes(search.toLowerCase()) ||
            member.email.toLowerCase().includes(search.toLowerCase()) ||
            member.department.toLowerCase().includes(search.toLowerCase()),
        )
      : allMembers

    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const paginatedMembers = filteredMembers.slice(start, end)

    return {
      members: paginatedMembers,
      hasMore: end < filteredMembers.length,
    }
  },
}
