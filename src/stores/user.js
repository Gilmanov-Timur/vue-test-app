import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
	state() {
		return {
			user: localStorage.getItem('user'),
		}
	},
	actions: {
		login(payload) {
			this.user = payload
			localStorage.setItem('user', payload)
		},
		logout() {
			this.user = null
			localStorage.removeItem('user')
		}
	},
})
