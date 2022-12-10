import { defineStore } from 'pinia'

const saveTests = tests => localStorage.setItem('tests', JSON.stringify(tests))

export const useTestsStore = defineStore('tests', {
	state() {
		return {
			tests: JSON.parse(localStorage.getItem('tests')) || [],
		}
	},
	actions: {
		add(test) {
			this.tests.unshift({
				...test,
				id: Date.now()
			})
			saveTests(this.tests)
		},
		edit(test) {
			const index = this.tests.findIndex(item => item.id === test.id)
			this.tests.splice(index, 1, test)
			saveTests(this.tests)
		},
		delete(id) {
			const index = this.tests.findIndex(item => item.id === id)
			this.tests.splice(index, 1)
			saveTests(this.tests)
		}
	},
})
