import { defineStore } from 'pinia'

export const useEmissionsStore = defineStore('emissions', {
  state: () => ({ history: [] }),
  actions: {
    add(record) {
      this.history.unshift(record)
    }
  }
})
