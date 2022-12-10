import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
	state() { //data
		return {
			user: localStorage.getItem('user'),
		}
	},
	getters: { //computed
		isLoggedIn: state => state.user !== null
		//doubleCount: (state) => state.count * 2,
	},
	actions: { //methods
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
