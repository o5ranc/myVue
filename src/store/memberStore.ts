import { Member } from '@/types/member'
import { memberService } from '@/services/memberService'
import { Module } from 'vuex'
import { MemberState, RootState } from './types'

const memberStore: Module<MemberState, RootState> = {
  namespaced: true,

  state: {
    members: [],
    selectedMembers: [],
    page: 1,
    hasMore: true,
    loading: false,
    search: '',
    selectedSearch: '',
  },

  mutations: {
    SET_MEMBERS(state, members: Member[]) {
      state.members = members
    },
    ADD_MEMBERS(state, members: Member[]) {
      state.members = [...state.members, ...members]
    },
    SET_SELECTED_MEMBERS(state, members: Member[]) {
      state.selectedMembers = members
    },
    SET_PAGE(state, page: number) {
      state.page = page
    },
    SET_HAS_MORE(state, hasMore: boolean) {
      state.hasMore = hasMore
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_SEARCH(state, search: string) {
      state.search = search
    },
    SET_SELECTED_SEARCH(state, search: string) {
      state.selectedSearch = search
    },
  },

  actions: {
    async fetchMembers({ commit, state }, { reset = false } = {}) {
      if (reset) {
        commit('SET_PAGE', 1)
        commit('SET_MEMBERS', [])
      }

      if (!state.hasMore || state.loading) return

      commit('SET_LOADING', true)
      try {
        // 실제 API 연동시 memberService.getMembers 사용
        const { members, hasMore } = memberService.generateDummyMembers(state.page, state.search)

        if (reset) {
          commit('SET_MEMBERS', members)
        } else {
          commit('ADD_MEMBERS', members)
        }

        commit('SET_HAS_MORE', hasMore)
        commit('SET_PAGE', state.page + 1)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    selectMember({ commit, state }, member: Member) {
      const updatedSelected = [...state.selectedMembers, member]
      commit('SET_SELECTED_MEMBERS', updatedSelected)

      const updatedMembers = state.members.filter((m) => m.id !== member.id)
      commit('SET_MEMBERS', updatedMembers)
    },

    unselectMember({ commit, state }, member: Member) {
      const updatedSelected = state.selectedMembers.filter((m) => m.id !== member.id)
      commit('SET_SELECTED_MEMBERS', updatedSelected)

      if (member.name.toLowerCase().includes(state.search.toLowerCase())) {
        const updatedMembers = [...state.members, member]
        commit('SET_MEMBERS', updatedMembers)
      }
    },

    setSearch({ commit, dispatch }, search: string) {
      commit('SET_SEARCH', search)
      commit('SET_MEMBERS', [])
      commit('SET_PAGE', 1)
      commit('SET_HAS_MORE', true)
      dispatch('fetchMembers')
    },

    setSelectedSearch({ commit }, search: string) {
      commit('SET_SELECTED_SEARCH', search)
    },
  },

  getters: {
    filteredSelectedMembers: (state) => {
      if (!state.selectedSearch) return state.selectedMembers
      return state.selectedMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(state.selectedSearch.toLowerCase()) ||
          member.email.toLowerCase().includes(state.selectedSearch.toLowerCase()) ||
          member.department.toLowerCase().includes(state.selectedSearch.toLowerCase()),
      )
    },
  },
}

export default memberStore
