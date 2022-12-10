<template>
	<div class="card">
		<div v-if="!tests.length">
			<h1>Тестов нет</h1>
			<router-link :to="{name: 'tests'}">
				Добавить тесты
			</router-link>
		</div>
		<div v-else-if="testId">
			<div v-if="selectedTest">
				<h3>Вопрос {{ currentTestIndex + 1 }} из {{ tests.length }}</h3>
				<p>{{ selectedTest.question }}</p>
				<hr />
				<template v-if="selectedTest.type === 'text'">
					<div class="form-control mb-0">
						<input type="text" v-model.trim="textAnswer" placeholder="Введите ответ" />
					</div>
				</template>
				<template v-else>
					<div class="answer" v-for="(answer, index) in selectedTest.answers" :key="answer.id">
						<label>
							<input
								type="checkbox"
								class="radio-input"
								v-model="userAnswers[index].selected"
								:disabled="userAnswers[index].selected"
								@change="onSingleAnswerChange(answer.id)"
								v-if="selectedTest.type === 'single'"
							/>
							<input
								type="checkbox"
								class="check-input"
								v-model="userAnswers[index].selected"
								v-else
							/>
							{{ answer.text }}
						</label>
					</div>
				</template>
				<button class="btn primary mt-1" :disabled="!isNextEnabled" @click="onNext">
					Далее
				</button>
			</div>
			<div v-else>
				<h3>Тест не найден</h3>
				<router-link :to="{name: 'quiz', params: {testId: tests[0].id}}">
					Начать заново
				</router-link>
			</div>
		</div>
		<div v-else>
			<template v-if="isAllQuestionsAnswered">
				<h3>Ваш результат</h3>
				<p>{{ calculateScore() }} / {{ tests.length }}</p>
				<button type="button" class="btn primary" @click="onFinish">
					Завершить
				</button>
			</template>
			<template v-else>
				<h3>Вы не ответили на все вопросы</h3>
				<router-link :to="{name: 'quiz', params: {testId: tests[0].id}}">
					Начать заново
				</router-link>
			</template>
		</div>
	</div>
</template>

<script>
import {mapActions, mapState} from 'pinia'
import {useTestsStore} from '@/stores/tests'
import {useQuizStore} from '@/stores/quiz'
export default {
	props: ['testId'],
	data() {
		return {
			userAnswers: [],
			textAnswer: '',
		}
	},
	created() {
		if (this.selectedTest) {
			this.resetAnswers()
		}
	},
	methods: {
		...mapActions(useQuizStore, {addToStore: 'add', clearResults: 'clear'}),
		resetAnswers() {
			this.textAnswer = ''
			this.userAnswers = this.selectedTest.answers.map(answer => ({
				id: answer.id,
				selected: false
			}))
		},
		onSingleAnswerChange(id) {
			this.userAnswers.forEach(answer => {
				if (answer.id !== id) {
					answer.selected = false
				}
			})
		},
		onNext() {
			const result = []

			if (this.selectedTest.type === 'text') {
				result.push(this.textAnswer)
			} else {
				this.userAnswers.forEach((answer, index) => {
					if (answer.selected) {
						result.push(this.selectedTest.answers[index].text)
					}
				})
			}

			this.addToStore({
				id: this.selectedTest.id,
				answers: result,
			})

			if (this.tests.length === this.currentTestIndex + 1) {
				this.$router.replace({name: 'quiz'})
			} else {
				this.$router.replace({name: 'quiz', params: {testId: this.tests[this.currentTestIndex + 1].id}})
			}
		},
		onFinish() {
			this.clearResults()
			this.$router.replace({name: 'tests'})
		},
		calculateScore() {
			let score = 0

			this.tests.forEach(test => {
				const quizItem = this.quiz.find(item => item.id === test.id)

				if (test.type === 'text') {
					if (quizItem.answers[0] === test.answers[0].text) {
						score++
					}
				} else {
					if (test.answers.filter(answer => answer.isCorrect).every(correctAnswer => {
						return quizItem.answers.includes(correctAnswer.text)
					})) {
						score++
					}
				}
			})

			return score
		},
	},
	computed: {
		...mapState(useTestsStore, ['tests']),
		...mapState(useQuizStore, ['quiz']),
		selectedTest() {
			return this.tests.find(test => test.id === Number(this.testId))
		},
		isNextEnabled() {
			if (this.selectedTest) {
				if (this.selectedTest.type === 'text') {
					return this.textAnswer.length !== 0
				} else if (this.selectedTest.type === 'single') {
					return this.userAnswers.some(answer => answer.selected)
				} else {
					return this.userAnswers.filter(answer => answer.selected).length > 1
				}
			}
		},
		isAllQuestionsAnswered() {
			return this.tests.every(test => {
				return this.quiz.find(item => item.id === test.id)
			})
		},
		currentTestIndex() {
			return this.tests.findIndex(test => test.id === this.selectedTest.id)
		}
	},
	watch: {
		$route() {
			if (this.selectedTest) {
				this.resetAnswers()
			}
		}
	}
}
</script>

<style scoped>
.answer {
	margin-bottom: 0.5rem;
}
</style>