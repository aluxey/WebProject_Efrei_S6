import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.profile,
    currentUser: (state) => state.profile
  },
  actions: {
    setProfile(user) {
      this.profile = user
    },
    clearProfile() {
      this.profile = null
    }
  }
})
