<template>
	<h3>
		{{ selectedTest ? 'Редактирование теста' : 'Добавление теста' }}
	</h3>
	<form @submit.prevent="onSubmit">
		<div class="form-control">
			<label for="type">Тип теста</label>
			<select id="type" v-model="form.type" required>
				<option value="single">С одним ответом</option>
				<option value="multiple">С несколькими ответами</option>
				<option value="text">С текстовым ответом</option>
			</select>
		</div>

		<template v-if="form.type">
			<div class="form-control">
				<label for="question">Текст вопроса</label>
				<textarea id="question" v-model.trim="form.question" rows="2" required />
			</div>

			<div class="mb-1">
				<template v-if="form.type === 'text'">
					<div class="form-control">
						<label for="answer">Правильный ответ</label>
						<input type="text" id="answer" v-model.trim="form.answers[0].text" required />
					</div>
				</template>
				<template v-else>
					<div>Ответы</div>
					<small>
						{{ selectedTest.type === 'single' ? 'Введите варианты ответов и укажите один верный' : 'Введите варианты ответов и укажите как минимум 2 верных' }}
					</small>
					<table class="answers">
						<tr v-for="(answer, index) in form.answers" :key="answer.id">
							<td width="1%">
								<input
									type="checkbox"
									class="radio-input"
									v-model="answer.isCorrect"
									:required="form.answers.every(item => !item.isCorrect)"
									:disabled="answer.isCorrect"
									@change="onSingleAnswerChange(answer.id)"
									v-if="form.type === 'single'"
								>
								<input
									type="checkbox"
									class="check-input"
									v-model="answer.isCorrect"
									:required="form.answers.filter(item => item.isCorrect).length < 2"
									v-else
								>
							</td>
							<td>
								<div class="form-control mb-0">
									<input type="text" v-model.trim="answer.text" placeholder="Текст ответа" required />
								</div>
							</td>
							<td width="1%">
								<button
									type="button"
									class="btn primary"
									title="Добавить ответ"
									@click="addAnswer"
									v-if="index === form.answers.length - 1"
								>
									+
								</button>
								<button
									type="button"
									class="btn danger"
									title="Удалить ответ"
									@click="removeAnswer(index)"
									v-else
								>
									×
								</button>
							</td>
						</tr>
					</table>
				</template>
			</div>
		</template>

		<button type="submit" class="btn primary">
			Сохранить
		</button>

		<div class="error-message mt-1" v-if="error">
			{{ error }}
		</div>
	</form>
</template>

<script>
export default {
	props: ['selectedTest'],
	emits: ['add', 'edit'],
	data() {
		return {
			form: {
				type: '',
				question: '',
				answers: [
					{
						id: Date.now(),
						text: '',
						isCorrect: false,
					}
				],
			},
			error: null,
			submitted: false,
		}
	},
	created() {
		if (this.selectedTest) {
			this.form = {...this.selectedTest}
		}
	},
	methods: {
		validateForm() {
			let isValid = true

			if (this.form.type !== 'text') {
				if (this.form.answers.length < 2) {
					this.error = 'Введите как минимум 2 ответа'
					isValid = false
				} else {
					this.error = null
				}
			}

			return isValid
		},
		onSubmit() {
			this.submitted = true
			if (this.validateForm()) {
				if (this.form.type === 'text' && this.form.answers.length > 1) {
					this.form.answers.splice(1)
				}
				if (this.selectedTest) {
					this.$emit('edit', this.form)
				} else {
					this.$emit('add', this.form)
				}
			}
		},
		onSingleAnswerChange(id) {
			this.form.answers.forEach(answer => {
				if (answer.id !== id) {
					answer.isCorrect = false
				}
			})
		},
		addAnswer() {
			this.form.answers.push({
				id: Date.now(),
				text: '',
				isCorrect: false,
			})
		},
		removeAnswer(index) {
			this.form.answers.splice(index, 1)
		},
	},
	watch: {
		form: {
			handler() {
				if (this.submitted) {
					this.validateForm()
				}
			},
			deep: true
		},
		'form.type'(type) {
			if (type === 'single') {
				const checkedAnswer = this.form.answers.find(answer => answer.isCorrect)
				if (checkedAnswer) {
					this.form.answers.forEach(answer => {
						if (answer.id !== checkedAnswer.id) {
							answer.isCorrect = false
						}
					})
				}
			}
		}
	}
}
</script>

<style scoped>
.answers {
	border-collapse: collapse;
	border-spacing: 0;
	width: 100%;
}
.answers td {
	padding: 0.25rem;
}
.answers td:first-child {
	padding-left: 0;
}
.answers td:last-child {
	padding-right: 0;
}
</style>