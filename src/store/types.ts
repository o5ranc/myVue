import { Member } from '@/types/member'

export interface RootState {
  member: MemberState
}

export interface MemberState {
  members: Member[]
  selectedMembers: Member[]
  page: number
  hasMore: boolean
  loading: boolean
  search: string
  selectedSearch: string
}
