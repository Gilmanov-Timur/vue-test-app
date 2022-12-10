import { defineStore } from 'pinia'

const saveResults = results => localStorage.setItem('quiz', JSON.stringify(results))

export const useQuizStore = defineStore('quiz', {
	state() {
		return {
			quiz: JSON.parse(localStorage.getItem('quiz')) || [],
		}
	},
	actions: {
		add(result) {
			const index = this.quiz.findIndex(question => question.id === result.id)

			if (index !== -1) {
				this.quiz.splice(index, 1, result)
			} else {
				this.quiz.push(result)
			}

			saveResults(this.quiz)
		},
		clear() {
			this.quiz = []
			saveResults(this.quiz)
		},
	},
})
