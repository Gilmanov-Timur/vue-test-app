<template>
	<div class="card">
		<h1>Студенты</h1>
		<div class="table-responsive">
			<div class="table">
				<div class="table-row">
					<div class="table-cell" style="width:40%">
						<b class="dotted cursor-pointer" @click="sortStudents('name')">
							Имя
							<template v-if="sortingKey === 'name' && sortingReverse">
								&darr;
							</template>
							<template v-else-if="sortingKey === 'name' && !sortingReverse">
								&uarr;
							</template>
						</b>
					</div>
					<div class="table-cell">
						<b>Телефон</b>
					</div>
					<div class="table-cell" style="width:10%">
						<b class="dotted cursor-pointer" @click="sortStudents('year')">
							Курс
							<template v-if="sortingKey === 'year' && sortingReverse">
								&darr;
							</template>
							<template v-else-if="sortingKey === 'year' && !sortingReverse">
								&uarr;
							</template>
						</b>
					</div>
					<div class="table-cell" style="width:10%">
						<b>Действия</b>
					</div>
				</div>
				<template v-if="sortedStudents.length">
					<div class="table-row" v-for="student in sortedStudents" :key="student.id">
						<div class="table-cell">
							<div class="form-control mb-0" v-if="student.id === editableStudent.id">
								<input type="text" v-model.trim="editableStudent.name">
							</div>
							<div class="table-text" v-else>
								{{ student.name }}
							</div>
						</div>
						<div class="table-cell">
							<div class="form-control mb-0" v-if="student.id === editableStudent.id">
								<input type="tel" v-model.trim="editableStudent.phone">
							</div>
							<div class="table-text" v-else>
								{{ student.phone }}
							</div>
						</div>
						<div class="table-cell">
							<div class="form-control mb-0" v-if="student.id === editableStudent.id">
								<select id="year" v-model.number="editableStudent.year" required>
									<option v-for="option in 4" :value="option">
										{{ option }}
									</option>
								</select>
							</div>
							<div class="table-text" v-else>
								{{ student.year }}
							</div>
						</div>
						<div class="table-cell">
							<div class="buttons">
								<template v-if="student.id === editableStudent.id">
									<button type="button" class="btn warning" @click="cancelEditing">
										Отменить
									</button>
									<button
										type="button"
										class="btn danger"
										:disabled="!editableStudent.name || !editableStudent.phone || !editableStudent.year"
										@click="saveStudent(student)"
									>
										Сохранить
									</button>
								</template>
								<template v-else>
									<button type="button" class="btn warning" @click="editStudent(student)">
										Редактировать
									</button>
									<button type="button" class="btn danger" @click="deleteStudent(student.id)">
										Удалить
									</button>
								</template>
							</div>
						</div>
					</div>
				</template>
				<form class="table-row" @submit.prevent="addStudent">
					<div class="table-cell">
						<div class="form-control mb-0">
							<input type="text" v-model.trim="newStudent.name" required>
						</div>
					</div>
					<div class="table-cell">
						<div class="form-control mb-0">
							<input type="tel" id="phone" v-model.trim="newStudent.phone" required>
						</div>
					</div>
					<div class="table-cell">
						<div class="form-control mb-0">
							<select id="year" v-model.number="newStudent.year" required>
								<option v-for="option in 4" :value="option">
									{{ option }}
								</option>
							</select>
						</div>
					</div>
					<div class="table-cell">
						<div class="buttons">
							<button type="submit" class="btn primary">
								+ Добавить нового студента
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useStudentsStore } from '@/stores/students'

export default {
	data() {
		return {
			editableStudent: {
				id: null,
				name: '',
				phone: '',
				year: '',
			},
			newStudent: {
				name: '',
				phone: '',
				year: '',
			},
			sortingKey: '',
			sortingReverse: false,
		}
	},
	methods: {
		...mapActions(useStudentsStore, {addToStore: 'add', editInStore: 'edit', deleteFromStore: 'delete'}),
		addStudent() {
			this.addToStore({
				name: this.newStudent.name,
				phone: this.newStudent.phone,
				year: this.newStudent.year,
			})

			this.newStudent.name = ''
			this.newStudent.phone = ''
			this.newStudent.year = ''
		},
		editStudent({id, name, phone, year}) {
			this.editableStudent = {id, name, phone, year}
		},
		saveStudent() {
			this.editInStore({...this.editableStudent})
			this.editableStudent.id = null
		},
		cancelEditing() {
			this.editableStudent.id = null
		},
		deleteStudent(id) {
			const isDelete = confirm('Уверены что хотите удалить?');
			if (isDelete) {
				this.deleteFromStore(id)
			}
		},
		sortStudents(key) {
			if (key === this.sortingKey) {
				this.sortingReverse = !this.sortingReverse
			} else {
				this.sortingReverse = false
			}

			this.sortingKey = key
		},
	},
	computed: {
		...mapState(useStudentsStore, ['students']),
		sortedStudents() {
			if (this.sortingKey) {
				const students = [...this.students].sort((a, b) => {
					const key = this.sortingKey

					if (a[key] < b[key]) {
						return -1
					}

					if (a[key] > b[key]) {
						return 1
					}

					return 0
				})

				if (this.sortingReverse) {
					students.reverse()
				}

				return students
			}

			return this.students
		}
	}
}
</script>

<style scoped>
.buttons {
	display: flex;
	justify-content: end;
	gap: 0.5rem;
	white-space: nowrap;
}
</style>